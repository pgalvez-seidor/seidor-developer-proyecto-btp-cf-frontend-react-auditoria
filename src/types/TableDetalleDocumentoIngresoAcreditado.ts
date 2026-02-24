//Tab-Vehiculo

export class ItemTableDetalleDocumentoIngresoAcreditado {
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

export class oPaginationTableDetalleDocumentoIngresoAcreditado {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export class DetalleDocumentoAcreditadoSelected {
  nroReferencia: string;
}
