import { ReactNode } from "react";

export interface Item {
    id_parent: string;
    conceCode: string;
    concesionario: string;
    vin: string;
    version: string;
    color: string;
    year: string;
    option: string;
    price: string;
    acciones?: ReactNode;
}