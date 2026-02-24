export class ItemTableListaPublicaciones {
  ID: string;
  createdAt: string;
  createdBy: string;
  descripcion: string;
  fecha_publicacion: string;
  id_estado: string;
  modifiedAt: string;
  modifiedBy: string;
  nota: string;
  servicio: string;
  tema: string;
  tipo: string;
}

export class oPaginationTablePublicaciones {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}
