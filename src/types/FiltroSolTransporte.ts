class Concesionario {
    // ID: string;
    id: string;
    codigo: string;
    // descripcion: string;
    description: string;
}

export interface FiltrosSolTransporte {
    concesionario: Concesionario[];
    puntoEntrega: string[];
    vin: string;
    version: string[];
    fechaFacturaInicio: string;
    fechaFacturaFin: string;
    codEstado: string[];
}
