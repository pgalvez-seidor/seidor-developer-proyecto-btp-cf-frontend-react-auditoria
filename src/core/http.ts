import { demoSeidor } from '@/utils/constants';
import axios, { AxiosInstance } from 'axios';

let _csrfToken: string | null = null;

async function getCsrfToken(): Promise<string> {
  if (_csrfToken) return _csrfToken;
  try {
    const response = await axios.get('/user-api/currentUser', {
      headers: { 'x-csrf-token': 'Fetch' },
    });
    _csrfToken = response.headers['x-csrf-token'] || '';
  } catch (e: any) {
    _csrfToken = e?.response?.headers?.['x-csrf-token'] || '';
  }
  return _csrfToken || '';
}

export const http = (oParamHeaders, config = {}): AxiosInstance => {

  let token = import.meta.env.VITE_TOKEN_TEST;

  const isLocal = import.meta.env.MODE === 'development' ? true : false;

  const headerLocal = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
    ...oParamHeaders,
  };

  let headerCloud = {
    'Content-Type': 'application/json',
    ...oParamHeaders,
  };

  if (demoSeidor) {
    token = localStorage.getItem('token');
    headerCloud = {
      ...headerCloud,
      Authorization: 'Bearer ' + token,
    };
  }

  // En producción, usar URL relativa para que el Approuter del WorkZone
  // agregue automáticamente el token de sesión del usuario
  const baseURL = isLocal ? envlocal : '';

  const instance = axios.create({
    baseURL,
    headers: isLocal ? headerLocal : headerCloud,
    timeout: 999999999999,
    ...config,
  });

  if (!isLocal) {
    instance.interceptors.request.use(async (reqConfig) => {
      const method = (reqConfig.method || '').toLowerCase();
      if (['post', 'put', 'patch', 'delete'].includes(method)) {
        const csrfT = await getCsrfToken();
        if (csrfT) {
          reqConfig.headers['x-csrf-token'] = csrfT;
        }
      }
      return reqConfig;
    });
  }

  return instance;
};
