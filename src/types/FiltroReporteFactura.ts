export interface FiltroReporteFactura {
  concesionario: Concesionario[];
  fechaDocumentoInicio: string;
  fechaDocumentoFin: string;
  codModulo: string;
  lineaProducto: string[];
  claseDoc: string[];
  zestado: string[];
  referenciaDocumento: string;
  codeMaterial: string;
  codSucursal: string[];
}

export interface Concesionario {
  id: string;
  codigo: string;
  description: string;
}
