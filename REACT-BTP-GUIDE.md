# Guía de Desarrollo: React App en SAP BTP con UI5 Web Components

> **Propósito**: Concentrar TODO lo aprendido al construir la app NUAM Usuarios para evitar
> repetir los mismos errores en proyectos futuros. Cada sección marca claramente los
> **errores reales** que se cometieron y la **solución confirmada** que funcionó.
>
> Proyecto de referencia: `NUAM/Usuarios/` — React 19 + Vite + UI5 Web Components React
>
> - Express/CAP backend + SAP HANA HDI + SAP Build Work Zone

---

## Tabla de contenidos

1. [Arquitectura del proyecto](#1-arquitectura-del-proyecto)
2. [Pre-requisitos y herramientas](#2-pre-requisitos-y-herramientas)
3. [MTA Build & Deploy — el gran gotcha del zip](#3-mta-build--deploy--el-gran-gotcha-del-zip)
4. [Backend Express + CAP](#4-backend-express--cap)
5. [SAP HANA y transacciones](#5-sap-hana-y-transacciones)
6. [SAP UI5 Web Components React — estilizado y Shadow DOM](#6-sap-ui5-web-components-react--estilizado-y-shadow-dom)
7. [Focus ring: cómo eliminar el rectángulo SAP y aplicar glow pill](#7-focus-ring-cómo-eliminar-el-rectángulo-sap-y-aplicar-glow-pill)
8. [Autenticación: XSUAA y modo local](#8-autenticación-xsuaa-y-modo-local)
9. [Integración con SAP Build Work Zone](#9-integración-con-sap-build-work-zone)
10. [Limitaciones de BTP Trial](#10-limitaciones-de-btp-trial)
11. [TypeScript — configuración que no rompe](#11-typescript--configuración-que-no-rompe)
12. [Errores frecuentes — tabla de referencia rápida](#12-errores-frecuentes--tabla-de-referencia-rápida)
13. [Checklist de deploy](#13-checklist-de-deploy)
14. [Plantillas de código listas para copiar](#14-plantillas-de-código-listas-para-copiar)

---

## 1. Arquitectura del proyecto

```
Usuarios/
├── nuam-react-usuarios/        ← Frontend React 19 + Vite + UI5 Web Components
├── nuam-sapui5-usuarios/       ← Frontend SAPUI5 (alternativo)
├── nuam-backend-usuario/       ← Backend Express + CAP + HANA
├── config/
│   └── mta.base-dev.yaml       ← Template MTA (NUNCA editar mta.yaml directamente)
├── deploy.sh                   ← Script de despliegue frontend
└── .env                        ← Credenciales BTP (gitignoreado)
```

### Flujo de una petición completa

```
Browser → Work Zone → Managed Approuter → Destination (API Gateway)
→ NestJS/Express /usuario-compuesto/* → auth-middleware
→ Controller → UseCase → Repository
→ repository.service.send('action') → CAP service.js handler → HANA
```

### Flujo de despliegue

```
./deploy.sh
  └── cp config/mta.base-dev.yaml mta.yaml
  └── mbt build → genera mta_archives/*.mtar
  └── cf deploy *.mtar
        ├── nuam-react-app (html5, builder:custom)  → zip + upload a HTML5 Repo
        └── nuam-app-deployer (content deployer)    → crea data.zip con los zips
```

---

## 2. Pre-requisitos y herramientas

```bash
# Versiones mínimas probadas
node --version      # v20.x
cf --version        # CF CLI v8+
mbt --version       # 1.2.x
cf plugins          # Debe incluir 'multiapps'

# Login BTP antes de deploy
cf api https://api.cf.us10-001.hana.ondemand.com
cf login -u EMAIL -p PASS -o ORG -s SPACE
```

**Variables en `.env`** (crear desde `.env.template`):

```env
ENVIRONMENT=dev
EMAIL_BTP=tu@email.com
PASSWORD_BTP=tupass
API_ENDPOINT_BTP=https://api.cf.us10-001.hana.ondemand.com
ORG_DEV=b83bb89ctrial
SPACE_DEV=dev
VITE_URL_APIGATEWAY=https://...cfapps.us10-001.hana.ondemand.com
VITE_DESTINATION_API_GATEWAY_BACKEND=dest-nuam-apigateway-backend-dev
```

---

## 3. MTA Build & Deploy — el gran gotcha del zip

### ❌ El error más costoso del proyecto

MBT ejecuta los comandos de módulos `html5` con `builder: custom` en un **directorio temporal** (copia del source). Los zips creados ahí **NO aparecen en el source original**. El deployer (`com.sap.application.content`) busca los artifacts en la ruta ORIGINAL del source → resultado: `data.zip` vacío o deploy fallido.

### ✅ Solución confirmada

**Crear los zips ANTES de llamar `mbt build`**, en el `deploy.sh`:

```bash
# deploy.sh — ANTES de mbt build
cd nuam-react-usuarios
npm run build                          # tsc + vite build → dist/
cd dist && zip -r dist.zip . && cd ..  # zip en source original

cd ../nuam-sapui5-usuarios
cd webapp && zip -r webapp.zip . && cd ..

cd ..
mbt build -p cf -t ./mta_archives --mtar nuam-usuarios.mtar
cf deploy ./mta_archives/nuam-usuarios.mtar -f
```

**Configuración MTA que funciona:**

```yaml
modules:
  - name: nuam-react-app
    type: html5
    path: nuam-react-usuarios
    build-parameters:
      builder: custom
      build-result: dist # ← zip se llama dist.zip
      commands: [] # ← VACÍO: el npm run build ya se hizo en deploy.sh

  - name: nuam-app-deployer
    type: com.sap.application.content
    requires:
      - name: nuam-html5-repo-host
        parameters:
          content-target: true
      - name: nuam-react-app
        parameters:
          content-type: application/zip

resources:
  - name: nuam-html5-repo-host
    type: org.cloudfoundry.managed-service
    parameters:
      service: html5-apps-repo
      service-plan: app-host
```

**Estructura del `data.zip`** que genera el deployer:

```
data.zip
  └── dist.zip          ← HTML5 Repo necesita un zip-dentro-de-zip por app
  └── webapp.zip        ← si hay múltiples apps HTML5
```

### ⚠️ Build del backend — el otro gotcha

`cds build --production` **borra y recrea** `gen/`, eliminando el `dist/` compilado de TypeScript/NestJS. El MTA `before-all` debe hacer:

```yaml
before-all:
  - builder: custom
    commands:
      - npm run build # TypeScript → dist/, cds build → gen/
      - cp -r dist/. gen/srv/ # Restaurar dist DENTRO del artifact CAP
```

El orden importa: primero TypeScript, luego CAP build, luego copiar.

---

## 4. Backend Express + CAP

### Arquitectura de capas (orden estricto)

```
Router (express) → Controller → UseCase → Repository → CDS service.send()
                                                              ↓
                                                    usuario-service.js
                                                    (handlers CAP)
                                                              ↓
                                                           HANA
```

### ❌ Error: campos UI enviados al backend CAP

**Síntoma**: `{"message": "Property \"valueStateUsuario\" does not exist in UsuarioService.modificarUsuario"}`

**Causa**: El frontend enviaba el objeto de estado de React completo (con campos como `valueStateUsuario`, `initialTipoDoc`, etc.) directo al endpoint. CDS 8 valida **estrictamente** los parámetros contra la definición `.cds`.

**Solución**: Desestructurar en el UseCase, antes de llamar al Repository:

```typescript
// ❌ MAL — envía todo el body sin filtrar
async modificarUsuario(body: any, req: any) {
  return await this.usuarioRepository.modificarUsuario(body);
}

// ✅ BIEN — solo extrae los campos definidos en el .cds
async modificarUsuario(body: any, req: any) {
  const { modificarUsuario, modificarRoles } = body;
  return await this.usuarioRepository.modificarUsuario({
    modificarUsuario,
    modificarRoles: modificarRoles ?? [],
    // Campos obligatorios en el CDS aunque estén vacíos:
    categoriaTipoPublicacion: [],
    modificarSociedades: [],
    modificarConcesionario: [],
    modificarConcesionarioSucursal: [],
  });
}
```

**Regla**: El UseCase es el lugar correcto para separar el modelo de dominio del modelo de UI.

### Definición CDS — cómo agregar una nueva acción

Siempre hay que modificar **cuatro archivos** por cada acción nueva:

```
1. srv/usuario-service.cds  → definición de la acción
2. srv/usuario-service.js   → handler CDS
3. src/repositories/        → llamada a service.send()
4. src/usecases/            → lógica de negocio
5. src/controllers/         → handler Express
6. src/routers/             → ruta POST
```

```cds
// usuario-service.cds
@protocol: 'rest'
service UsuarioService {
  action activarUsuario(email: String) returns {
    oAuditResponse: {
      code    : Integer;
      message : String;
    };
    oDataResponse: {};
  };
}
```

```javascript
// usuario-service.js
this.on("activarUsuario", async (req) => {
  const tx = cds.tx(req);
  try {
    const { email } = req.data;
    const usuario = await tx.run(
      SELECT.one.from("UsuarioService.Usuario").where({ correo: email }),
    );
    if (!usuario) throw new Error("Usuario no encontrado");
    await tx.run(
      UPDATE("UsuarioService.Usuario")
        .set({ id_estado: 1 })
        .where({ correo: email }),
    );
    await tx.commit(); // ← OBLIGATORIO en CDS 8 con HANA
    return { oAuditResponse: { code: 200, message: "OK" }, oDataResponse: {} };
  } catch (e) {
    try {
      await tx.rollback();
    } catch (_) {}
    throw e;
  }
});
```

---

## 5. SAP HANA y transacciones

### ❌ El error del "pending" eterno — el más difícil de diagnosticar

**Síntoma**: La petición se queda en `pending` en el browser sin responder. La base de datos muestra el registro bloqueado. En logs: `Acquiring client from pool timed out`.

**Causa**: En **CDS 8.x con HANA**, las transacciones creadas con `cds.tx(req)` son **transacciones raíz** que **NO se auto-commitean**. La conexión HANA queda bloqueada indefinidamente hasta que se hace commit o rollback explícito.

**Esta es la trampa**: En SQLite (desarrollo local) las transacciones SÍ se auto-commitean, por lo que el código "funciona en local pero falla en BTP".

**Solución — patrón obligatorio para TODOS los handlers de escritura**:

```javascript
this.on('miAccion', async (req) => {
  const tx = cds.tx(req);
  try {
    // ... operaciones de BD ...
    await tx.run(INSERT.into(...).entries(...));
    await tx.run(UPDATE(...).set(...).where(...));

    await tx.commit();  // ← SIEMPRE en el happy path

    return { oAuditResponse: { code: 200 }, oDataResponse: resultado };
  } catch (e) {
    try { await tx.rollback(); } catch (_) { /* ignorar error de rollback */ }
    // re-lanzar o retornar error
    return { oAuditResponse: { code: 500, message: e.message }, oDataResponse: {} };
  }
});
```

### Diagnóstico del pool de HANA bloqueado

```
Error: "Acquiring client from pool timed out"
Pool state: { borrowed: 0, pending: 0, size: 1, available: 0 }
```

→ `size: 1, available: 0` = la única conexión está ocupada (no committed).
→ Reiniciar el CF app libera el pool inmediatamente como workaround temporal.

### Regla de oro: HANA tiene pool de tamaño 1 en BTP Trial

BTP Trial asigna pool de 1 conexión. Si hay UNA transacción sin commit, **toda la app queda bloqueada**. En producción con pool mayor el síntoma es menos obvio pero el bug existe igual.

### Binding correcto de servicios HANA

Si tienes múltiples servicios HANA (`HDI_MAESTROS_DB`, `nuam-usuario-db`, etc.), CAP se conecta al **primero que encuentra** en `VCAP_SERVICES`. Para modo hybrid:

1. Generar `default-env.json` con todos los servicios
2. **Borrar manualmente** la entrada del servicio incorrecto
3. Dejar solo `nuam-usuario-db`

---

## 6. SAP UI5 Web Components React — estilizado y Shadow DOM

### El problema fundamental

SAP UI5 Web Components usan **Shadow DOM**. El CSS normal NO penetra el Shadow DOM. El tema Horizon se carga dinámicamente DESPUÉS de tu CSS. Resultado: tus estilos son ignorados.

### Estrategia triple que funciona (Seidor Theme)

Para cada componente que quieras estilizar:

```css
/* 1. CSS custom properties en el host — se heredan al shadow DOM */
ui5-input {
  --sapField_BorderCornerRadius: 999px !important;
  --sapContent_FocusStyle: none !important;
  border-radius: 999px !important;
}

/* 2. ::part() para penetrar el shadow DOM donde el componente lo exponga */
ui5-input::part(root) {
  border-radius: 999px !important;
  outline: none !important;
}

/* 3. :focus-within para estados de foco */
ui5-input:focus-within::part(root) {
  box-shadow: 0 0 0 2px rgba(0, 160, 227, 0.45) !important;
  border-color: #00a0e3 !important;
}
```

### Partes expuestas por cada componente UI5 v2

| Componente               | Parts disponibles             |
| ------------------------ | ----------------------------- |
| `ui5-button`             | `button`                      |
| `ui5-input`              | `root`                        |
| `ui5-select`             | `root`                        |
| `ui5-combobox`           | `root`                        |
| `ui5-multi-combobox`     | `root`                        |
| `ui5-date-picker`        | `root`                        |
| `ui5-time-picker`        | `root`                        |
| `ui5-textarea`           | `root`                        |
| `ui5-checkbox`           | `root`                        |
| `ui5-radio-button`       | `root`                        |
| `ui5-list`               | `list`                        |
| `ui5-list-item-standard` | `root`, `native-li`           |
| `ui5-dialog`             | `content`, `header`, `footer` |
| `ui5-panel`              | `root`                        |
| `ui5-bar`                | `bar`                         |

### Min-width en botones UI5: usar inline style, NO Tailwind

```tsx
// ❌ MAL — Tailwind no penetra el shadow DOM del componente
<Button className="tw-min-w-[100px]">Cancelar</Button>

// ✅ BIEN — inline style sí llega al host del web component
<Button style={{ minWidth: '110px', '--sapButton_BorderCornerRadius': '999px' }}>
  Cancelar
</Button>
```

### MessageStripDesign — valores válidos

```tsx
// ❌ Error de TypeScript — Warning NO existe
design={MessageStripDesign.Warning}

// ✅ Valores disponibles en @ui5/webcomponents-react v2:
design={MessageStripDesign.Information}  // azul
design={MessageStripDesign.Positive}     // verde
design={MessageStripDesign.Negative}     // rojo
design={MessageStripDesign.Critical}     // naranja/amarillo (usa este en lugar de Warning)
```

---

## 7. Focus ring: cómo eliminar el rectángulo SAP y aplicar glow pill

Este fue el problema visual más persistente del proyecto. El tema Horizon aplica rectángulos de foco en TODOS los componentes UI5, ignorando `border-radius`, y carga dinámicamente DESPUÉS del CSS del app.

### ✅ Solución definitiva — CSS al inicio de tu hoja de estilos global

```css
/* ═══════════════════════════════════════════════════════════════════════
   PASO 1: Suprimir TODOS los indicadores de foco SAP globalmente.
   Las CSS custom properties se heredan al shadow DOM → ganan sobre el tema.
   ═══════════════════════════════════════════════════════════════════════ */
:root {
  --sapContent_FocusStyle: none !important;
  --sapContent_FocusWidth: 0px !important;
  --sapContent_FocusColor: transparent !important;
}

/* ═══════════════════════════════════════════════════════════════════════
   PASO 2: Neutralizar la parte interna del botón (usa :focus-visible
   además de :focus porque SAP los aplica por separado en Horizon).
   ═══════════════════════════════════════════════════════════════════════ */
ui5-button::part(button):focus,
ui5-button::part(button):focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

/* ═══════════════════════════════════════════════════════════════════════
   PASO 3: Agregar tu propio glow en el host element.
   :focus-within cubre el caso de delegatesFocus:true donde el foco
   va al inner element pero el host no recibe :focus-visible directamente.
   ═══════════════════════════════════════════════════════════════════════ */
ui5-button:focus-visible,
ui5-button:focus-within {
  outline: 2px solid rgba(0, 160, 227, 0.6) !important;
  outline-offset: 2px !important;
  border-radius: 999px !important;
}

/* ═══════════════════════════════════════════════════════════════════════
   PASO 4: Para inputs, el glow va dentro del ::part(root) como box-shadow
   (el outline no sigue el border-radius interno del shadow DOM).
   ═══════════════════════════════════════════════════════════════════════ */
ui5-input::part(root),
ui5-select::part(root),
ui5-combobox::part(root),
ui5-multi-combobox::part(root) {
  outline: none !important;
}

ui5-input:focus-within::part(root),
ui5-select:focus-within::part(root),
ui5-combobox:focus-within::part(root),
ui5-multi-combobox:focus-within::part(root) {
  box-shadow: 0 0 0 2px rgba(0, 160, 227, 0.45) !important;
  border-color: #00a0e3 !important;
}

/* ═══════════════════════════════════════════════════════════════════════
   PASO 5: Eliminar outlines en listas y tablas (también se focusan).
   ═══════════════════════════════════════════════════════════════════════ */
ui5-list::part(list),
ui5-list-item-standard::part(root),
ui5-list-item-standard::part(native-li) {
  outline: none !important;
  box-shadow: none !important;
}

/* AnalyticalTable (divs con roles ARIA) */
[role="row"]:focus,
[role="row"]:focus-visible,
[role="gridcell"]:focus,
[role="gridcell"]:focus-visible,
[role="columnheader"]:focus,
[role="columnheader"]:focus-visible {
  outline: none !important;
}
```

### Por qué NO funcionan otros enfoques

| Enfoque                                               | Por qué falla                                                                           |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `outline: none` en el host                            | El rectángulo viene del shadow DOM, no del host                                         |
| `--sapContent_FocusStyle: none` solo en el componente | El tema Horizon carga después y sobreescribe                                            |
| `ui5-button::part(button):focus` sin `:focus-visible` | SAP Horizon usa `:focus-visible` internamente para el part, son pseudo-clases distintas |
| CSS en `index.css` importado después de UI5           | El tema dinámico igualmente puede ganar según el orden de shadow adoptedStyleSheets     |
| `!important` sin `::part()`                           | CSS normal no penetra shadow DOM en absoluto                                            |

---

## 8. Autenticación: XSUAA y modo local

### Estructura en MTA para deshabilitar auth en Trial/Dev

```yaml
# mta.yaml — módulo backend
properties:
  DISABLE_AUTH: "true" # ← deshabilita XSUAA, usa CAP mocked auth
```

### Lógica en el servidor (server.ts)

```typescript
// DEBE ejecutarse ANTES de cds.on('bootstrap')
if (process.env.DISABLE_AUTH === "true") {
  cds.env.requires ??= {};
  cds.env.requires.auth = { kind: "mocked" };
}

cds.on("bootstrap", async (app) => {
  const authMiddleware = new AuthMiddleware();
  // AuthMiddleware.middleware() lee DISABLE_AUTH internamente
  app.use("/usuario-compuesto", authMiddleware.middleware());
  app.use("/usuario-compuesto", usuarioRouter(controller));
});
```

### Desarrollo local — sin autenticación

```typescript
// auth-middleware.ts
middleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'local' || process.env.DISABLE_AUTH === 'true') {
      cds.context = { user: new cds.User.Privileged() };
      return next();
    }
    // validación XSUAA real...
  };
}
```

### `xs-app.json` — enrutamiento desde Work Zone

```json
{
  "welcomeFile": "/index.html",
  "authenticationMethod": "route",
  "routes": [
    {
      "source": "^/api/(.*)$",
      "target": "/api/$1",
      "destination": "dest-nuam-apigateway-backend-dev",
      "authenticationType": "xsuaa"
    },
    {
      "source": "^(.*)$",
      "target": "$1",
      "service": "html5-apps-repo-rt",
      "authenticationType": "xsuaa"
    }
  ]
}
```

---

## 9. Integración con SAP Build Work Zone

### `manifest.json` — configuración mínima obligatoria

```json
{
  "sap.app": {
    "id": "com.empresa.miapp",
    "type": "application",
    "crossNavigation": {
      "inbounds": {
        "MiApp-manage": {
          "semanticObject": "MiApp",
          "action": "manage",
          "title": "Mi App",
          "icon": "sap-icon://home"
        }
      }
    }
  },
  "sap.cloud": {
    "public": true,
    "service": "com.empresa"   ← debe coincidir entre apps del mismo portal
  }
}
```

### Pasos manuales post-deploy (obligatorios SIEMPRE)

```
1. SAP Build Work Zone → Channel Manager → Refresh "HTML5 Apps"
   (sin esto el Work Zone no ve la nueva versión)

2. Content Manager → Content Explorer → HTML5 Apps
   → Busca tu app → "Add to My Content"

3. Content Manager → My Content → Grupos
   → Asignar app al grupo deseado

4. Content Manager → My Content → Roles
   → Asignar app al rol "Everyone" (o el rol que corresponda)
```

### Vite — configuración de proxy para desarrollo local

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      "/api/compuesto/usuario/rest": {
        target: "http://localhost:4004/api",
        changeOrigin: true,
        rewrite: (path) => path.replace("/api/compuesto/usuario/rest", ""),
      },
      "/api/base/maestro/rest": {
        target:
          "https://tu-backend-remoto.cfapps.us10-001.hana.ondemand.com/api",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  base: "./", // ← OBLIGATORIO para Work Zone (rutas relativas en iframe)
});
```

`base: './'` es crítico — sin esto los assets (JS, CSS) del build usan rutas absolutas que fallan dentro del iframe de Work Zone.

---

## 10. Limitaciones de BTP Trial

| Limitación                                | Impacto                                       | Workaround                                                 |
| ----------------------------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| Pool HANA = 1 conexión                    | Cualquier tx sin commit bloquea toda la app   | Commit/rollback explícito en TODOS los handlers            |
| Sin nombres de esquema HDI personalizados | `schemaParameterChangeNotSupported` al deploy | No usar `config: schema:` en el resource HANA del mta.yaml |
| Sin `secureStoreImplementation`           | Errores en servicios con keystore             | Omitir esa propiedad                                       |
| Quotas de CF limitadas                    | Out of memory en builds complejos             | Hacer build local, no en CF                                |
| Certificados self-signed en destinos      | Handshake errors                              | `skipCertificateValidation: true` en el destino (solo dev) |

**Configuración HDI correcta para Trial:**

```yaml
# mta.yaml
resources:
  - name: nuam-usuario-db
    type: com.sap.xs.hdi-container
    parameters:
      service: hana
      service-plan: hdi-shared
      # ← NO agregar "config: schema: ..." aquí en Trial
```

---

## 11. TypeScript — configuración que no rompe

```json
// tsconfig.json — configuración probada que funciona
{
  "compilerOptions": {
    "strict": false, // ← mantener en false; strict: true rompe código legado de UI5
    "noUnusedLocals": false, // ← UI5 importa muchas cosas que parecen no usarse
    "noUnusedParameters": false,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"] // ← alias para imports absolutos
    }
  }
}
```

---

## 12. Errores frecuentes — tabla de referencia rápida

| Error                                           | Causa                                                                 | Solución                                                                 |
| ----------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `Property "X" does not exist in Service.accion` | Se envían campos extra al handler CDS (campos de UI, estado de React) | Desestructurar en UseCase, enviar solo campos definidos en el .cds       |
| `Acquiring client from pool timed out`          | Transacción CDS sin commit en HANA                                    | `await tx.commit()` en happy path, `await tx.rollback()` en catch        |
| `schemaParameterChangeNotSupported`             | Nombre de esquema personalizado en BTP Trial                          | Quitar `config: schema:` del resource HANA                               |
| `data.zip` vacío o sin apps HTML5               | MBT crea el zip en directorio temporal, no en source                  | Crear zip ANTES de mbt build, en deploy.sh                               |
| `dist/` perdido después de `cds build`          | `cds build --production` recrea gen/                                  | `cp -r dist/. gen/srv/` después del build                                |
| `MessageStripDesign.Warning` TypeScript error   | `Warning` no existe en la versión usada                               | Usar `MessageStripDesign.Critical`                                       |
| Focus ring rectangular en todos los controles   | Horizon theme ignora `border-radius` y usa shadow DOM                 | `:root { --sapContent_FocusStyle: none !important }` + reglas `::part()` |
| `min-w-[100px]` Tailwind no funciona en UI5     | Tailwind no penetra shadow DOM de web components                      | Usar `style={{ minWidth: '110px' }}` como inline style                   |
| App Work Zone no actualiza tras deploy          | Channel Manager no refresca automáticamente                           | Ir a Channel Manager → Refresh HTML5 Apps manualmente                    |
| HANA conecta al servicio incorrecto en hybrid   | CAP toma el primer servicio HANA de VCAP_SERVICES                     | Eliminar la entrada incorrecta de default-env.json                       |
| `DISABLE_AUTH` ignorado                         | Se configura DESPUÉS de `cds.on('bootstrap')`                         | Moverlo ANTES del listener de bootstrap                                  |
| Rutas absolutas en build de Vite                | `base: '/'` por defecto                                               | Cambiar a `base: './'` en vite.config.ts                                 |
| `await` faltante en service call                | Async sin await en función async                                      | Revisar TODOS los calls a servicios con `await`                          |

---

## 13. Checklist de deploy

### Antes de cada deploy

```
[ ] Variables en .env correctas (ENVIRONMENT, credenciales BTP)
[ ] npm run build exitoso en local (o en CI)
[ ] TypeScript sin errores (tsc --noEmit)
[ ] Zips creados en rutas originales (dist/dist.zip, webapp/webapp.zip)
[ ] mta.yaml apunta al template correcto (config/mta.base-dev.yaml)
[ ] DISABLE_AUTH configurado según el ambiente
[ ] Sin console.log con datos sensibles
[ ] tx.commit() en TODOS los handlers de escritura del backend
```

### Después de cada deploy

```
[ ] Work Zone → Channel Manager → Refresh HTML5 Apps
[ ] Verificar que la app carga sin errores de consola
[ ] Probar flujo de autenticación (si DISABLE_AUTH=false)
[ ] Verificar que las peticiones al backend responden (no quedan en pending)
[ ] Revisar logs en CF: cf logs nombre-app --recent
```

---

## 14. Plantillas de código listas para copiar

### NuamButton — botón pill con min-width

```tsx
import React from "react";
import { Button, ButtonPropTypes } from "@ui5/webcomponents-react";

type Variant = "primary" | "secondary" | "glass";

const variantClasses: Record<Variant, string> = {
  primary:
    "tw-bg-gradient-to-r tw-from-[#005a92] tw-to-[#00a0e3] tw-text-white",
  secondary: "tw-bg-white tw-text-[#005a92] tw-border tw-border-[#005a92]/20",
  glass:
    "tw-bg-white/10 tw-backdrop-blur-md tw-text-white tw-border tw-border-white/20",
};

const NuamButton: React.FC<
  ButtonPropTypes & { variant?: Variant; round?: boolean }
> = ({
  variant = "primary",
  round = false,
  children,
  className,
  style,
  ...rest
}) => {
  const pillStyle = round
    ? ({ "--sapButton_BorderCornerRadius": "999px" } as React.CSSProperties)
    : ({
        "--sapButton_BorderCornerRadius": "999px",
        minWidth: "110px",
      } as React.CSSProperties);

  const baseClass = round
    ? "tw-rounded-full tw-p-0 tw-w-9 tw-h-9 tw-flex tw-items-center tw-justify-center"
    : "tw-rounded-full tw-font-medium";

  return (
    <Button
      {...rest}
      style={{ ...pillStyle, ...style }}
      className={`${baseClass} ${variantClasses[variant]} ${className ?? ""}`}
    >
      {children}
    </Button>
  );
};

export default NuamButton;
```

### CustomDialog — diálogo con header/footer personalizados

```tsx
import { Dialog } from "@ui5/webcomponents-react";
import { ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  header: string;
  footer: ReactNode;
  children: ReactNode;
}

export default function CustomDialog({
  open,
  onClose,
  header,
  footer,
  children,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      style={{ borderRadius: "1.5rem", minWidth: "560px", maxWidth: "700px" }}
      header={
        <div
          style={{
            padding: "1rem 1.5rem",
            fontWeight: 700,
            fontSize: "1.1rem",
          }}
        >
          {header}
        </div>
      }
      footer={<div style={{ padding: "0.75rem 1.5rem" }}>{footer}</div>}
    >
      <div style={{ padding: "1.5rem" }}>{children}</div>
    </Dialog>
  );
}
```

### Handler CAP — patrón completo con commit/rollback

```javascript
// srv/usuario-service.js
this.on("miAccion", async (req) => {
  const tx = cds.tx(req);
  const bundle = getBundle(req.locale);
  try {
    const { campo1, campo2 } = req.data;

    // Validaciones
    if (!campo1)
      return {
        oAuditResponse: { code: 400, message: "Campo1 requerido" },
        oDataResponse: {},
      };

    // Operaciones de BD
    const resultado = await tx.run(
      INSERT.into("UsuarioService.MiEntidad").entries({ campo1, campo2 }),
    );

    await tx.commit(); // ← SIEMPRE

    return {
      oAuditResponse: { code: 200, message: "OK" },
      oDataResponse: resultado,
    };
  } catch (e) {
    try {
      await tx.rollback();
    } catch (_) {}
    req.error({ code: 500, message: e.message });
  }
});
```

### seidor-theme.css — hoja de estilos mínima para nueva app

```css
/* Importar este archivo ANTES que cualquier otro CSS de UI5 */

/* 1. Suprimir indicadores de foco SAP globalmente */
:root {
  --sapContent_FocusStyle: none !important;
  --sapContent_FocusWidth: 0px !important;
  --sapContent_FocusColor: transparent !important;
}

/* 2. Botones pill */
ui5-button {
  --sapButton_BorderCornerRadius: 999px !important;
  border-radius: 999px !important;
}
ui5-button::part(button) {
  border-radius: 999px !important;
}
ui5-button::part(button):focus,
ui5-button::part(button):focus-visible {
  outline: none !important;
  box-shadow: none !important;
}
ui5-button:focus-visible,
ui5-button:focus-within {
  outline: 2px solid rgba(0, 160, 227, 0.6) !important;
  outline-offset: 2px !important;
  border-radius: 999px !important;
}

/* 3. Inputs pill con glow */
ui5-input,
ui5-select,
ui5-combobox,
ui5-multi-combobox,
ui5-date-picker,
ui5-time-picker,
ui5-textarea {
  --sapField_BorderCornerRadius: 999px !important;
  border-radius: 999px !important;
}
ui5-input::part(root),
ui5-select::part(root),
ui5-combobox::part(root),
ui5-multi-combobox::part(root),
ui5-date-picker::part(root),
ui5-textarea::part(root) {
  border-radius: 999px !important;
  outline: none !important;
}
ui5-input:focus-within::part(root),
ui5-select:focus-within::part(root),
ui5-combobox:focus-within::part(root),
ui5-multi-combobox:focus-within::part(root),
ui5-date-picker:focus-within::part(root),
ui5-textarea:focus-within::part(root) {
  box-shadow: 0 0 0 2px rgba(0, 160, 227, 0.45) !important;
  border-color: #00a0e3 !important;
}

/* 4. Limpiar foco en listas y tablas */
ui5-list::part(list),
ui5-list-item-standard::part(root),
ui5-list-item-standard::part(native-li) {
  outline: none !important;
  box-shadow: none !important;
}

[role="row"]:focus,
[role="row"]:focus-visible,
[role="gridcell"]:focus,
[role="gridcell"]:focus-visible {
  outline: none !important;
}

/* 5. Diálogos y popovers redondeados */
ui5-dialog {
  --sapPopover_BorderCornerRadius: 1.5rem !important;
}
ui5-popover,
ui5-responsive-popover {
  --sapPopover_BorderCornerRadius: 1.25rem !important;
}
```

---

## Notas finales

- **Nunca editar `mta.yaml` directamente** — se sobreescribe en cada deploy. Editar el template en `config/`.
- **El UseCase es la frontera entre UI y dominio** — nunca pasar estado de React al repositorio.
- **Commit explícito en TODOS los handlers de escritura** — no confiar en auto-commit.
- **SAP tema Horizon carga dinámicamente** — usar `!important` y variables CSS heredadas, no solo selectores.
- **`base: './'` en Vite** — siempre, para que funcione dentro del iframe de Work Zone.
- **Los pasos manuales de Work Zone** (Channel Manager refresh, Content Manager) son SIEMPRE necesarios; no hay automatización actual.

---

_Documento generado a partir del proyecto NUAM Usuarios (Feb 2026). Actualizado con lecciones de NUAM Maestros (Feb 2026)._

---

## 15. Lecciones aprendidas — proyecto NUAM Maestros

> Este proyecto es la segunda app React desplegada en el mismo BTP Trial. Se comparte el mismo `html5-repo-host`. Leer ANTES de empezar cualquier proyecto nuevo.

### 15.1 El problema más crítico: html5-repo-host compartido entre apps

**Síntoma**: Después de desplegar Maestros, la app de Usuarios desaparece de Work Zone (y viceversa).

**Causa**: El MTA de Maestros usa `nuam-html5-repo-host` con `content-target: true`. Al hacer deploy, el deployer **sobreescribe TODO el contenido** del repositorio, reemplazando las otras apps.

**Solución inmediata**: Siempre redesplegar la otra app después:

```bash
# Orden correcto después de cualquier deploy:
# 1. Desplegar la app que cambiaste
./deploy.sh dev  # (en el repo de Maestros)
# 2. Ir al repo de Usuarios y redesplegar también
cd ../nuam-usuarios-project && ./deploy.sh dev
# 3. En Work Zone → Channel Manager → Refresh HTML5 Apps
```

**Solución definitiva** (para el proyecto Auditoria y siguientes): Crear un servicio `html5-apps-repo` **separado** por app:

```yaml
# mta.yaml de Auditoria
resources:
  - name: nuam-html5-repo-AUDITORIA # ← nombre ÚNICO, no compartir con otras apps
    type: org.cloudfoundry.existing-service # (o managed-service si no existe aún)
    parameters:
      service-name: nuam-html5-repo-AUDITORIA
```

### 15.2 Work Zone: el Refresh del canal es siempre manual

Work Zone **NUNCA** actualiza automáticamente su catálogo tras un deploy. Sin excepción:

```
Cada vez que hagas deploy de una app React nueva o la primera vez:
1. SAP Build Work Zone → Channel Manager
2. Canal "HTML5 Apps" → clic en ícono de Refresh (flechas circulares)
3. Esperar "Updated" (puede demorar 30-60 segundos)
4. Content Manager → Content Explorer → HTML5 Apps
5. Buscar la app por ID (ej: nuam.react.maestros)
6. Clic en "Add to My Content"
7. Asignar la app a un Group y a un Role en el site

Esto solo se hace UNA VEZ por app nueva. Los deploys posteriores de la
misma app solo requieren el Refresh del canal (paso 1-3).
```

### 15.3 MTA Standalone — el patrón que funciona para frontend React

Para un frontend React sin backend propio (que consume un backend ya existente):

```yaml
# mta.yaml (patrón confirmado en Maestros)
_schema-version: "3.2"
ID: nuam-react-MIAPP-standalone
version: 0.0.1

modules:
  - name: nuam-react-MIAPP-app
    type: html5
    path: .
    build-parameters:
      builder: custom
      build-result: dist
      commands: [] # Build hecho en deploy.sh ANTES de mbt build

  - name: nuam-MIAPP-deployer
    type: com.sap.application.content
    path: .
    requires:
      - name: xsuaa-central
      - name: nuam-html5-repo-MIAPP
        parameters:
          content-target: true
    build-parameters:
      build-result: resources
      requires:
        - name: nuam-react-MIAPP-app
          artifacts:
            - dist.zip # ← CRÍTICO: el zip debe existir aquí antes de mbt build
          target-path: resources

resources:
  - name: nuam-html5-repo-MIAPP
    type: org.cloudfoundry.existing-service
    parameters:
      service-name: nuam-html5-repo-MIAPP # ← Crear este servicio en BTP ANTES del primer deploy

  - name: xsuaa-central
    type: org.cloudfoundry.existing-service
    parameters:
      service-name: xsuaa-central # ← Servicio xsuaa compartido del portal
```

**deploy.sh que funciona (patrón Maestros):**

```bash
#!/bin/bash
ENV="$1"

# Cargar credenciales
if [ -f .env ]; then source .env; fi
if [[ -n "$EMAIL_BTP" && -n "$PASSWORD_BTP" ]]; then
  cf api https://api.cf.us10-001.hana.ondemand.com
  cf login -u "$EMAIL_BTP" -p "$PASSWORD_BTP" -o "$ORG_DEV" -s "$SPACE_DEV"
fi

# Asegurarse que nvm está en el PATH (crítico en Mac M1/M2)
export PATH=$PATH:$HOME/.nvm/versions/node/v24.13.0/bin

# 1. Build React
npm install && npm run build

# 2. Crear el zip en el source original ANTES de mbt build
cd dist && rm -f dist.zip && zip -r dist.zip . && cd ..

# 3. Build MTA
rm -rf mta_archives/
mbt build -p cf -t ./mta_archives --mtar nuam-react-MIAPP-standalone.mtar

# 4. Deploy
cf deploy mta_archives/nuam-react-MIAPP-standalone.mtar -f
```

### 15.4 Archivos obligatorios en la carpeta public/ para Work Zone

Work Zone identifica y carga la app correctamente solo si los archivos de `public/` están presentes y correctos en el zip que sube al html5-repo-host:

```
public/
├── manifest.json     ← ID de la app, CrossNavigation inbounds, sap.cloud.service
├── xs-app.json       ← Rutas al backend, autenticación
├── Component.js      ← Envuelve el index.html en un iframe para Work Zone
└── vite.svg          ← (puede ser el favicon real)
```

**manifest.json — campos críticos:**

```json
{
  "sap.app": {
    "id": "nuam.react.MIAPP", // ← ID único. En Work Zone aparece como este ID
    "crossNavigation": {
      "inbounds": {
        "MiApp-manage": {
          // ← clave interna del inbound
          "semanticObject": "NuamMiApp",
          "action": "manage",
          "title": "Mi App",
          "icon": "sap-icon://home"
        }
      }
    }
  },
  "sap.cloud": {
    "public": true,
    "service": "nuam" // ← Debe ser igual en TODAS las apps del mismo portal
  }
}
```

**Component.js — template (no cambiar el patrón):**

```javascript
sap.ui.define(
  ["sap/ui/core/UIComponent", "sap/ui/core/HTML"],
  function (UIComponent, HTML) {
    "use strict";
    return UIComponent.extend("nuam.react.MIAPP.Component", {
      metadata: { manifest: "json" },
      createContent: function () {
        var sBase = sap.ui.require.toUrl("nuam/react/MIAPP");
        return new HTML({
          content:
            "<iframe src='" +
            sBase +
            "/index.html' " +
            "style='width:100%;height:100%;border:none;display:block;'></iframe>",
        });
      },
    });
  },
);
```

> **Clave**: `nuam.react.MIAPP.Component` debe coincidir exactamente con el `id` del manifest.

---

## 16. Sistema de diseño NUAM — lineamientos para nuevos proyectos

> Seguir este sistema garantiza coherencia visual entre Usuarios, Maestros, Auditoria y futuras apps.

### 16.1 NuamButton — la manera correcta

**❌ NUNCA** usar clases Tailwind para el color/fondo de los botones UI5. No penetra el Shadow DOM.

**✅ SIEMPRE** usar la prop nativa `design` de SAP UI5 con el CSS custom property para el borde redondeado:

```tsx
// src/components/NuamButton/NuamButton.tsx
import React from "react";
import { Button, ButtonPropTypes } from "@ui5/webcomponents-react";
import type { WithWebComponentPropTypes } from "@ui5/webcomponents-react";

type CustomButtonProps = ButtonPropTypes &
  WithWebComponentPropTypes & {
    variant?: "primary" | "secondary" | "glass";
    disabled?: boolean;
    round?: boolean;
  };

const PILL_STYLE_BASE = {
  "--sapButton_BorderCornerRadius": "999px",
} as React.CSSProperties;

const PILL_STYLE_NORMAL = {
  ...PILL_STYLE_BASE,
  minWidth: "110px",
} as React.CSSProperties;

const NuamButton: React.FC<CustomButtonProps> = ({
  variant = "primary",
  children,
  className,
  disabled = false,
  round = false,
  style,
  ...rest
}) => {
  // 'Emphasized' = azul oscuro relleno (acción principal)
  // 'Default'    = blanco con borde (acción secundaria)
  // 'Transparent' = sin fondo (acciones de glass/overlay)
  const sapDesign =
    variant === "primary"
      ? "Emphasized"
      : variant === "glass"
        ? "Transparent"
        : "Default";

  const sizeClass = round
    ? "tw-p-0 tw-w-9 tw-h-9 tw-flex tw-items-center tw-justify-center tw-shrink-0"
    : "";

  const combinedClassName = [
    sizeClass,
    className,
    disabled ? "tw-opacity-50 tw-cursor-not-allowed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Button
      design={sapDesign}
      disabled={disabled}
      {...rest}
      style={{ ...(round ? PILL_STYLE_BASE : PILL_STYLE_NORMAL), ...style }}
      className={combinedClassName || undefined}
    >
      {children}
    </Button>
  );
};

export default NuamButton;
```

**Uso:**

```tsx
<NuamButton variant="primary" onClick={handleSave}>Guardar</NuamButton>
<NuamButton variant="secondary" onClick={handleCancel}>Cancelar</NuamButton>
<NuamButton variant="secondary" className="!tw-text-red-600 !tw-border-red-500" onClick={handleEliminar}>Eliminar</NuamButton>
<NuamButton variant="primary" round><Icon name="add" /></NuamButton>  {/* botón redondo */}
```

### 16.2 Paleta de colores NUAM

| Token                     | Hex                                                              | Uso                             |
| ------------------------- | ---------------------------------------------------------------- | ------------------------------- |
| Primario                  | `#0070f2`                                                        | Botones emphasized, links       |
| Primario dark             | `#005a92`                                                        | Hover de botones                |
| Fondo de panel detalle    | `#e8f0fc`                                                        | Background del área de detalle  |
| Fondo de tarjetas (pills) | `rgba(148,163,184,0.2)` = `tw-bg-slate-200/50`                   | Pastillas de info               |
| Borde de tarjetas         | `#cbd5e1` = `tw-border-slate-300`                                | Borde de pastillas              |
| Header azul superior      | `linear-gradient(135deg, #1e3a5f 0%, #2d6cb5 60%, #3a89d4 100%)` | Header de Maestros/Usuarios     |
| Texto principal           | `#0f172a` = `tw-text-slate-900`                                  | Títulos y labels importantes    |
| Texto secundario          | `#64748b` = `tw-text-slate-500`                                  | Subtítulos descriptivos         |
| Texto muted               | `#94a3b8` = `tw-text-slate-400`                                  | Etiquetas de campo en UPPERCASE |

### 16.3 Estructura de página — patrón Master-Detail

```
┌──────────────────────────────────────────────────────────────┐
│  Header azul (gradiente) con título de la app                │
│  Buscador + botones glass (variant="glass")                  │
├──────────────────────┬───────────────────────────────────────┤
│  Panel Izquierdo     │  Panel Derecho (Detalle)              │
│  (Lista Maestra)     │  bg: #e8f0fc                          │
│                      │  ┌──────────────────────────────────┐ │
│  ListItems con badge │  │ Contenedor blanco redondeado      │ │
│  (chips estado)      │  │ (tw-rounded-[2.5rem])             │ │
│                      │  │                                  │ │
│  Footer: Eliminar +  │  │  Tabs pills (NuamTabContainer)   │ │
│          Crear       │  │  ├─ Información (con Edit btn)   │ │
│                      │  │  └─ Parámetros (con tabla)       │ │
│                      │  └──────────────────────────────────┘ │
└──────────────────────┴───────────────────────────────────────┘
```

### 16.4 NuamTab y NuamTabContainer — patrón de pestañas pill

```tsx
// NuamTab.tsx
export interface NuamTabProps {
  text: string;
  children: ReactNode;
  icon?: string; // opcional, no se muestra si el diseño lo omite
  onClick?: () => void;
  extraContent?: ReactNode; // ← botones que van a la DERECHA de los tabs (Editar, Guardar)
}
```

```tsx
// Uso en DetallePanel:
<NuamTabContainer>
  <NuamTab
    text="Información"
    extraContent={
      <div className="tw-flex tw-gap-2">
        {isEditing && (
          <NuamButton variant="primary" onClick={handleGuardar}>
            Guardar
          </NuamButton>
        )}
        <NuamButton
          variant="secondary"
          className={isEditing ? "!tw-text-red-600 !tw-border-red-500" : ""}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancelar" : "Editar"}
        </NuamButton>
      </div>
    }
  >
    {/* contenido del tab */}
  </NuamTab>
  <NuamTab text="Parámetros">{/* tabla de datos */}</NuamTab>
</NuamTabContainer>
```

### 16.5 Encabezados de formularios (CustomDialog)

**❌ NUNCA** usar el header oscuro con gradiente (`tw-bg-gradient-to-b tw-from-slate-900 tw-to-slate-800`) — es un diseño antiguo descartado.

**✅ SIEMPRE** usar el header claro y minimalista:

```tsx
header={
  <div className='tw-p-6 tw-pb-4 tw-border-b tw-border-slate-100'>
    <Title className='tw-text-slate-900 tw-text-xl tw-font-bold tw-tracking-wide'>Título del Form</Title>
    <p className='tw-text-slate-500 tw-text-xs tw-mt-1 tw-m-0'>Descripción breve de la acción</p>
  </div>
}
```

---

## 17. Playbook "cero a deploy" — Auditoria y futuras apps

Seguir estos pasos en orden. No saltarse ninguno.

### Paso 1: Crear servicio HTML5 en BTP

```bash
cf create-service html5-apps-repo app-host nuam-html5-repo-AUDITORIA
```

### Paso 2: Clonar estructura desde Maestros

```bash
git clone <repo-maestros> nuam-react-auditoria
cd nuam-react-auditoria
# Renombrar: buscar y reemplazar "maestros" → "auditoria" en:
# - mta.yaml (ID, nombres de módulos y servicios)
# - public/manifest.json (sap.app.id, crossNavigation keys)
# - public/Component.js (extend "nuam.react.auditoria.Component")
# - public/xs-app.json (destinations del backend de auditoria)
# - package.json (name)
# - vite.config.ts (proxy al backend de auditoria)
```

### Paso 3: Adaptar las páginas desde MAZDA/UI5

La app de referencia en MAZDA/UI5 usa `sap.m.Table` y `sap.m.List`. Al migrar a React+UI5:

| MAZDA / UI5 clásico               | React + UI5 Web Components                                         |
| --------------------------------- | ------------------------------------------------------------------ |
| `sap.m.Button`                    | `<NuamButton variant="primary/secondary">`                         |
| `sap.m.Table`                     | `<AnalyticalTable columns={[...]} data={[...]} />`                 |
| `sap.m.List` + `StandardListItem` | `<List>` + `<StandardListItem>` o `<CustomListItem>`               |
| `sap.m.Dialog`                    | `<CustomDialog open={} onClose={} header={} footer={}>`            |
| `sap.m.Input`                     | `<Input value={} onInput={e => setState(e.target.value)} />`       |
| `sap.m.Select`                    | `<Select onChange={e => setState(e.detail.selectedOption.value)}>` |
| `sap.m.MessageBox`                | `Swal.fire(...)` via SweetAlert2 con react-content                 |
| `sap.m.BusyIndicator`             | `LoadingContext` (spinner global)                                  |

### Paso 4: APIs del backend

Verificar que el proxy de Vite en `vite.config.ts` apunte al backend de auditoria:

```typescript
proxy: {
  '/api/base/auditoria': {
    target: 'https://proyecto-auditoria-base-backend-dev.cfapps.us10-001.hana.ondemand.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/base\/auditoria/, '')
  }
}
```

Y que `xs-app.json` tenga el destination correcto:

```json
{
  "source": "^/api/base/auditoria/(.*)$",
  "target": "/api/base/auditoria/$1",
  "destination": "nuam-apigateway-backend-dev",
  "authenticationType": "none",
  "csrfProtection": false
}
```

### Paso 5: Variables de entorno

```env
# .env (gitignoreado)
EMAIL_BTP=carlos.venturo@seidor.com
PASSWORD_BTP=...
ORG_DEV=b83bb89ctrial
SPACE_DEV=dev
```

### Paso 6: Primer deploy

```bash
# Asegurarse que el servicio HTML5 existe:
cf services | grep nuam-html5-repo-AUDITORIA

# Desplegar:
chmod +x deploy.sh && ./deploy.sh dev
```

### Paso 7: Registrar en Work Zone (SOLO la primera vez)

```
1. Work Zone → Channel Manager → Refresh "HTML5 Apps"
2. Content Manager → Content Explorer → HTML5 Apps → busca "nuam.react.auditoria"
3. Add to My Content
4. Crea un Group y asigna la app
5. En Settings del site, asigna el role "Everyone"
```

### Paso 8: Deploys futuros

```bash
./deploy.sh dev
# Luego ir a Work Zone → Channel Manager → Refresh HTML5 Apps
# (no hace falta Add to My Content nuevamente)

# IMPORTANTE: si también hubo cambios en Maestros o Usuarios,
# desplegar esas apps también (comparten el html5-repo-host)
```

---

## 18. Errores frecuentes — Maestros (actualización)

| Error / Síntoma                                                      | Causa                                                        | Solución                                                                                  |
| -------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| App desaparece de Work Zone tras deploy                              | Comparte `nuam-html5-repo-host` con otra app                 | Usar servicio HTML5 propio por app, O redesplegar la otra app inmediatamente después      |
| Work Zone no muestra la app nueva tras deploy                        | Channel Manager no refresca solo                             | Ir a Channel Manager → Refresh HTML5 Apps manualmente                                     |
| "App not found" en Work Zone aunque se deployó                       | No fue registrada en Content Manager                         | Add to My Content + asignar a Group + asignar Role                                        |
| `cf mtas` no muestra el MTA después de deploy                        | Deploy falló silenciosamente, o fue el primer deploy         | Revisar output de `cf deploy`, verificar Exit code: 0                                     |
| `registrarMaestroDetalle` no encontrado después de editar el service | Edición incorrecta que corrompió la declaración de función   | Revisar `maestro-base.service.ts` manualmente y restaurar la función                      |
| Tailwind class en NuamButton no tiene efecto                         | Shadow DOM de UI5 bloquea Tailwind                           | Usar prop `design="Emphasized"` y `style={{ '--sapButton_BorderCornerRadius': '999px' }}` |
| Botones tienen gradiente no deseado                                  | Se usó `tw-bg-gradient-to-r` en lugar del design prop nativo | Refactorizar a `design={sapDesign}` en NuamButton                                         |

---

_Documento actualizado con lecciones de NUAM Maestros y guía para NUAM Auditoria. (Feb 2026)_
