import checkStatus from './internal/checkStatus';
import parseJson from './internal/parseJson';

const callAttachment = async (id, data, entity, field) => {
  const url = `/api/dataentities/${entity}/documents/${id}/${field}/attachments`;
  const headers = new Headers({
    Accept: 'application/vnd.vtex.ds.v10+json',
  });

  const config = {
    headers,
    body: data,
    method: 'POST',
  };

  return fetch(url, config)
    .then(checkStatus)
    .then(parseJson);
};

export default callAttachment;
