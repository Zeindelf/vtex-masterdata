import stringify from 'querystring/encode';

import checkStatus from './internal/checkStatus';
import parseJson from './internal/parseJson';

const call = async (method, id, data, entity, type, headers) => {
  const mountedUrl = `/api/dataentities/${entity || 'CL'}/${type || 'search'}/${id || ''}`;
  const url = method === 'GET' ? `${mountedUrl}?${stringify(data)}` : mountedUrl;
  const defaultHeaders = new Headers();

  Object.entries({
    Accept: 'application/vnd.vtex.ds.v10+json',
    'Content-Type': 'application/json; charset=utf-8',
    ...headers,
  }).map((header) => {
    const [key, val] = header;
    return defaultHeaders.append(key, val);
  });

  const config = {
    headers: defaultHeaders,
    body: method !== 'GET' ? JSON.stringify(data) : null,
    method,
  };

  return fetch(url, config)
    .then(checkStatus)
    .then(parseJson);
};

export default call;
