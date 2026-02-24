import { createContext } from 'react';
import { Usuario } from '../../types/Users';
import { PedidoVenta } from '../../types/PedidoVenta';
import { ItemDetPedidoVenta } from '../../types/ItemDetPedidoVenta';
import { FacturaSeleccionada } from '../../types/FacturaSeleccionada';

export interface DataContextProps {
  usuarioToken: string;
  usuarioData: Usuario | null;
  pedidoVenta: PedidoVenta | null;
  detallePedidoVenta: ItemDetPedidoVenta[] | null;
  facturaSeleccionada: FacturaSeleccionada | null;
  menuItems: any[];
  usuarioInfo: any;
  cupoMCol: string;

  setUsuarioToken: (usuarioToken: DataContextProps['usuarioToken']) => void;
  setUsuarioData: (usuarioData: DataContextProps['usuarioData']) => void;
  setPedidoVenta: (pedidoVenta: DataContextProps['pedidoVenta']) => void;
  setDetallePedidoVenta: (
    detallePedidoVenta: DataContextProps['detallePedidoVenta'],
  ) => void;
  setFacturaSeleccionada: (
    facturaSeleccionada: DataContextProps['facturaSeleccionada'],
  ) => void;
  setMenuItems: (menuItems: DataContextProps['menuItems']) => void;
  setUsuarioInfo: (menuItems: DataContextProps['usuarioInfo']) => void;

  setCupoMCol: (cupoMCol: DataContextProps['cupoMCol']) => void;

  authStatus: any;
  setAuthStatus: (authStatus: DataContextProps['authStatus']) => void;
}

export const DataContext = createContext<DataContextProps | undefined>(undefined);
