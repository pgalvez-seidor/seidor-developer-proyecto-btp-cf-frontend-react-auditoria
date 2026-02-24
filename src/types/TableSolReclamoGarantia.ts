export class ItemTableGarantia {
  idConcesionario: string;
  idSucursalConcesionario: string;
  claseReclamo: string;
  idSolicitudGarantia: string;
  ordenTrabajoGarantiaActual: string;
  numeroChasis: string;
  numeroMotor: string;
  kilometraje: string;
  referenciaCausal: string;
  tipoGarantia: string;
  numeroCasoSalesforce: string;
  estadoRecepcionSolicitudGarantia: string;
  coberturaGarantia: string;
  fechaQueja: string;
  fechaReparacion: string;
  fechaVentaVehiculo: string;
  responsableCobertura: string;
  codigosDiagnosticoDtc: string;
  programaServicio: string;
  queja: string;
  causa: string;
}

export class oPaginationTableGarantia {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}
