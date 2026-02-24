import React, { useEffect, useState } from 'react';
// import { bm_conta_environment } from "../../environment/environment";
import { DataContext } from './DataContext';
import { nuam_enviroment } from '../../enviroment/environment';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuarioToken, setUsuarioToken] = useState(() => {
    const userToken = localStorage.getItem(nuam_enviroment.token);
    return userToken ? String(userToken) : '';
  });

  const [usuarioData, setUsuarioData] = useState(() => {
    const usuarioData = localStorage.getItem(nuam_enviroment.usuario);
    return usuarioData ? JSON.parse(usuarioData) : null;
  });

  const [pedidoVenta, setPedidoVenta] = useState(() => {
    const pedidoventa = localStorage.getItem(nuam_enviroment.pedido_venta);
    return pedidoventa ? JSON.parse(pedidoventa) : null;
  });

  const [menuItems, setMenuItems] = useState([]);

  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  const [detallePedidoVenta, setDetallePedidoVenta] = useState([]);

  const [usuarioInfo, setUsuarioInfo] = useState(null);

  const [cupoMCol, setCupoMCol] = useState('');

  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    if (usuarioToken) localStorage.setItem(nuam_enviroment.token, usuarioToken);
    if (usuarioData)
      localStorage.setItem(nuam_enviroment.usuario, JSON.stringify(usuarioData));
    if (pedidoVenta)
      localStorage.setItem(nuam_enviroment.pedido_venta, JSON.stringify(pedidoVenta));
  }, [usuarioToken, usuarioData, pedidoVenta]);

  return (
    <DataContext.Provider
      value={{
        usuarioToken,
        setUsuarioToken,
        usuarioData,
        setUsuarioData,
        pedidoVenta,
        setPedidoVenta,

        menuItems,
        setMenuItems,

        usuarioInfo,
        setUsuarioInfo,

        detallePedidoVenta,
        setDetallePedidoVenta,

        facturaSeleccionada,
        setFacturaSeleccionada,

        cupoMCol,
        setCupoMCol,

        authStatus,
        setAuthStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
