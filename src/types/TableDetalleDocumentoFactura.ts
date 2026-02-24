//Tab-Vehiculo

export class ItemTableDetalleDocumentoFactura {
  cantidadRepuesto: string;
  condPago: string;
  descrColoritem: string;
  descrMaterial: string;
  descrOpcionitem: string;
  descrVersionitem: string;
  detalleID: string;
  idAnioModeloitem: string;
  idColoritem: string;
  idVersionitem: string;
  idopcionitem: string;
  impoBaseItem: string;
  impoIVAimplItem: string;
  impoIVAitem: string;
  impoTotalItem: string;
  material: string;
  nroDocumentoFI: string;
  nroItem: string;
  textoItem: string;
  unidadMedida: string;
  vhvin: string;
}

export class oPaginationTableDetalleDocumentoFactura {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export class CabeceraFactura {
  nroReferencia: string;
  nroDocumentoFI: string;
  descModulo: string;
  descConcesionario: string;
  descSucursal: string;
  fecDocument: string;
  subtotal: string;
  iva: string;
  total: string;
  lineaProd: string;
}
