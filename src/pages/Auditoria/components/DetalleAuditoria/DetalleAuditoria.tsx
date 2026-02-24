import NuamButton from '@/components/NuamButton/NuamButton';
import {
  Bar,
  Button,
  Dialog,
  Form,
  FormItem,
  Label,
  Text,
  TextArea,
} from '@ui5/webcomponents-react';

export const DetalleAuditoria = props => {
  const { datosAuditoria } = props;
  const obtenerIDTranssaccion = id => {
    const text = id.substring(id.length - 10);
    return text;
  };
  return (
    <Dialog
      className='footerPartNoPadding topNoPadding'
      //   stretch={true}

      style={{
        width: '80%',
        maxWidth: '1200px',
      }} // Adjust the width as needed
      open={props.dialogDetalleAuditoria.open}
      footer={
        <Bar
          design='Footer'
          endContent={
            <>
              <NuamButton
                variant='secondary'
                icon='sys-cancel'
                onClick={function ks() {
                  props.setDialogDetalleAuditoria({
                    open: false,
                    title: '',
                  });
                }}
              >
                Cancelar
              </NuamButton>
            </>
          }
        />
      }
      headerText={'Detalle: ' + obtenerIDTranssaccion(datosAuditoria.idTransaccion)}
      onBeforeClose={function ks() {}}
      onBeforeOpen={function ks() {}}
      onClose={function ks() {}}
      onOpen={function ks() {}}
    >
      <Form
        style={{ justifyContent: 'start' }}
        labelSpan='S12 M4 L4 XL4'
        layout='S1 M1 L2 XL2'
      >
        <FormItem labelContent={<Label>Nombre Proceso:</Label>}>
          <Text>{datosAuditoria.nombreProceso}</Text>
        </FormItem>
        <FormItem labelContent={<Label>Terminal:</Label>}>
          <Text>{datosAuditoria.terminal}</Text>
        </FormItem>
        <FormItem labelContent={<Label>Aplicación:</Label>}>
          <Text>{datosAuditoria.aplicacion}</Text>
        </FormItem>
        <FormItem labelContent={<Label>Fecha de Creación:</Label>}>
          <Text>{datosAuditoria.createdAt ? new Date(datosAuditoria.createdAt).toLocaleString('es-ES') : ''}</Text>
        </FormItem>
        <FormItem labelContent={<Label>Tiempo:</Label>}>
          <Text>{datosAuditoria.tiempoProceso} ms</Text>
        </FormItem>
        <FormItem labelContent={<Label>Method:</Label>}>
          <Text>{datosAuditoria.methodEnvio}</Text>
        </FormItem>

        <FormItem labelContent={<Label>Estado:</Label>}>
          <Text>{datosAuditoria.idEstado === 1 ? 'Ok' : 'Error'}</Text>
        </FormItem>

        <FormItem labelContent={<Label>Usuario:</Label>}>
          <Text>{datosAuditoria.usuario}</Text>
        </FormItem>

        <FormItem labelContent={<Label>Request Body:</Label>}>
          <TextArea
            rows={12}
            readonly={true}
            value={JSON.stringify(datosAuditoria.entradaProceso, null, 2)}
          ></TextArea>
        </FormItem>

        <FormItem labelContent={<Label>Response Body:</Label>}>
          <TextArea
            rows={12}
            readonly={true}
            value={JSON.stringify(datosAuditoria.respuestaProceso, null, 2)}
          ></TextArea>
        </FormItem>
      </Form>
    </Dialog>
  );
};
