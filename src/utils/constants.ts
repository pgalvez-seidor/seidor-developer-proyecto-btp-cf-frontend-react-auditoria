import { AclItem } from "./acl";

export const menuItems = [
  {
    label: 'Home',
    path: '/',
    roles: ['admin', 'user'],
  },
  {
    label: 'Unidades',
    path: '/unidades',
    roles: ['admin'],
    children: [
      {
        label: 'Confirmación / Creación de reservas',
        path: '/unidades/creacion-de-reservas',
        roles: ['admin'],
        principal: true,
      },
      {
        label: 'Repositorio de Documentos',
        path: '/unidades/repositorio-de-documentos',
        roles: ['admin'],
        principal: true,
      },
      {
        label: 'Repositorio de Cliente Final',
        path: '/unidades/repositorio-de-cliente-final',
        roles: ['admin'],
        principal: true,
      },
      {
        label: 'Transferencia entre Dealers',
        path: '/unidades/transferencia-entre-dealers',
        roles: ['admin'],
        principal: true,
      },

      {
        label: 'Reportes de Vehiculos',
        path: '/unidades/reportes-vehiculo',
        roles: ['admin'],
        principal: true,
        children: [
          {
            label: 'Seguimiento de pedido de unidades',
            path: '/unidades/reportes-vehiculo/seguimiento-pedido-unidades',
            roles: ['admin'],
          },
        ],
      },
    ],
  },
  {
    label: 'Garantías',
    path: '/garantias',
    roles: ['admin'],
    children: [
      {
        label: 'Creación de Solicitud de Reclamos de Garantías',
        path: '/garantias/creacion-de-solicitud-reclamos-garantia',
        roles: ['admin'],
        principal: true,
      },
      {
        label: 'Reporte de Seguimiento de Solicitud de garantía',
        path: '/garantias/reporte-de-seguimiento-de-solicitud-de-garantia',
        roles: ['admin'],
        principal: true,
      },
      {
        label: 'Reporte de recalls',
        path: '/garantias/reporte-de-recalls',
        roles: ['admin'],
        principal: true,
      },

      // {
      //   label: 'Garantía',
      //   path: '/garantias/garantia',
      //   roles: ['admin'],
      // },
      // {
      //   label: 'Reportes Garantía',
      //   path: '/garantias/reportes-garantia',
      //   roles: ['admin'],
      //   children: [
      //     {
      //       label: 'Recall',
      //       path: '/garantias/reportes-garantia/recall',
      //       roles: ['admin'],
      //     },
      //   ],
      // },
    ],
  },
  {
    label: 'Repuestos',
    path: '/repuestos',
    roles: ['admin'],
    children: [
      {
        label: 'Pedido de venta',
        path: '/repuestos/pedido-de-venta',
        roles: ['admin'],
        principal: true,
      },
      {
        label: 'Consulta de Referencia',
        path: '/repuestos/consulta-referencia',
        roles: ['admin'],
        principal: true,
      },
      {
        label: 'Reporte Inmobilizado',
        path: '/repuestos/reporte-inmobilizado',
        roles: ['admin'],
        principal: true,
      },
      {
        label: 'Reporte de respuestos',
        path: '/repuestos/reporte-repuestos',
        roles: ['admin'],
        principal: true,
        children: [
          {
            label: 'Lista de precios de Stock',
            path: '/repuestos/reporte-repuestos/lista-precios-stock',
            roles: ['admin'],
          },
          {
            label: 'Seguimiento de Pedidos',
            path: '/repuestos/reporte-repuestos/seguimiento-pedidos',
            roles: ['admin'],
          },
        ],
      },
    ],
  },
  {
    label: 'Finanzas',
    path: '/finanzas',
    roles: ['admin'],

    children: [
      {
        label: 'Reporte de estado de Cuenta',
        path: '/finanzas/reporte-estado-cuenta',
        roles: ['admin'],
        principal: true,
      },
      {
        label: 'Reporte de linea de crédito',
        path: '/finanzas/reporte-linea-credito',
        roles: ['admin'],
        principal: true,
      },
      {
        label: 'Reporte de facturas',
        path: '/finanzas/reporte-facturas',
        roles: ['admin'],
        principal: true,
      },
    ],
  },
  {
    label: 'Seguridad',
    path: '/seguridad',
    roles: ['admin'],
    children: [
      {
        label: 'Usuarios',
        path: '/seguridad/usuarios',
        roles: ['admin'],
        principal: true,
      },
      {
        label: 'Maestro',
        path: '/seguridad/maestro',
        roles: ['admin'],
        principal: true,
      },
      {
        label: 'Auditoria',
        path: '/seguridad/auditoria',
        roles: ['admin'],
        principal: true,
      },
    ],
  },
  {
    label: 'Configuración',
    path: '/configuracion',
    roles: ['admin'],
    children: [
      {
        label: 'Home',
        path: '/configuracion/home',
        roles: ['admin'],
        principal: true,
      },
      {
        label: 'Campañas',
        path: '/configuracion/campanas',
        roles: ['admin'],
        principal: true,
      },
      {
        label: 'Eventos',
        path: '/configuracion/eventos',
        roles: ['admin'],
        principal: true,
      },
      {
        label: 'Noticias',
        path: '/configuracion/noticias',
        roles: ['admin'],
        principal: true,
      },
    ],
  },
];

