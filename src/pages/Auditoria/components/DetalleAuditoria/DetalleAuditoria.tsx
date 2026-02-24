import MazdaButton from '@/components/MazdaButton/MazdaButton';
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
              <MazdaButton
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
              </MazdaButton>
            </>
          }
        />
      }
      headerText={'Detalle: ' + obtenerIDTranssaccion(datosAuditoria.id_transaccion)}
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
        <FormItem labelContent={<Label>Nombre:</Label>}>
          <Text>{datosAuditoria.nombre_proceso}</Text>
        </FormItem>
        <FormItem labelContent={<Label>Terminal:</Label>}>
          <Text>{datosAuditoria.terminal}</Text>
        </FormItem>
        <FormItem labelContent={<Label>Aplicacion:</Label>}>
          <Text>{datosAuditoria.aplicacion}</Text>
        </FormItem>
        <FormItem labelContent={<Label>Fecha de Creación:</Label>}>
          <Text>{datosAuditoria.created_at_filtro}</Text>
        </FormItem>
        <FormItem labelContent={<Label>Tiempo:</Label>}>
          <Text>{datosAuditoria.tiempo_proceso}</Text>
        </FormItem>
        <FormItem labelContent={<Label>Method:</Label>}>
          <Text>{datosAuditoria.method_envio}</Text>
        </FormItem>

        <FormItem labelContent={<Label>Estado:</Label>}>
          <Text>{datosAuditoria.id_estado === 1 ? 'Ok' : 'Error'}</Text>
        </FormItem>

        <FormItem labelContent={<Label>Request Params:</Label>}>
          <Text>entrada_proceso</Text>
        </FormItem>

        <FormItem labelContent={<Label>Request Body:</Label>}>
          <TextArea
            rows={12}
            readonly={true}
            value={JSON.stringify(datosAuditoria.entrada_proceso)}
          ></TextArea>
        </FormItem>

        <FormItem labelContent={<Label>Response Body:</Label>}>
          <TextArea
            rows={12}
            readonly={true}
            value={JSON.stringify(datosAuditoria.respuesta_proceso)}
          ></TextArea>
        </FormItem>
      </Form>
    </Dialog>
  );
};
