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

export interface FiltrosReporteDesnaturalizados {
  concesionario: Concesionario[];
  codSucursal: string[];
  codStatusDesnaturalizados: string[];
  // codTipoMaterial: string[];
  // nroPedido: string;
  fechaProcesamientoInicio: string;
  fechaProcesamientoFin: string;
}
