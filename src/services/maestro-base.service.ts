import { http } from '../core/http';
import { IParamHeaders } from '../interfaces/paramHeaders.interface';
import { serviceGet, servicePost } from '../utils/service';
import { generarIdTransaccionFecha } from '../utils/utilHttp';

// Wrapper para OData que devuelve formato estándar
const odataGet = async (url: string, oParamHeaders: IParamHeaders): Promise<any> => {
  try {
    const response = await http(oParamHeaders).get(url);
    const { idtransaccion, fechatransaccion } = generarIdTransaccionFecha();

    return {
      oAuditResponse: {
        code: 1,
        idtransaccion,
        message: 'Consulta exitosa',
        fechatransaccion
      },
      oDataResponse: response.data
    };
  } catch (error: any) {
    const { idtransaccion, fechatransaccion } = generarIdTransaccionFecha();
    return {
      oAuditResponse: {
        code: -1,
        idtransaccion,
        message: error?.response?.data?.error?.message || 'Error en la consulta',
        fechatransaccion
      },
      oDataResponse: null
    };
  }
};

export const obtenerMaestrosDetalleCamposXCabecera = async (
  oParam,
  oParamHeaders: IParamHeaders,
): Promise<any> => {
  const maestroCabeceraId = oParam?.id || oParam?.maestroCabecera_ID;
  if (!maestroCabeceraId) {
    const { idtransaccion, fechatransaccion } = generarIdTransaccionFecha();
    return {
      oAuditResponse: {
        code: -1,
        idtransaccion,
        message: 'ID de cabecera requerido',
        fechatransaccion
      },
      oDataResponse: null
    };
  }

  const result = await odataGet(
    `/api/base/maestro/odata/v4/maestro-detalle/VMaestroDetalle?$filter=maestroCabeceraId eq '${maestroCabeceraId}' and deletedAt eq null`,
    oParamHeaders
  );

  // Adaptar respuesta al formato que espera el frontend
  if (result.oAuditResponse.code === 1) {
    result.oDataResponse = {
      results: {
        obtenerMaestrosDetalleCamposXCabecera: result.oDataResponse.value || []
      }
    };
  }

  return result;
};

export const obtenerMaestrosDetalleCamposXCabeceraDetalle = async (
  oParam,
  oParamHeaders: IParamHeaders,
): Promise<any> => {
  const maestroCabeceraId = oParam?.id || oParam?.idcabecera;
  if (!maestroCabeceraId) {
    const { idtransaccion, fechatransaccion } = generarIdTransaccionFecha();
    return {
      oAuditResponse: {
        code: -1,
        idtransaccion,
        message: 'ID de cabecera requerido',
        fechatransaccion
      },
      oDataResponse: null
    };
  }

  const result = await odataGet(
    `/api/base/maestro/odata/v4/maestro-detalle/VMaestroDetalle?$filter=maestroCabeceraId eq '${maestroCabeceraId}' and deletedAt eq null`,
    oParamHeaders
  );

  // Adaptar respuesta al formato que espera el frontend
  if (result.oAuditResponse.code === 1) {
    result.oDataResponse = {
      results: {
        obtenerMaestrosDetalleCamposXCabecera: result.oDataResponse.value || []
      }
    };
  }

  return result;
};

export const obtenerMaestrosPowerBICab = async (
  oParam,
  oParamHeaders: IParamHeaders,
): Promise<any> => {
  try {
    const response = await servicePost(
      'api/base/maestro/rest/maestro-detalle/obtenerMaestrosPowerBICab',
      oParam,
      oParamHeaders,
    );
    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Error de datos');
  }
};

export const obtenerMaestrosPowerBIHtml = async (oParam): Promise<any> => {
  try {
    const path = [];
    path.push(`id=${oParam.id}`);
    let url = '';
    const base_url = '/api/base/maestro/rest/maestro-detalle/obtenerMaestrosPowerBIHtml';
    if (path.length > 0) {
      const query = path.join('&');
      url = `${base_url}?${query}`;
    } else {
      url = base_url;
    }

    const response = await serviceGet(url);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Error de datos');
  }
};

export const obtenerMaestrosCabeceraXFiltro = async (
  oParam,
  oParamHeaders: IParamHeaders,
): Promise<any> => {
  // Construir filtros OData basados en los parámetros recibidos
  const filters: string[] = [];

  const filtroBuscar = oParam?.filtros?.filtroBuscarTablaMaestra;
  if (filtroBuscar) {
    filters.push(`(contains(tolower(codigo), '${filtroBuscar.toLowerCase()}') or contains(tolower(descripcion), '${filtroBuscar.toLowerCase()}'))`);
  }

  // Solo incluir registros no eliminados
  filters.push('deletedAt eq null');

  const filterQuery = filters.length > 0 ? `?$filter=${filters.join(' and ')}` : '?$filter=deletedAt eq null';

  const result = await odataGet(
    `/api/base/maestro/odata/v4/maestro-cabecera/MaestroCabecera${filterQuery}`,
    oParamHeaders
  );

  // Adaptar respuesta al formato que espera el frontend
  if (result.oAuditResponse.code === 1) {
    result.oDataResponse = {
      obtenerMaestrosCabecera: result.oDataResponse.value || []
    };
  }

  return result;
};
export const obtenerMaestrosDetalleCamposXPadre = async (
  oParam,
  oParamHeaders: IParamHeaders,
): Promise<any> => {
  try {
    const response = await servicePost(
      'api/base/maestro/rest/maestro-detalle/obtenerMaestrosDetalleCamposXPadre',
      oParam,
      oParamHeaders,
    );
    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Error de datos');
  }
};

