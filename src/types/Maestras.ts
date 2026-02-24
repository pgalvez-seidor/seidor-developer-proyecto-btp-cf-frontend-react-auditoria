export interface Maestras {
  descripcion: string;
  codigo: string;
  campo: string;
  campo2: string;
  campo3: string;
  valor: string;
  maestro_cabecera_id: string;
  id_estado: number;
  codigo_maestro_cabecera: string;
  padre_id: string;
  codigo_padre_descripcion: string;
  orden: number;
}

export interface WishlistCutInterval {
  id: string;
  descripcion: string;
  codigo: string;
  campo: string;
  valor: string;
  maestro_cabecera_id: string;
  id_estado: number;
  codigo_maestro_cabecera: string;
  padre_id: string;
  codigo_padre_descripcion: string;
  orden: number;
  created_at: string;
}
