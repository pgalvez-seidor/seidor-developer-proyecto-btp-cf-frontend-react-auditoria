import { WishlistCutInterval } from '@/types/Maestras';
export interface WishlistInterface {
  idWishlist: string;
  correlativo: string;
  concesionario: string;
  periodo: string;
  ejercicio: number;
  periodoEjecucion: string;
  fechaCreacion: string;
  codEstado: string;
  descripcionEstadoWishlist: string;
}

export interface WishlistState {
  itemSelectedState: string | null;
  cutInterval: WishlistCutInterval[];
  wishlistSelected: WishlistInterface | null;
}
