import * as utilHttp from './utilHttp';
export const servicePost = async (url, oParam, oParamHeaders) => {
  return await utilHttp.httpPost(url, oParam, oParamHeaders);
};

export const servicePostBlob = async (url, oParam, oParamHeaders) => {
  return await utilHttp.httpPostBlob(url, oParam, oParamHeaders);
};

export const serviceDelete = async url => {
  return await utilHttp.httpDelete(url);
};

export const serviceDeleteBody = async (url, oParam, oParamHeaders) => {
  return await utilHttp.httpDeleteBody(url, oParam, oParamHeaders);
};

export const servicePath = async (url, oParam, oParamHeaders) => {
  return await utilHttp.httpPatch(url, oParam, oParamHeaders);
};

export const serviceGet = async url => {
  return await utilHttp.httpGet(url);
};

export const serviceGetBlob = async url => {
  return await utilHttp.httpGetBlob(url);
};

export const serviceGetOData = async url => {
  return await utilHttp.httpGetOData(url);
};
