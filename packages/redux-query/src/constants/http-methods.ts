import { $Keys, $Keys } from 'utility-types';

const HttpMethods = {
  DELETE: 'DELETE',
  GET: 'GET',
  HEAD: 'HEAD',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
};

export type HttpMethod = $Keys<typeof HttpMethods>;

export default HttpMethods;
