//Tab-Vehiculo

export class ItemTableDetalleTransmisionFacturacionRepuesto {
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

export class oPaginationTableDetalleTransmisionFacturacionRepuesto {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

//TabCasos

export class ItemTableDetalleTransmisionFacturacionVehiculo {
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

export class oPaginationTableDetalleTransmisionFacturacionVehiculo {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export class CabeceraTransmisionFactura {
  nroDocumentoFI: string;
  nroReferencia: string;
}