export const registrarMaestroCabecera = async (
  oParam,
  oParamHeaders: IParamHeaders,
): Promise<any> => {
  try {
    const response = await servicePost(
      'api/base/maestro/rest/maestro-cabecera/registrarMaestroCabecera',
      oParam,
      oParamHeaders,
    );

    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Error de datos');
  }
};

export const actualizarMaestroCabecera = async (
  oParam,
  oParamHeaders: IParamHeaders,
): Promise<any> => {
  try {
    const response = await servicePost(
      'api/base/maestro/rest/maestro-cabecera/actualizarMaestroCabecera',
      oParam,
      oParamHeaders,
    );

    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Error de datos');
  }
};

export const registrarMaestroDetalle = async (
  oParam,
  oParamHeaders: IParamHeaders,
): Promise<any> => {
  try {
    const response = await servicePost(
      'api/base/maestro/rest/maestro-detalle/registrarMaestroDetalle',
      oParam,
      oParamHeaders,
    );

    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Error de datos');
  }
};

export const actualizarMaestroDetalle = async (
  oParam,
  oParamHeaders: IParamHeaders,
): Promise<any> => {
  try {
    const response = await servicePost(
      'api/base/maestro/rest/maestro-detalle/actualizarMaestroDetalle',
      oParam,
      oParamHeaders,
    );

    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Error de datos');
  }
};

export const eliminarMaestroDetalle = async (
  oParam,
  oParamHeaders: IParamHeaders,
): Promise<any> => {
  try {
    const response = await servicePost(
      'api/base/maestro/rest/maestro-detalle/eliminarMaestroDetalle',
      oParam,
      oParamHeaders,
    );

    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Error de datos');
  }
};
export const obtenerCamposCatSuperior = async (
  oParam,
  oParamHeaders: IParamHeaders,
): Promise<any> => {
  try {
    const response = await servicePost(
      'api/base/maestro/rest/maestro-detalle/obtenerCamposCatSuperior',
      oParam,
      oParamHeaders,
    );

    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Error de datos');
  }
};

export const eliminarMaestroCabecera = async (
  oParam,
  oParamHeaders: IParamHeaders,
): Promise<any> => {
  try {
    const response = await servicePost(
      'api/base/maestro/rest/maestro-cabecera/eliminarMaestroCabecera',
      oParam,
      oParamHeaders,
    );

    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Error de datos');
  }
};

// --- NUEVOS MÉTODOS PARA INTEGRAR EL NUEVO MICROSERVICIO DE MAESTROS VÍA API GATEWAY --- //
export const obtenerMaestroCabeceraPorCodigo = async (
  codigo: string,
  oParamHeaders: IParamHeaders = {} as IParamHeaders
): Promise<any> => {
  try {
    const response = await http(oParamHeaders).get(
      `/api/base/maestro/odata/v4/maestro-cabecera/MaestroCabecera?$filter=codigo eq '${codigo}'`
    );
    if (response.status !== 200) {
      throw new Error('Error de datos');
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error de datos');
  }
};

export const obtenerMaestrosDetallePorCabeceraId = async (
  maestroCabecera_ID: string,
  oParamHeaders: IParamHeaders = {} as IParamHeaders
): Promise<any> => {
  try {
    const response = await http(oParamHeaders).get(
      `/api/base/maestro/odata/v4/maestro-detalle/MaestroDetalle?$filter=maestroCabecera_ID eq '${maestroCabecera_ID}'`
    );
    if (response.status !== 200) {
      throw new Error('Error de datos');
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error de datos');
  }
};

export const obtenerDetallesPorCodigoCabecera = async (
  codigoCabecera: string,
  oParamHeaders: IParamHeaders = {} as IParamHeaders
) => {
  const cabeceraResp = await obtenerMaestroCabeceraPorCodigo(codigoCabecera, oParamHeaders);

  // En OData v4, el array de resultados viene en la propiedad 'value'
  const listaCabeceras = cabeceraResp?.value || [];

  if (listaCabeceras.length === 0) {
    return [];
  }

  // OData de SAP CAP devuelve la llave primaria en mayúscula 'ID' de forma predeterminada
  const idCabecera = listaCabeceras[0].ID || listaCabeceras[0].id;
  const detalleResp = await obtenerMaestrosDetallePorCabeceraId(idCabecera, oParamHeaders);

  const listaDetalles = detalleResp?.value || [];

  // Normalizar las propiedades críticas por si alguna base de datos en HANA las mapea en mayúscula
  return listaDetalles.map((item: any) => ({
    ...item,
    id: item.ID || item.id,
    codigo: item.CODIGO || item.codigo,
    descripcion: item.DESCRIPCION || item.descripcion,
    valor: item.VALOR || item.valor
  }));
};
