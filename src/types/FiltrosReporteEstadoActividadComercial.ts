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

export interface FiltrosReporteEstadoActividadComercial {
  concesionario: Concesionario[];
  anio: string;
  periodo: string;
  version: string;
  agruapacionMCOL: boolean;
  anioPeriodo: string;
}
