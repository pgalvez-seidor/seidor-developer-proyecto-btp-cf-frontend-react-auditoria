class Concesionario {
  // ID: string;
  id: string;
  codigo: string;
  // descripcion: string;
  description: string;
}

export interface FiltrosSolReclamoGarantia {
  concesionario: Concesionario[];
  codSucursal: string[];
  codClaseReclamo: string[];
  fechaRadicacionInicio: string;
  fechaRadicacionFin: string;
  codEstado: string[];
  idSolicitud: string
}
