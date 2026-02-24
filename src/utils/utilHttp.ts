import { DateTime } from 'luxon';
import { http } from '../core/http';
import * as uitlResponse from './uitlResponse';

export const httpPost = async (path, data, oParamHeaders) => {
  try {
    const rawResponse = await http(oParamHeaders).post(path, data);

    const content = await rawResponse.data;
    return success(content, null);
  } catch (e) {
    return error(e, null, null);
  }
};

export const httpPatch = async (path, data, oParamHeaders) => {
  try {
    const rawResponse = await http(oParamHeaders).patch(path, data);

    const content = await rawResponse.data;

    return success(content, null);
  } catch (e) {
    return error(e, null, null);
  }
};

export const httpGet = async path => {
  try {
    const rawResponse = await http({}).get(path);

    const content = await rawResponse.data;

    return success(content, null);
  } catch (e) {
    return error(e, null, null);
  }
};

export const httpDelete = async path => {
  try {
    const rawResponse = await http({}).delete(path);

    const content = await rawResponse.data;

    return success(content, null);
  } catch (e) {
    return error(e, null, null);
  }
};

export const httpDeleteBody = async (path, data, oParamHeaders) => {
  try {
    const rawResponse = await http(oParamHeaders).delete(path, data);

    const content = await rawResponse.data;

    return success(content, null);
  } catch (e) {
    return error(e, null, null);
  }
};

export const httpGetBlob = async path => {
  try {
    const rawResponse = await http({}, { responseType: 'blob' }).get(path);

    const content = await rawResponse.data;

    return content;
  } catch (e) {
    return error(e, null, null);
  }
};

export const httpGetText = async (path: string) => {
  const { data } = await http(
    {
      responseType: 'text',
      transformResponse: [v => v], // evita parsers
      headers: { Accept: 'text/html' },
    },
    {},
  ).get(path);
  return data as string;
};

export const httpPostBlob = async (path, data, oParamHeaders) => {
  try {
    const rawResponse = await http({ ...oParamHeaders }, { responseType: 'blob' }).post(
      path,
      data,
    );

    const content = await rawResponse.data;

    return content;
  } catch (e) {
    return error(e, null, null);
  }
};

export const httpGetOData = async path => {
  try {
    const rawResponse = await http({}).get(path);

    const content = await rawResponse.data;

    return content;
  } catch (e) {
    return error(e, null, null);
  }
};

export const generarHeaders = self => {
  const request: any = {};
  const generarIdTransaccionFechaResp = generarIdTransaccionFecha();
  request.fechatransaccion = generarIdTransaccionFechaResp.fechatransaccion;
  request.idtransaccion = generarIdTransaccionFechaResp.idtransaccion;
  request.aplicacion = '';
  request['Content-Type'] = 'application/json';
  request['subdomain'] = '';
  const sociedad = self.getView().getModel('localModel').getData().codSocElegida;
  request.sociedad = sociedad;
  return request;
};

export const generarIdTransaccionFecha = () => {
  const dt = DateTime.now();
  const fechaIso = dt.toISO() || '';
  const fechaString = dt.toFormat('yyyyMMddHHmmssSSS');
  const randon = Math.floor(Math.random() * 1000000 + 1);
  const idtransaccion = fechaString + '' + randon;
  return { idtransaccion: idtransaccion, fechatransaccion: fechaIso };
};

export const success = (result, mockData) => {
  let modResult;
  const oAuditResponse = result.oAuditResponse;

  if (mockData) {
    modResult = uitlResponse.success(
      '17682783782383',
      'Se consultó correctamente.',
      mockData,
    );
  } else {
    if (oAuditResponse.code === 1) {
      modResult = uitlResponse.success(
        oAuditResponse.idtransaccion,
        oAuditResponse.message,
        result.oDataResponse,
      );
    } else if (oAuditResponse.code > 1 || oAuditResponse.code == 0) {
      modResult = uitlResponse.warn(
        oAuditResponse.idtransaccion,
        oAuditResponse.message,
        result.oDataResponse,
      );
    } else if (oAuditResponse.code == -99) {
      modResult = uitlResponse.errorNoAutorizado(
        oAuditResponse.idtransaccion,
        oAuditResponse.message,
        result.oDataResponse,
      );
      //utilPopUps.onMessageErrorDialogPress(modResult.idtransaccion);
    } else if (oAuditResponse.code < 0 && oAuditResponse.code !== -1000) {
      modResult = uitlResponse.error(
        oAuditResponse.idtransaccion,
        oAuditResponse.message,
        result.oDataResponse,
      );
      //utilPopUps.onMessageErrorDialogPress(modResult.idtransaccion);
    } else if (oAuditResponse.code === -1000) {
      modResult = uitlResponse.exception(
        oAuditResponse.idtransaccion,
        oAuditResponse.message,
      );
    }
  }
  return modResult;
};
export const error = (er, oHeader, mockData) => {
  let modResult;

  if (mockData) {
    modResult = uitlResponse.success(
      '17682783782383',
      'Se consultó correctamente.',
      mockData,
    );
  } else {
    if (er.response) {
      if (er.response.data) {
        const oAuditResponse = er.response.data.oAuditResponse ?? {
          idtransaccion: '',
          message: er.response.data?.message ?? 'Ocurrió un error en el servicio.',
        };
        const result = er.response.data;
        if (oAuditResponse.code > 1 || oAuditResponse.code == 0) {
          modResult = uitlResponse.warn(
            oAuditResponse.idtransaccion,
            oAuditResponse.message,
            result.oDataResponse,
          );
        } else if (oAuditResponse.code == -99) {
          modResult = uitlResponse.errorNoAutorizado(
            oAuditResponse.idtransaccion,
            oAuditResponse.message,
            result.oDataResponse,
          );
          //utilPopUps.onMessageErrorDialogPress(modResult.idtransaccion);
        } else if (oAuditResponse.code < 0 && oAuditResponse.code !== -1000) {
          modResult = uitlResponse.error(
            oAuditResponse.idtransaccion,
            oAuditResponse.message,
            result.oDataResponse,
          );
          //utilPopUps.onMessageErrorDialogPress(modResult.idtransaccion);
        } else if (oAuditResponse.code === -1000) {
          modResult = uitlResponse.exception(
            oAuditResponse.idtransaccion,
            oAuditResponse.message,
          );
        }
      } else {
        modResult = uitlResponse.errorServicio(er, oHeader);
      }
    } else {
      modResult = uitlResponse.errorServicio(er, oHeader);
    }
  }
  return modResult;
};
