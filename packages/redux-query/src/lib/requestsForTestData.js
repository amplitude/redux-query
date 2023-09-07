// @flow
import type { ResponseBody, RequestBody } from '../types';
import type { HttpMethod } from '../constants/http-methods';
import { getCookie } from './cookie';

type Requests = {
  rest: {
    [url: string]: {
      method: string,
      body: ResponseBody,
      response: any,
    },
  },
  gql: {
    [query: string]: {
      response: any,
    },
  },
};

const createBaseRequests = () => {
  return {
    rest: {},
    gql: {},
  };
};

const cookieName = 'redux_query_store_requests_for_test_data';

export class RequestsForTestData {
  requests: Requests = createBaseRequests();

  constructor() {
    if (this.getShouldStoreRequests()) {
      window.getRequestsForTestData = this.getRequests;
      window.clearRequestsForTestData = this.clearRequests;
    }
  }

  getShouldStoreRequests = () => {
    return getCookie(cookieName) === 'true' ? true : false;
  };

  getRequests = () => {
    return this.requests;
  };

  clearRequests = () => {
    this.requests = createBaseRequests();
  };

  addRequest = (url: string, body: RequestBody, method: HttpMethod, response: any) => {
    if (this.getShouldStoreRequests()) {
      let query = null;
      let restUrl = url;
      if (body && body.hasOwnProperty('query')) {
        const bodyQuery = body.query;
        const firstNonQueryChar =
          bodyQuery.indexOf('(') !== -1 ? bodyQuery.indexOf('(') : bodyQuery.indexOf(' {');
        query = bodyQuery.slice(6, firstNonQueryChar); // 6 because 'query '
        this.requests.gql[query] = {
          response,
        };
      } else {
        restUrl = url.indexOf('?') !== -1 ? url.slice(0, url.indexOf('?')) : url;
        this.requests.rest[restUrl] = {
          method,
          body,
          response,
        };
      }
    }
  };
}
