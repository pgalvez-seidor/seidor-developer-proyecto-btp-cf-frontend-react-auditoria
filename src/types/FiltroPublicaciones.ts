class TipoPublicacion {
  // ID: string;
  id: string;
  codigo: string;
  // descripcion: string;
  description: string;
}

export interface FiltroPublicaciones {
  fechaPublicacionFin: string;
  fechaPublicacionInicio: string;
  publicaciones: TipoPublicacion[];
  listaPublicacionesSeleccionadas: any[];
  listaModulosSeleccionados: any[];
  listaCategoriasSeleccionadas: any[];
  listaCategorias: any[];
  categorias: string[];
  modulos: string[];
  idPublicacion: string;
  listaPublicaciones?: any[];
  listaTempariosSeleccionados: any[];
}
