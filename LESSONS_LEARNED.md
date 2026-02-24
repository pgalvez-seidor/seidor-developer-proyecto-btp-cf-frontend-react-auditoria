# Lecciones Aprendidas: Arquitectura y Seguridad BTP (Usuarios NUAM)

Este documento consolida las lecciones críticas aprendidas durante la implementación, despliegue y corrección de la arquitectura de seguridad en SAP BTP para el proyecto NUAM.

## 1. Arquitectura de Seguridad (XSUAA)

### Unificación de Instancias XSUAA
*   **Problema**: El uso de instancias XSUAA separadas para Frontend (`nuam-xsuaa`) y Backend/Gateway (`xsuaa-central`) crea problemas complejos de confianza (`trust`) y delegación de tokens.
    *   El Destination Service (`OAuth2UserTokenExchange`) requiere que la instancia XSUAA del destino confíe explícitamente en la instancia que emitió el token original (Work Zone / Frontend).
*   **Solución (Best Practice)**: Utilizar **una única instancia XSUAA centralizada** (`xsuaa-central`) para todos los componentes del sistema:
    *   Frontend (AppRouter/HTML5 Repo).
    *   Backend (CAP/NestJS).
    *   Gateway.
    *   Destinos en BTP.
*   **Gestión en MTA**: Definir `xsuaa-central` como `existing-service` en el `mta.yaml` asegura que todos los módulos se vinculen a la misma fuente de verdad.

### Configuración de `xs-security.json`
*   **Strictness de Sintaxis**:
    *   **Nombres de Atributos**: XSUAA no permite guiones medios (`-`) en los nombres de atributos. Usar guiones bajos (`role_collections` en lugar de `role-collections`).
    *   **Prefijos de Scopes**: Al actualizar un servicio existente, los nuevos scopes deben tener el prefijo `$XSAPPNAME.` (ej: `$XSAPPNAME.user`).
    *   **Referencias a Apps**: En `grant-as-authority-to-apps`, NO se permite la sintaxis de variable `$XSAPPNAME(...)` durante actualizaciones. Se debe usar el `xsappname` literal (ej: `nuam-users-comparison`).
*   **Inmutabilidad del xsappname**: No se puede cambiar el `xsappname` de una instancia de servicio existente mediante `cf update-service`. Se debe usar el nombre original generado (ej: `na-73051f...`).

## 2. Servicios BTP y Despliegue

### HTML5 Apps Repo & Bindings
*   **Error 500 "CODE: 1001"**: Si se cambia la instancia XSUAA vinculada al `html5-apps-repo-host` (ej: de `nuam-xsuaa` a `xsuaa-central`), el servicio puede quedar en un estado inconsistente.
*   **Solución**: Se debe **eliminar y recrear** la instancia `nuam-html5-repo-host` (y sus service-keys) para que el nuevo binding se aplique correctamente. Un simple `update` o `deploy` no es suficiente.

### Destination Service Caching
*   **Credenciales Desactualizadas**: Los Destinos en BTP (`nuam_xsuaa`) cachean el `clientsecret` de la instancia XSUAA. Si se recrea la instancia XSUAA, el Destino **no se actualiza automáticamente** y las peticiones fallan con 401/500 intempestivos.
*   **Procedimiento de Regeneración**:
    1.  Eliminar manualmente el destino en BTP Cockpit.
    2.  Redesplegar el módulo `nuam-destination-content` (o todo el proyecto).
    3.  Esto fuerza al deployer a leer las nuevas credenciales de la service-key y crear el destino limpio.

## 3. Integración con SAP Build Work Zone

### Actualización de Contenido (IDs)
*   **Tiles Rotos**: Al cambiar el `html5-apps-repo-host`, el `app-host-id` cambia. Los tiles existentes en Work Zone apuntarán al ID antiguo y darán Error 500.
*   **Flujo de Corrección**:
    1.  Channel Manager -> "Update Content".
    2.  Content Manager -> Eliminar Apps antiguas.
    3.  Content Explorer -> Agregar Apps nuevamente (con el nuevo ID).

## 4. Frontend (React)

### Configuración del Manifiesto
*   Para que la app aparezca en Work Zone, es obligatorio el `crossNavigation` en `manifest.json`.
*   Sin esto, el HTML5 Repo la aloja pero no es descubrible como Tile.

```json
"crossNavigation": {
    "inbounds": {
        "manage-nuam-users": {
            "semanticObject": "NuamUser",
            "action": "manage"
        }
    }
}
```