export const maestro = [
  {
    id: 'agrupaciones',
    nombre: 'Agrupaciones',
    descripcion: 'seccion de agrupaciones',
    componente: 'Agrupaciones',
  },
  {
    id: 'bases',
    nombre: 'Bases',
    descripcion: 'seccion de bases',
    componente: 'Bases',
  },
];

export const tablasMaestras = {
  tablaPedidoUnidadesEstado: 'TE004',
  tablaPedidoVentaEstado: 'TE001',
  tablaLineaProducto: 'TM011',
  tablaRoles: 'TM006',
  tablaSucursal: 'TM008',
  tablaTipoDocumento: 'TM009',
  tablaConcesionarios: 'TM007',
  tablaClasePedido: 'TM001',
  tablaClasePedidoGrupo: "TC014",
  tablaClaseReclamo: 'TC002',
  tablaMotivoDevolucion: 'TM005',
  tablaMotivoCancelacion: 'TM004',
  tablaEstadoDecisionSolicitud: 'TE003',
  tablaModulos: 'TM010',
  tablaPublicaciones: 'TM014',
  tablaMarca: 'TM015',
  tablaTemparios: 'TM016',
  tablaAsignacionSustentos: 'TC003',
  tablaListaPosiciones: 'TC004',
  tablaCategorias: 'TC006',
  tablaEstadoVehiculos: 'TE006',
  tablaStatusDesnaturalizados: 'TE008',
  tablaEstadoWishlist: 'TE009',
  tablaEstadoInmovilizado: 'TE007',
  tablaGestionURLPowerBI: 'TC010'
};

export const constanteRoles = {
  rolSuperUsuario: 'NUAM_User',
  rolNuamUsuario: 'NUAM_User',
};

export const ACL_CONFIG: AclItem[] = [
  {
    label: 'Home',
    path: '/',
    roles: ['NUAM_User'],
  },
  {
    label: 'Seguridad',
    path: '/seguridad',
    roles: ['NUAM_User'],
    children: [
      {
        label: 'Usuarios',
        path: '/seguridad/usuarios',
        roles: ['NUAM_User'],
        principal: true,
      },
      {
        label: 'Maestro',
        path: '/seguridad/maestro',
        roles: ['NUAM_User'],
        principal: true,
      },
      {
        label: 'Auditoría',
        path: '/seguridad/auditoria',
        roles: ['NUAM_User'],
        principal: true,
      },
    ],
  }
];


