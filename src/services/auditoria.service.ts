import { http } from '../core/http';

// BRECHA 1 (fix): El servicio ahora llama al backend Express propio
// Backend: proyecto-btp-cf-backend-cap-auditoria → ruta base /auditoria
// Ya NO llama directamente al OData CAP (/AuditoriaService/VAuditoria)

const BASE_URL = '/api/auditoria/rest/auditoria';

export const getProcesos = async (): Promise<any> => {
  try {
    const response = await http({}).get(`${BASE_URL}/procesos`);
    return {
      listaProcesos: response.data.data || [],
    };
  } catch (error) {
    console.error('Error getProcesos:', error);
    return { listaProcesos: [] };
  }
};

export const getAplicaciones = async (): Promise<any> => {
  try {
    const response = await http({}).get(`${BASE_URL}/aplicaciones`);
    return {
      listaAplicaciones: response.data.data || [],
    };
  } catch (error) {
    console.error('Error getAplicaciones:', error);
    return { listaAplicaciones: [] };
  }
};

/** BRECHA 9: Implementado — antes siempre devolvía [] */
export const getUsuarios = async (): Promise<any> => {
  try {
    const response = await http({}).get(`${BASE_URL}/usuarios`);
    return {
      listaUsuarios: response.data.data || [],
    };
  } catch (error) {
    console.error('Error getUsuarios:', error);
    return { listaUsuarios: [] };
  }
};

export const getListadoDatosAudotoriaPaginado = async (oParam: any): Promise<any> => {
  try {
    const { page, perPage, filtro } = oParam;

    const params: Record<string, any> = {
      pagina: page,
      limit: perPage,
    };

    if (filtro.fechaInicio) params.fFechaInicio = filtro.fechaInicio;
    if (filtro.fechaFin) params.fFechaFin = filtro.fechaFin;
    if (filtro.transaccion) params.search = filtro.transaccion;

    if (filtro.procesos?.length > 0) {
      params.filtrosProcesos = filtro.procesos;
    }
    if (filtro.estado?.length > 0) {
      params.filtrosEstadosAuditoria = filtro.estado.map(String);
    }
    if (filtro.aplicaciones?.length > 0) {
      params.filtrosAplicaciones = filtro.aplicaciones;
    }

    const response = await http({}).get(`${BASE_URL}/cabecera-paginado`, { params });

    const data = response.data;

    return {
      results: {
        oData: data.obtenerAuditoriaCabecera || [],
        oPagination: {
          currentPage: data.pagina || page,
          perPage,
          totalItems: data.cantidadRegTotales || 0,
          totalPages: data.paginaTotales || 1,
        },
      },
    };
  } catch (error) {
    console.error('Error getListadoDatosAudotoriaPaginado:', error);
    throw error;
  }
};
