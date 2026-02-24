export class ItemTableDatosGenVehiculosSolReclamoUnidad {
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
  descripcionEstadoRecepcionSolicitud: string;
}

export class oPaginationTableDatosGenVehiculosSolReclamoUnidad {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface VehiculoUnidad {
  nroChasis: string;
  idVersion: string;
  descripcionVersion: string;
  nrofabricacion: string;
  idColor: string;
  descripcionColor: string;
  anioModelo: string;
  idOpcion: string;
  descripcionOpcion: string;
  estado: string;
  fechaNacionalizacion: string;
  fechaFacturacion: string;
  fechaEntregaMcol: string;
  horaEntregaMCOL: string;
  fechaVentaPublico: string;
  fechaMatricula: string;
  fechaEntregaClienteFinal: string;
  nroMotor: string;
  nroManifiesto: string;
  ubicacion: string;
  nroPlaca: string;
  nroFacturaMcol: string;
  valorFacturaMcol: string;
  valorFacturaConcesionario: string;
  nroFacturaConcesionario: string;
}
