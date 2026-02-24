# Estándares de Desarrollo - NUAM React Apps

Este documento define los estándares y lineamientos que deben seguirse en todos los proyectos React de NUAM para mantener consistencia, calidad y mantenibilidad.

---

## 1. Formato Estándar de Respuestas API

### 1.1 Estructura de Respuesta Obligatoria

**TODAS las respuestas de servicios** (REST o OData) deben seguir este formato estándar:

```typescript
{
  oAuditResponse: {
    code: number,           // Código de respuesta
    idtransaccion: string,  // ID único de transacción
    message: string,        // Mensaje descriptivo
    fechatransaccion: string // ISO timestamp
  },
  oDataResponse: any       // Los datos de la respuesta
}
```

### 1.2 Códigos de Respuesta

| Código | Significado | Acción en Frontend |
|--------|-------------|-------------------|
| `1` | Éxito | Procesar datos normalmente |
| `0` o `> 1` | Advertencia | Mostrar warning al usuario |
| `-99` | No autorizado | Redirigir a login |
| `< 0` (excepto -1000) | Error | Mostrar error al usuario |
| `-1000` | Excepción | Mostrar error técnico |

### 1.3 Implementación

#### Para servicios REST (NestJS/CAP con @protocol:'rest')

Los backends ya devuelven el formato estándar. Usar helpers:

```typescript
import { servicePost, serviceGet } from '../utils/service';

// Automáticamente formatea respuesta
const response = await servicePost(url, data, headers);

// Verificar respuesta
if (response.code === 1) {
  const datos = response.data;
  // procesar...
} else {
  console.error(response.message);
}
```

#### Para servicios OData (CAP sin @protocol)

Usar wrapper `odataGet` que formatea la respuesta:

```typescript
import { generarIdTransaccionFecha } from '../utils/utilHttp';

const odataGet = async (url: string, oParamHeaders: IParamHeaders): Promise<any> => {
  try {
    const response = await http(oParamHeaders).get(url);
    const { idtransaccion, fechatransaccion } = generarIdTransaccionFecha();

    return {
      oAuditResponse: {
        code: 1,
        idtransaccion,
        message: 'Consulta exitosa',
        fechatransaccion
      },
      oDataResponse: response.data
    };
  } catch (error: any) {
    const { idtransaccion, fechatransaccion } = generarIdTransaccionFecha();
    return {
      oAuditResponse: {
        code: -1,
        idtransaccion,
        message: error?.response?.data?.error?.message || 'Error en la consulta',
        fechatransaccion
      },
      oDataResponse: null
    };
  }
};

// Uso
const result = await odataGet('/api/base/maestro/odata/v4/...', headers);
if (result.oAuditResponse.code === 1) {
  const data = result.oDataResponse.value; // OData devuelve array en 'value'
}
```

### 1.4 Adaptación de Respuestas OData

OData v4 devuelve datos en la propiedad `value`. Adaptar al formato esperado por el frontend:

```typescript
export const obtenerMaestrosCabecera = async (params, headers) => {
  const result = await odataGet('/api/.../MaestroCabecera?$filter=...', headers);

  if (result.oAuditResponse.code === 1) {
    // Adaptar estructura OData al formato esperado
    result.oDataResponse = {
      cabeceras: result.oDataResponse.value || []
    };
  }

  return result;
};
```

---

## 2. Estándares de UI/UX

### 2.1 Layout Master-Detail

Para vistas con lista + detalle, usar este patrón:

```tsx
<div className='tw-flex tw-flex-col tw-h-[calc(100vh-160px)]'>
  <HeaderSection title='...' />

  <div className='tw-flex tw-flex-1 tw-overflow-hidden'>
    {/* Master Panel */}
    {isDrawerOpen && (
      <div className='tw-max-w-[500px] tw-w-full tw-flex tw-flex-col tw-overflow-hidden'>
        {/* Header fijo con búsqueda */}
        <div className='tw-flex tw-gap-2 tw-p-4 tw-border-b'>
          <Input placeholder='Buscar' />
          <NuamButton icon='search' onClick={handleSearch} />
        </div>

        {/* Lista con scroll */}
        <div className='tw-flex-1 tw-overflow-y-auto'>
          {items.map(item => <ItemCard key={item.id} {...item} />)}
        </div>

        {/* Footer fijo con acciones */}
        <div className='tw-border-t tw-bg-white tw-p-4'>
          <FlexBox className='tw-justify-end tw-gap-2'>
            <NuamButton icon='delete' onClick={handleDelete}>Eliminar</NuamButton>
            <NuamButton icon='add' onClick={handleCreate}>Crear</NuamButton>
          </FlexBox>
        </div>
      </div>
    )}

    {/* Detail Panel */}
    <div className='tw-flex-1 tw-overflow-auto'>
      <DetailContent />
    </div>
  </div>
</div>
```

**Principios clave:**
- ✅ Usar `tw-h-full` y `tw-flex-1` para altura dinámica
- ✅ NUNCA usar alturas fijas (ej: `tw-h-[700px]`)
- ✅ Header y footer fijos, solo la lista tiene scroll
- ✅ `tw-overflow-hidden` en contenedores, `tw-overflow-y-auto` en áreas de scroll

