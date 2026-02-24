class Concesionario {
  id: string;
  codigo: string;
  description: string;
}

class Sucursal {
  id: string;
  codigo: string;
  description: string;
}

export interface FiltrosReporteBackOrder {
  concesionario: Concesionario[];
  codSucursal: string[];
  codMaterial: string[];
  codTipoMaterial: string[];
  nroPedido: string;
  fechaRadicacionInicio: string;
  fechaRadicacionFin: string;
  idSolicitud: string;
}
