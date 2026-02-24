//Tab-Vehiculo

export class ItemTableDetalleDocumentoEstadoCuenta {
  codigoConcesionario: string;
  nombreConcesionario: string;
  codigoSucursal: string;
  nombreSucursal: string;
  codigoPedidoVenta: string;
  codigoMaterial: string;
  descripcionMaterial: string;
  tipoMaterial: string;
  descripcionTipoMaterial: string;
  referenciaPedido: string;
  cantidadBackorder: string;
  fechaRadicacionPedido: string;
  fechaEstimadaLlegada: string;
}

export class oPaginationTableDetalleDocumentoEstadoCuenta {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}