### 2.2 Estilos de Items de Lista

```tsx
<div
  onClick={() => onSelect(item)}
  className={`tw-cursor-pointer tw-border-b tw-transition-colors
    tw-py-3 tw-px-4
    hover:tw-bg-blue-50
    ${isSelected ? 'tw-bg-blue-100 tw-border-l-4 tw-border-l-blue-600' : 'tw-bg-white'}`}
>
  <div className='tw-flex tw-justify-between tw-items-start tw-gap-2'>
    <div className='tw-flex-1'>
      <p className='tw-font-semibold tw-text-sm tw-text-gray-900'>{item.title}</p>
      <p className='tw-text-sm tw-text-gray-600 tw-mt-1'>{item.subtitle}</p>
    </div>
    <span className='tw-text-xs tw-bg-green-100 tw-text-green-800 tw-px-2 tw-py-1 tw-rounded-full'>
      {item.status}
    </span>
  </div>
</div>
```

### 2.3 Mensajes de Confirmación (SweetAlert2)

Usar estilo consistente con bordes redondeados de 24px:

```typescript
import Swal from 'sweetalert2';

Swal.fire({
  title: '¿Deseas eliminar este registro?',
  text: 'Esta acción no se puede deshacer.',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Eliminar',
  cancelButtonText: 'Cancelar',
  confirmButtonColor: '#e02424',
  customClass: {
    popup: '!tw-rounded-[24px] tw-shadow-2xl',
    confirmButton: '!tw-rounded-full !tw-px-6',
    cancelButton: '!tw-rounded-full !tw-px-6',
  },
}).then((result) => {
  if (result.isConfirmed) {
    // Ejecutar acción
  }
});
```

### 2.4 Snackbar/Toast Messages

Usar el contexto global `SnackbarContext`:

```typescript
const { setSnackbarState } = useContext(SnackbarContext);

// Éxito
setSnackbarState('¡Éxito!', 'Operación completada correctamente.', 'SUCCESS');

// Error
setSnackbarState('Error', 'Ocurrió un error en el servicio.', 'ERROR');

// Warning
setSnackbarState('Advertencia', 'Por favor verifica los datos.', 'WARNING');
```

### 2.5 Estados de Carga

Usar el contexto global `LoadingContext`:

```typescript
const { setLoadingState } = useContext(LoadingContext);

const fetchData = async () => {
  try {
    setLoadingState(true);
    const result = await service();
    // procesar...
  } catch (error) {
    // manejar error
  } finally {
    setLoadingState(false);
  }
};
```

---

## 3. Componentes Reutilizables

### 3.1 NuamButton

Botón estandarizado con variantes y iconos:

```tsx
import NuamButton from '@/components/NuamButton/NuamButton';

// Variantes
<NuamButton variant='primary'>Guardar</NuamButton>
<NuamButton variant='secondary'>Cancelar</NuamButton>

// Con iconos
<NuamButton icon='add' variant='primary'>Crear</NuamButton>
<NuamButton icon='delete' variant='secondary'>Eliminar</NuamButton>

// Solo icono (round)
<NuamButton round icon='edit' variant='secondary' title='Editar' />
```

### 3.2 HeaderSection

Encabezado estandarizado con título y botón drawer:

```tsx
import HeaderSection from '@/components/HeaderSection/HeaderSection';

<HeaderSection
  title='Maestros'
  principal={true}
  isDrawer={true}
  toggleDrawer={toggleDrawer}
/>
```

### 3.3 CustomDialog

Diálogo modal con estilos consistentes:

```tsx
import CustomDialog from '@/components/CustomDialog/CustomDialog';

<CustomDialog
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title='Crear Maestro'
>
  <FormContent />
</CustomDialog>
```

---

## 4. Estructura de Archivos

### 4.1 Organización por Feature

```
src/
├── components/          # Componentes compartidos
│   ├── NuamButton/
│   ├── HeaderSection/
│   └── CustomDialog/
├── pages/              # Features/Páginas
│   └── Maestro/
│       ├── Maestro.tsx              # Container principal
│       ├── components/              # Componentes específicos
│       │   ├── MaestrosPanel.tsx
│       │   └── DetallePanel.tsx
│       └── hooks/                   # Custom hooks
├── contexts/           # React Contexts globales
│   ├── LoadingContext/
│   ├── SnackbarContext/
│   └── DataContext/
├── services/          # Llamadas API
│   └── maestro-base.service.ts
├── types/             # TypeScript types
└── utils/             # Utilidades
    ├── service.ts     # Wrappers de HTTP
    ├── utilHttp.ts    # Helpers HTTP
    └── constants.ts   # Constantes
```

### 4.2 Naming Conventions

- **Componentes**: PascalCase (`MaestrosPanel.tsx`)
- **Servicios**: kebab-case (`maestro-base.service.ts`)
- **Hooks**: camelCase con prefijo `use` (`useUsuarioPage.ts`)
- **Types**: PascalCase (`IParamHeaders`)
- **Constantes**: camelCase o UPPER_SNAKE_CASE

---

## 5. TypeScript

