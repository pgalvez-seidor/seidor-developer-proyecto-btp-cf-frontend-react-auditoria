export interface PedidoVenta {
  cupoMcol: string;
  concesionario: string;
  sucursal: string;
  clasePedido: string;
  grupoMaterial: string;
  cod_grupo_material: string;
  costoTotal: number;
  refCliente: string;
  fecha_creacion: string;
  ///

  ID: string;
  codigoConcesionario: string;
  codigoSucursal: string;
  codigoPedidoVenta: string;
  codigoClasePedido: string;
  documentoSap: string;
  referenciaCliente: string;
  codEstadoPedido: string;
  correoUsuario: string;
  totalBase: number;
  totalDesc: number;
  createdAt: string;
  created_at_filtro: string;
  created_at_DDMMYYYY: string;
  codMateriales: string;
  lineaProductos: string;
  descgrupoMaterial: string;
  codigo_concesionario: string;
  codigo_sucursal: string;
  codigo_pedido_venta: string;
  codigo_clase_pedido: string;
  documento_sap: string;
  referencia_cliente: string;
  cod_estado_pedido: string;
  cod_materiales: string;
  linea_productos: string;
  descClasePedido: string;
  desEstadoPedido: string;
  desConcesionario: string;
  desSucursal: string;
  subtotal: number;
  impuesto: number;
  descuentoTotal: number;
  total: number;
  subtotal_f: string;
  impuesto_f: string;
  totalDesc_f: string;
  totalBase_f: string;
  codigoSap: string;
  total_f: string;
  totalDescuento_f: string;
  descuentoTotal_f: string;
}

export class oPaginationTablePedidoVenta {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}
