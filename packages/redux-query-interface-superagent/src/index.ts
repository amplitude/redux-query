import superagent from 'superagent';
import { HttpMethod } from 'redux-query';

import { NetworkInterface } from 'redux-query';

const createRequest = (url, method, body) => {
  switch (method) {
    case HttpMethod.HEAD:
      return superagent.head(url, body);
    case HttpMethod.GET:
      return superagent.get(url, body);
    case HttpMethod.POST:
      return superagent.post(url, body);
    case HttpMethod.PUT:
      return superagent.put(url, body);
    case HttpMethod.PATCH:
      return superagent.patch(url, body);
    case HttpMethod.DELETE:
      return superagent.delete(url, body);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
};

const superagentNetworkInterface: NetworkInterface = (
  url,
  method,
  { body, headers, credentials } = {},
) => {
  const request = createRequest(url, method, body);

  if (headers) {
    request.set(headers);
  }

  if (credentials === 'include') {
    request.withCredentials();
  }

  const execute = (cb) =>
    request.end((err, response) => {
      const resStatus = (response && response.status) || 0;
      const resBody = (response && response.body) || undefined;
      const resText = (response && response.text) || undefined;
      const resHeaders = (response && response.header) || undefined;

      cb(err, resStatus, resBody, resText, resHeaders);
    });

  const abort = () => request.abort();

  return {
    abort,
    execute,
  };
};

export default superagentNetworkInterface;