### 5.1 Tipos para Respuestas

```typescript
interface StandardResponse<T = any> {
  oAuditResponse: {
    code: number;
    idtransaccion: string;
    message: string;
    fechatransaccion: string;
  };
  oDataResponse: T;
}

interface ODataResponse<T> {
  '@odata.context': string;
  value: T[];
  '@odata.count'?: number;
}
```

### 5.2 Config tsconfig.json

```json
{
  "compilerOptions": {
    "strict": false,           // Por ahora, para compatibilidad
    "noUnusedLocals": false,   // Evitar warnings por código legacy
    "paths": {
      "@/*": ["./src/*"]       // Alias para imports
    }
  }
}
```

---

## 6. Estilos con Tailwind CSS

### 6.1 Paleta de Colores

```css
/* Colores principales */
tw-bg-blue-600    /* Primary */
tw-bg-blue-100    /* Primary light */
tw-bg-gray-900    /* Text dark */
tw-bg-gray-600    /* Text medium */
tw-bg-gray-100    /* Background light */

/* Estados */
tw-bg-green-100 tw-text-green-800  /* Success */
tw-bg-red-100 tw-text-red-800      /* Error */
tw-bg-yellow-100 tw-text-yellow-800 /* Warning */
```

### 6.2 Espaciado Consistente

- **Padding de cards/panels**: `tw-p-4`
- **Gap entre elementos**: `tw-gap-2` o `tw-gap-4`
- **Bordes redondeados**: `tw-rounded-[24px]` (estándar NUAM)
- **Sombras**: `tw-shadow-md` o `tw-shadow-2xl`

### 6.3 Responsive

Usar breakpoints de Tailwind:

```tsx
className='tw-w-full sm:tw-w-80 lg:tw-w-96'
```

---

## 7. Manejo de Errores

### 7.1 Try-Catch Pattern

```typescript
const handleAction = async () => {
  try {
    setLoadingState(true);
    const result = await service();

    if (result.oAuditResponse.code !== 1) {
      setSnackbarState('Error', result.oAuditResponse.message, 'ERROR');
      return;
    }

    // Procesar datos exitosos
    setSnackbarState('Éxito', 'Operación completada', 'SUCCESS');
  } catch (error) {
    console.error('Error:', error);
    setSnackbarState('Error', 'Ocurrió un error en el servicio', 'ERROR');
  } finally {
    setLoadingState(false);
  }
};
```

### 7.2 Validación de Respuestas

```typescript
// ✅ CORRECTO - Siempre verificar code
if (response.oAuditResponse.code === 1) {
  const datos = response.oDataResponse.cabeceras;
}

// ❌ INCORRECTO - No asumir éxito
const datos = response.oDataResponse.cabeceras; // Puede ser null!
```

---

## 8. Performance

### 8.1 Lazy Loading

Para rutas/páginas grandes:

```typescript
const MaestroPage = lazy(() => import('./pages/Maestro/Maestro'));

<Suspense fallback={<BusyIndicator active />}>
  <MaestroPage />
</Suspense>
```

### 8.2 Memoization

Para componentes que reciben props complejos:

```typescript
const ItemCard = memo(({ item, onSelect }) => {
  // ...
}, (prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id;
});
```

---

## 9. Testing (Futuro)

### 9.1 Unit Tests

Usar Vitest (ya configurado en el proyecto):

```typescript
import { describe, it, expect } from 'vitest';

describe('obtenerMaestros', () => {
  it('debe devolver formato estándar', async () => {
    const result = await obtenerMaestros();
    expect(result).toHaveProperty('oAuditResponse');
    expect(result.oAuditResponse).toHaveProperty('code');
  });
});
```

---

## 10. Git Workflow

### 10.1 Branches

- `main` - Producción estable
- `dev` - Desarrollo activo
- `feature/nombre` - Features nuevas

### 10.2 Commits

Seguir Conventional Commits:

```bash
feat: add maestros CRUD operations
fix: correct OData response mapping
docs: update development standards
refactor: improve layout responsiveness
style: apply consistent button styling
```

### 10.3 Co-Authorship

Incluir co-autoría de Claude en commits:

```bash
git commit -m "feat: implement standard response format

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## 11. Checklist de Revisión

Antes de hacer merge a main, verificar:

- [ ] Todas las respuestas API usan formato estándar
- [ ] UI es responsive (sin alturas fijas)
- [ ] Mensajes de confirmación usan SweetAlert2 con estilo NUAM
- [ ] Loading states implementados correctamente
- [ ] Manejo de errores con try-catch
- [ ] Código TypeScript sin errores (compilación exitosa)
- [ ] Nombres de archivos y componentes siguen convenciones
- [ ] Imports organizados (shared components primero)
- [ ] Commits siguen Conventional Commits

---

## 12. Referencias

- [SAP UI5 Web Components React](https://sap.github.io/ui5-webcomponents-react/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [SweetAlert2](https://sweetalert2.github.io/)
- [OData v4 Specification](https://www.odata.org/documentation/)

---

**Última actualización:** 2026-02-23
**Autor:** Equipo NUAM + Claude Sonnet 4.6
