export interface Publicacion {
  ID: string;
  tituloPublicacion: string;
  tipoPublicacion: string;
  descripcionPublicacion: string;
  tempario: string;
  marca: any;
  descMarca: any;
  descripcionMarca: string;
  modulo: string;
  periodoCampania: string;
  tema: string;
  consecutivo: string;
  descripcion: string;
  codModelo: string;
  descripcionModelo: string;
  codCategoria: string;
  descripcionCategoria: string;
  listaModelos: any[];
  listaModulos: any[];
  listaCategorias: any[];
  listaTemparios: any;
  listaMarca: any;
  newSelectedRowIds: any;
  newSelectedRowIdsCategorias: any;
  tipo: any;
  descTipo: any;
  periodo: string;
  fecha_publicacion: string;
  modulos?: [];

  listaTempariosSeleccionados: any[];
}
