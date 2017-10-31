import { Middleware, Reducer } from 'redux';
import { ComponentClass, ComponentType } from 'react';

// http://ideasintosoftware.com/typescript-advanced-tricks/
type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = { [P in Diff<keyof T, K>]: T[P] };

export enum Credentials {
  Omit = 'omit',
  Include = 'include',
}

export interface RequestConfig {
  /** The URL for the HTTP request. */
  url: string;

  /** An object where keys are entity IDs and values are "update functions" */
  update: { [key: string]: (prevValue: any, transformedValue: any) => any };

  /**
   * The request body. For GETs, this object is stringified and appended
   * to the URL as query params.
   */
  body?: any;

  /**
   * The identifier used to identify the query metadata in the queries
   * reducer. If unprovided, the url and body fields are serialized to
   * generate the query key.
   */
  queryKey?: string;

  /**
   * Options for the request. Set options.method to change the HTTP method,
   * options.headers to set any headers and options.credentials = 'include'
   * for CORS.
   */
  options?: {
    method?: string;
    headers?: any;
    credentials?: Credentials;
    [others: string]: any;
  };

  /**
   * A function that transforms the response data to an entities object
   * where keys are entity IDs and values are entity data. Can be used to
   * normalize data.
   */
  transform?: (
    responseJson: any,
    responseText: string,
  ) => { [key: string]: any };

  /**
   * A flag to indicate that the request should be performed even if a
   * previous query with the same query key succeeded.
   */
  force?: boolean;

  /**
   * Various metadata for the query. Can be used to update other reducers
   * when queries succeed or fail.
   */
  meta?: any;
}

export type OptimisticUpdate = { [key: string]: (prevValue: any) => any };

export interface MutateConfig extends RequestConfig {
  /**
   * An object where keys are entity IDs and values are "optimisticUpdate
   * functions". Used to update entities immediately when the mutation
   * starts.
   */
  optimisticUpdate?: OptimisticUpdate;

  /**
   * An object where keys are entity IDs and values are "rollback functions".
   * Used to reverse the effects of optimisticUpdate when the mutation
   * fails. If not provided, the entity will simply be reverted to its value
   * before the optimisticUpdate was performed.
   */
  rollback?: { [key: string]: (initialValue: any, currentValue: any) => any };
}

export enum ActionType {
  RequestAsync = '@@query/REQUEST_ASYNC',
  RequestStart = '@@query/REQUEST_START',
  RequestSuccess = '@@query/REQUEST_SUCCESS',
  RequestFailure = '@@query/REQUEST_FAILURE',
  CancelQuery = '@@query/CANCEL_QUERY',
  MutateAsync = '@@query/MUTATE_ASYNC',
  MutateStart = '@@query/MUTATE_START',
  MutateSuccess = '@@query/MUTATE_SUCCESS',
  MutateFailure = '@@query/MUTATE_FAILURE',
  Reset = '@@query/RESET',
  UpdateEntities = '@@query/UPDATE_ENTITIES',
}

export enum HttpMethod {
  Delete = 'DELETE',
  Get = 'GET',
  Head = 'HEAD',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
}

export namespace httpMethods {
  export const DELETE: HttpMethod.Delete;
  export const GET: HttpMethod.Get;
  export const HEAD: HttpMethod.Head;
  export const POST: HttpMethod.Post;
  export const PUT: HttpMethod.Put;
  export const PATCH: HttpMethod.Patch;
}

export namespace actionTypes {
  export const REQUEST_ASYNC: ActionType.RequestAsync;
  export const REQUEST_START: ActionType.RequestStart;
  export const REQUEST_SUCCESS: ActionType.RequestSuccess;
  export const REQUEST_FAILURE: ActionType.RequestFailure;
  export const CANCEL_QUERY: ActionType.CancelQuery;
  export const MUTATE_ASYNC: ActionType.MutateAsync;
  export const MUTATE_START: ActionType.MutateStart;
  export const MUTATE_SUCCESS: ActionType.MutateSuccess;
  export const MUTATE_FAILURE: ActionType.MutateFailure;
  export const RESET: ActionType.Reset;
  export const UPDATE_ENTITIES: ActionType.UpdateEntities;
}

export interface Selector<V = any> {
  (state: any, config: Partial<RequestConfig>): V | undefined;
}

