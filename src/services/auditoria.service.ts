import { http } from '../core/http';

// Servicio adaptado al backend CAP NUAM
// Backend: proyecto-btp-cf-backend-cap-auditoria
// Entidades: Auditoria, VAuditoria, VAplicacion, VnombreProceso

export const getProcesos = async (): Promise<any> => {
  try {
    const response = await http({}).get('/api/base/auditoria/rest/AuditoriaService/VnombreProceso');
    return {
      listaProcesos: response.data.value || []
    };
  } catch (error) {
    console.error('Error getProcesos:', error);
    return { listaProcesos: [] };
  }
};

export const getAplicaciones = async (): Promise<any> => {
  try {
    const response = await http({}).get('/api/base/auditoria/rest/AuditoriaService/VAplicacion');
    return {
      listaAplicaciones: response.data.value || []
    };
  } catch (error) {
    console.error('Error getAplicaciones:', error);
    return { listaAplicaciones: [] };
  }
};

export const getListadoDatosAudotoriaPaginado = async (oParam: any): Promise<any> => {
  try {
    const { page, perPage, filtro } = oParam;

    // Construir query params OData
    const filters: string[] = [];

    // Paginación
    const skip = (page - 1) * perPage;
    const top = perPage;

    // Filtros
    if (filtro.procesos && filtro.procesos.length > 0) {
      const procesoFilters = filtro.procesos.map((p: string) => `nombreProceso eq '${p}'`).join(' or ');
      filters.push(`(${procesoFilters})`);
    }

    if (filtro.estado && filtro.estado.length > 0) {
      const estadoFilters = filtro.estado.map((e: number) => `idEstado eq ${e}`).join(' or ');
      filters.push(`(${estadoFilters})`);
    }

    if (filtro.aplicaciones && filtro.aplicaciones.length > 0) {
      const appFilters = filtro.aplicaciones.map((a: string) => `aplicacion eq '${a}'`).join(' or ');
      filters.push(`(${appFilters})`);
    }

    if (filtro.transaccion) {
      filters.push(`contains(idTransaccion, '${filtro.transaccion}')`);
    }

    if (filtro.usuarios && filtro.usuarios.length > 0) {
      const userFilters = filtro.usuarios.map((u: string) => `usuario eq '${u}'`).join(' or ');
      filters.push(`(${userFilters})`);
    }

    if (filtro.fechaInicio) {
      filters.push(`createdAt ge ${new Date(filtro.fechaInicio).toISOString()}`);
    }

    if (filtro.fechaFin) {
      filters.push(`createdAt le ${new Date(filtro.fechaFin).toISOString()}`);
    }

    // Construir URL
    let url = `/api/base/auditoria/rest/AuditoriaService/VAuditoria?$skip=${skip}&$top=${top}&$count=true&$orderby=createdAt desc`;

    if (filters.length > 0) {
      url += `&$filter=${filters.join(' and ')}`;
    }

    const response = await http({}).get(url);

    const totalItems = response.data['@odata.count'] || 0;
    const totalPages = Math.ceil(totalItems / perPage);

    return {
      results: {
        oData: response.data.value || [],
        oPagination: {
          currentPage: page,
          perPage,
          totalItems,
          totalPages
        }
      }
    };
  } catch (error) {
    console.error('Error getListadoDatosAudotoriaPaginado:', error);
    throw error;
  }
};
