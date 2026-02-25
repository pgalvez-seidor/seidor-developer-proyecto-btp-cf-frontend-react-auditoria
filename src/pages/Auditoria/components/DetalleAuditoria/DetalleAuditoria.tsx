import NuamButton from '@/components/NuamButton/NuamButton';
import {
  Bar,
  Dialog,
  FlexBox,
  Label,
  ObjectStatus,
  Text,
  TextArea,
} from '@ui5/webcomponents-react';

const prettyJson = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return String(value);
  }
};

const estadoMap: Record<number, { state: string; label: string }> = {
  1: { state: 'Positive', label: 'Ok' },
  2: { state: 'Critical', label: 'Alerta' },
  3: { state: 'Negative', label: 'Error' },
};

export const DetalleAuditoria = (props: any) => {
  const { datosAuditoria } = props;

  const idCorto = datosAuditoria?.idTransaccion
    ? datosAuditoria.idTransaccion.substring(datosAuditoria.idTransaccion.length - 12)
    : '';

  const estado = estadoMap[datosAuditoria?.idEstado] ?? { state: 'None', label: '—' };

  return (
    <Dialog
      style={{ width: '90%', maxWidth: '1200px' }}
      open={props.dialogDetalleAuditoria.open}
      headerText={`Detalle: ${idCorto}`}
      footer={
        <Bar
          design='Footer'
          endContent={
            <NuamButton
              variant='secondary'
              icon='sys-cancel'
              onClick={() => props.setDialogDetalleAuditoria({ open: false })}
            >
              Cerrar
            </NuamButton>
          }
        />
      }
    >
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Fila 1: campos principales */}
        <FlexBox wrap='Wrap' style={{ gap: '2rem' }}>
          <div style={{ minWidth: '150px' }}>
            <Label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Id Transacción</Label>
            <Text>{datosAuditoria?.idTransaccion}</Text>
          </div>
          <div style={{ minWidth: '150px' }}>
            <Label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Fecha</Label>
            <Text>
              {datosAuditoria?.createdAt
                ? new Date(datosAuditoria.createdAt).toLocaleString('es-ES')
                : '—'}
            </Text>
          </div>
          <div style={{ minWidth: '100px' }}>
            <Label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Usuario</Label>
            <Text>{datosAuditoria?.usuario}</Text>
          </div>
          <div style={{ minWidth: '120px' }}>
            <Label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Aplicación</Label>
            <Text>{datosAuditoria?.aplicacion}</Text>
          </div>
          <div style={{ minWidth: '80px' }}>
            <Label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Method</Label>
            <Text>{datosAuditoria?.methodEnvio}</Text>
          </div>
          <div style={{ minWidth: '200px' }}>
            <Label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Proceso</Label>
            <Text style={{ wordBreak: 'break-all' }}>{datosAuditoria?.nombreProceso}</Text>
          </div>
          <div style={{ minWidth: '80px' }}>
            <Label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Tiempo</Label>
            <Text>{datosAuditoria?.tiempoProceso} ms</Text>
          </div>
          <div style={{ minWidth: '150px' }}>
            <Label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Terminal</Label>
            <Text>{datosAuditoria?.terminal}</Text>
          </div>
          <div style={{ minWidth: '100px' }}>
            <Label style={{ fontWeight: 700, display: 'block', marginBottom: 4 }}>Estado</Label>
            <ObjectStatus showDefaultIcon state={estado.state as any}>
              {estado.label}
            </ObjectStatus>
          </div>
        </FlexBox>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb' }} />

        {/* Fila 2: Request y Response en columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <Label style={{ fontWeight: 700, display: 'block', marginBottom: 8 }}>Request Body</Label>
            <TextArea
              rows={20}
              readonly
              style={{
                width: '100%',
                fontFamily: 'monospace',
                fontSize: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                padding: '8px'
              } as any}
              value={prettyJson(datosAuditoria?.entradaProceso)}
            />
          </div>
          <div>
            <Label style={{ fontWeight: 700, display: 'block', marginBottom: 8 }}>Response Body</Label>
            <TextArea
              rows={20}
              readonly
              style={{
                width: '100%',
                fontFamily: 'monospace',
                fontSize: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                padding: '8px'
              } as any}
              value={prettyJson(datosAuditoria?.respuestaProceso)}
            />
          </div>
        </div>

      </div>
    </Dialog>
  );
};
