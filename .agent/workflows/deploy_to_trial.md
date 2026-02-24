---
description: Guía de Despliegue a Trial (Dev) con Integración Work Zone
---

# Despliegue de nuam-react-usuarios a SAP BTP Trial (Dev)

Este flujo de trabajo describe los pasos para construir y desplegar la aplicación frontend en tu cuenta Trial de SAP BTP, asegurando que se integre correctamente con SAP Build Work Zone.

## Prerrequisitos

1.  **Login en Cloud Foundry**:
    Asegúrate de estar logueado en tu cuenta trial y en el espacio correcto (ej: `dev`).
    ```bash
    cf login
    cf target -o <tu-org> -s dev
    ```

2.  **Servicios**:
    Verifica que existan los servicios necesarios en tu espacio (o el MTA los creará si no existen):
    *   `Authorization & Trust Management (xsuaa)` -> nombre: `dealerportal-nuam` (o el que uses compartido)
    *   `Destination Service` -> nombre: `destination-service`
    *   `HTML5 Application Repository` -> nombre: `nuam-html5-repo-host` (se creará)

## Pasos de Despliegue

### 1. Construir el proyecto (MTA)
Genera el archivo `.mtar` listo para desplegar.
```bash
mbt build -t ./
```

### 2. Desplegar a Cloud Foundry
Despliega el archivo generado.
```bash
cf deploy nuam-react-usuarios_1.0.0.mtar
```

### 3. Verificar en SAP Build Work Zone
Una vez desplegado:
1.  Ve a tu **SAP Build Work Zone** (Site Manager).
2.  Navega a **Channel Manager**.
3.  Actualiza ("Refresh") el canal **HTML5 Apps**.
4.  Ve a **Content Manager**.
5.  Busca tu aplicación (`nuam.react.users`) en el "Content Explorer".
6.  Agrégala a tu contenido ("Add to My Content").
7.  Crea o asigna el rol necesario si aplica.
8.  Agrega la aplicación a un Grupo o Catálogo visible en tu sitio.

## Notas Importantes

*   **Destino Backend**: La aplicación espera un destino llamado `dest-nuam-apigateway-backend-dev` en tu subcuenta BTP. Asegúrate de crearlo manualmente en el Cockpit (Connectivity -> Destinations) apuntando a la URL de tu backend desplegado (`nuam-backend-usuario-srv`).

*   **Limpiar Caché**: Si no ves los cambios en Work Zone inmediatamente, limpia la caché del navegador o usa el servicio "HTML5 App Repo" para borrar la caché del host.
