import superagent from 'superagent';
import * as httpMethods from '../constants/http-methods';

const createRequest = (url, method, body) => {
  switch (method) {
    case httpMethods.HEAD:
      return superagent.head(url, body);
    case httpMethods.GET:
      return superagent.get(url, body);
    case httpMethods.POST:
      return superagent.post(url, body);
    case httpMethods.PUT:
      return superagent.put(url, body);
    case httpMethods.PATCH:
      return superagent.patch(url, body);
    case httpMethods.DELETE:
      return superagent.delete(url, body);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
};

const superagentNetworkInterface = (url, method, { body, headers, credentials } = {}) => {
  const request = createRequest(url, method, body);

  if (headers) {
    request.set(headers);
  }

  if (credentials === 'include') {
    request.withCredentials();
  }

  const execute = cb =>
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
    instance: request,
  };
};

export default superagentNetworkInterface;