declare namespace errorSelectors {
  /** Parsed response body (if query failed) */
  export const responseBody: Selector<any>;

  /** Unparsed response body string (if query failed) */
  export const responseText: Selector<string>;

  /** Response headers (if query failed) */
  export const responseHeaders: Selector<any>;
}

declare namespace querySelectors {
  /** Returns true if the query was resolved or cancelled */
  export const isFinished: Selector<boolean>;

  /** Returns true if the query is in-flight – not resolved and not cancelled */
  export const isPending: Selector<boolean>;

  /** Response HTTP status code */
  export const status: Selector<number>;

  /** Time at which the query was resolved */
  export const lastUpdated: Selector<number>;

  /** Number of times a query was started with the same query key */
  export const queryCount: Selector<number>;
}

export const getQueryKey: (args: Partial<RequestConfig>) => string;

export const queriesReducer: Reducer<any>;
export const entitiesReducer: Reducer<any>;
export const errorsReducer: Reducer<any>;

export interface Action<T> {
  type: T;
}

// Action Types

export interface RequestAsync
  extends RequestConfig,
    Action<ActionType.RequestAsync> {}

export interface MutateAsync
  extends MutateConfig,
    Action<ActionType.MutateAsync> {}

export interface CancelQuery extends Action<ActionType.CancelQuery> {
  queryKey: string;
}

export interface UpdateEntities extends Action<ActionType.UpdateEntities> {
  update: OptimisticUpdate;
}

/**
 * Similarly to how mutations are triggered by dispatching mutateAsync
 * actions, you can trigger requests by dispatching requestAsync actions
 * with a request query config.
 *
 * You can also Promise-chain on dispatched requestAsync actions, but a
 * Promise will only be returned if redux-query determines it will make a
 * network request. For example, if the query config does not have force
 * set to true and a previous request with the same query key previously
 * succeeded, then a Promise will not be returned. So be sure to always
 * check that the returned value from a dispatched requestAsync is a Promise
 * before interacting with it.
 */
export const requestAsync: (config: RequestConfig) => RequestAsync;

/**
 * Dispatch mutateAsync Redux actions to trigger mutations. mutateAsync
 * takes a mutation query config as its only argument.
 *
 * When dispatching a mutateAsync action, you can Promise-chain on the
 * returned value from dispatch.
 */
export const mutateAsync: (config: MutateConfig) => MutateAsync;

export const cancelQuery: (queryKey: string) => CancelQuery;
export const updateEntities: (update: OptimisticUpdate) => UpdateEntities;

export interface NetworkConfig {
  body?: any;
  headers?: any;
  credentials?: Credentials;
}

export interface NetworkHandlerCallback {
  (
    err: any,
    resStatus: number,
    resBody: any,
    resText: string,
    resHeaders: any,
  ): void;
}

export interface NetworkHandler {
  execute: (callback: NetworkHandlerCallback) => void;
  abort: () => void;
}

export interface NetworkInterface {
  (url: string, method: HttpMethod, config: NetworkConfig): NetworkHandler;
}

export interface MiddlewareConfig {
  backoff: {
    maxAttempts: number;
    minDuration: number;
    maxDuration: number;
  };

  retryableStatusCodes: number[];
}

/**
 * queryMiddleware requires two arguments: a selector (or function) that
 * returns entities state, and a function for the queries state.
 */
export interface QueryMiddleware {
  (
    queriesSelector: any,
    entitiesSelector: any,
    config?: MiddlewareConfig,
  ): Middleware;
}

export const queryMiddlewareAdvanced: (
  networkInterface: NetworkInterface,
) => QueryMiddleware;

export interface ConnectRequestOptions {
  pure?: boolean;
  withRef?: boolean;
}

export type MapPropsToConfigParam<P> = (
  props: P,
) => RequestConfig & { url?: string };

export interface ForceRequestProp {
  forceRequest: () => void;
}

export interface ComponentDecorator {
  <P extends ForceRequestProp>(component: ComponentType<P>): ComponentClass<
    Omit<P, keyof ForceRequestProp>
  >;
}

export interface ConnectRequest {
  <P = {}>(mapPropsToConfig: MapPropsToConfigParam<P>): ComponentDecorator;
}

export const connectRequest: ConnectRequest;
