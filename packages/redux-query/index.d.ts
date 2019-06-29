declare module 'redux-query' {
  export type CredentialOption = 'include' | 'same-origin' | 'omit';
  export type Url = string;
  export type RequestBody = any;
  export type RequestHeader = string;
  export type RequestHeaders = { [key: string]: RequestHeader };
  export type MetaValue = string;
  export type Meta = { [key: string]: MetaValue };
  export type QueryKey = string;
  export type ResponseBody = any;
  export type ResponseText = string;
  export type ResponseHeader = string;
  export type ResponseHeaders = { [key: string]: ResponseHeader };
  export type ResponseStatus = number;

  export type Duration = number;

  export type Entities = { [key: string]: any };

  export type Transform = (body: ResponseBody, text: ResponseText) => { [key: string]: any };

  export type Update = { [key: string]: (prevValue: any, newValue: any) => any };

  export type OptimisticUpdate = { [key: string]: (prevValue: any) => any };

  export type Rollback = { [key: string]: (initialValue: any, currentValue: any) => any };

  export enum HttpMethods {
    DELETE,
    GET,
    HEAD,
    POST,
    PUT,
    PATCH,
  }

  export interface NetworkHandler {
    abort: () => void;
    execute: (
      callback: (
        error: any,
        status: ResponseStatus,
        responseBody?: ResponseBody,
        responseText?: ResponseText,
        responseHeaders?: ResponseHeaders,
      ) => void,
    ) => void;
  }

  export interface NetworkOptions {
    body?: RequestBody;
    headers?: RequestHeaders;
    credentials?: CredentialOption;
  }

  export type NetworkInterface = (
    url: Url,
    method: HttpMethods,
    networkOptions: NetworkOptions,
  ) => NetworkHandler;

  export type QueryOptions = {
    credentials?: CredentialOption;
    method?: HttpMethods;
    headers?: { [key: string]: string };
  };

  export interface QueryConfig {
    body?: RequestBody;
    force?: boolean;
    meta?: Meta;
    options?: QueryOptions;
    queryKey?: QueryKey;
    transform?: Transform;
    update?: Update;
    optimisticUpdate?: OptimisticUpdate;
    retry?: boolean;
    rollback?: { [key: string]: (initialValue: any, currentValue: any) => any };
    unstable_preDispatchCallback?: () => void;
    url: Url;
  }

  export interface QueriesState {
    [key: string]: {
      headers?: ResponseHeaders;
      isFinished: boolean;
      isMutation: boolean;
      isPending: boolean;
      lastUpdated?: number;
      queryCount: number;
      status?: ResponseStatus;
      url: Url;
    };
  }

  export type QueriesSelector = (state: any) => QueriesState;

  export interface EntitiesState {
    [key: string]: any;
  }

  export type EntitiesSelector = (state: any) => EntitiesState;

  export type QueryKeyGetter = (queryConfig?: QueryConfig) => QueryKey | undefined;

  export interface QueryState {
    headers?: ResponseHeaders;
    isFinished: boolean;
    isPending: boolean;
    lastUpdated?: number;
    queryCount?: number;
    status?: ResponseStatus;
  }

  export interface ActionPromiseValue {
    body: ResponseBody;
    duration: Duration;
    entities?: Entities;
    headers?: ResponseHeaders;
    status: ResponseStatus;
    text?: ResponseText;
    transformed?: Entities;
  }
}