export const aplicaciones = {
  //HOME
  appHome: 'App Home',
  //REPUESTOS
  appPedidoVenta: 'App Pedido de Venta',
  appDatosGeneralesDeMateriales: 'App Datos Generales de Materiales',
  appReporteDeBackOrder: 'App Reporte de BackOrder',
  appReporteInmovilizados: 'App Reporte de Inmovilizados',
  //VEHICULOS
  appDatosGeneralesVehiculos: 'App Datos Generales Vehículos',
  appRegistroDeCuota: 'App Registro de Cuota',
  appEstadoActividadComercial: 'App Estado Actividad Comercial',
  appSeguimientoUnidades: 'App Seguimiento de Vehículos Asignados',
  appSeguiminetoDePedido: 'App Seguimiento De Pedido',
  appReporteSolicitudTransporte: 'App Seguimiento Solicitud de Transporte',
  //GARANTIAS
  appSolicitudReclamoGarantias: 'App Solicitud de Reclamo de Garantías',
  appReporteDeRecalls: 'App Reporte de Recalls',
  appReporteDesnaturalizado: 'App Reporte de Desnaturalizado',
  appCampaniaVigentesPorVehiculo: 'App Campañas Vigentes por Vehículo',
  //FINANZAS
  appReporteDeDocumentos: 'App Reporte de Documentos',
  appDashBoardMCOL: 'App Dashboard MCOL',
  appReporteDeTransmisionFacturacion: 'App Reporte de Transmision de Facturacion',
  appReporteDeFacturas: 'App Reporte de Facturas',
  //SEGURIDAD
  appUsuario: 'App Usuario',
  appMaestros: 'App Maestros',
  appAuditoria: 'App Auditoría',
  //CONFIGURACION
  appHomeConfig: 'App Home Config',
  appAdministradorEventosNoticias: 'App Administrar Eventos & Noticias',
  //PUBLICACIONES
  appPublicacion: 'App Publicaciones',
  appReportePowerBI: 'App Reportes en Power BI',

  ////**** */
  appReporteIngresoAcreditados: 'App Reporte Ingreso Acreditados',
  appReporteDeDesnaturalizados: 'App Reporte de Desnaturalizados',
  // appConfirmacionReservas: 'App Confirmación de Reservas',

  appGarantia: 'App Garantía',

  // appDatosGeneralesVehiculo: 'App Datos Generales de Vehículo',
  // appGestionWishlist: 'App Gestion Wishlist',
};

export const claseDeReclamoGarantiaTipoGarantia = {
  reclamoFortuito: {
    codigo: 'Z000-0',
    field: [],
  },
  reclamoAlistamiento: {
    codigo: 'Z001-1',
    field: [],
  },
  reclamoRepuesto: {
    codigo: 'Z003-3',
    field: [],
  },

  x: {
    codigo: 'Z000-4',
    field: [],
  },
  reclamoGoodWill: {
    codigo: 'Z006-6',
    field: [],
  },
  reclamoRetomasC: {
    codigo: 'Z007-6',
    field: [],
  },
  reclamoRecall: {
    codigo: 'Z009-9',
    field: [],
  },
};

export enum CodEstadoSolicitudRecepcionGarantia {
  EnProcesoRadicacion = 'Z001',
  Devuelta = 'Z004',
  Borrador = 'ZDRA',
  Recall = 'Z009',
}

export enum CodClaseReclamoGarantiaGarantia {
  reclamoGoodWill = 'Z006',
  reclamoRetomasC = 'Z007',
  reclamoRecall = 'Z009',
}

export const listaPosicion = [
  {
    codigo: 'FR',
    descripcion: 'Mano de Obra(FR)',
    selected: false,
  },
  {
    codigo: 'MAT',
    descripcion: 'Material',
    selected: false,
  },
  {
    codigo: 'SUBL',
    descripcion: 'Servicio a Terceros(SUBL)',
    selected: false,
  },
];

// export const innativityTime = 300000;
export const innativityTime = 5 * 60 * 1000; // 1 minuto en ms;
export const innativityCountDownTime = 45; //45 seg
export const paginacionOffset = 50;
export const kilometrajeMaximoLimitado = 1000000000;



export enum tipoProgramaSevicio {
  tipoProgramaSevicioZBOL = 'ZBOL'
}


export enum estadoSolicitudTransporte {
  estadoPendiente = 'Z01'
}

export const demoSeidor = false;

export const sHosIdpProd = ['DEV', 'QAS'].includes('PRD') ? "https://a1cu01sql.accounts.ondemand.com" : "https://ahuef2thg.accounts.ondemand.com";

export const listIvaImplicitoXLineaProd = ["ZQUI"]