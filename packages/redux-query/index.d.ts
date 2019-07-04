declare module 'redux-query' {
  import { Action, AnyAction, Middleware, Reducer, Store } from 'redux';
  export type CredentialOption = 'include' | 'same-origin' | 'omit';
  export type Url = string;
  export type RequestBody = any;
  export type RequestHeader = string;
  export interface RequestHeaders {
    [key: string]: RequestHeader;
  }
  export type MetaValue = string;
  export interface Meta {
    [key: string]: MetaValue;
  }
  export type QueryKey = string;
  export type ResponseBody = any;
  export type ResponseText = string;
  export type ResponseHeader = string;
  export interface ResponseHeaders {
    [key: string]: ResponseHeader;
  }
  export type ResponseStatus = number;
  export type Duration = number;
  export interface Entities {
    [key: string]: any;
  }
  export type EntitiesState = Entities;

  export enum HttpMethods {
    DELETE,
    GET,
    HEAD,
    POST,
    PUT,
    PATCH,
  }

  export type TransformStrategy = (
    body: ResponseBody,
    text: ResponseText,
  ) => { [key: string]: any };
  export type UpdateStrategy = (prevValue: any, newValue: any) => any;
  export type OptimisticUpdateStrategy = (prevValue: any) => any;
  export type RollbackStrategy = (initialValue: any, currentValue: any) => any;

  export interface Update {
    [key: string]: UpdateStrategy;
  }

  export interface OptimisticUpdate {
    [key: string]: OptimisticUpdateStrategy;
  }

  export interface Rollback {
    [key: string]: RollbackStrategy;
  }

  export interface WithTime {
    time: number;
  }

  export interface WithQueryKey {
    queryKey: QueryKey;
  }

  export interface WithUpdateEntities {
    update: Update;
  }

  export type RequestAsyncAction = Action<'@@query/REQUEST_ASYNC'> & QueryConfig;

  export interface QueryStartParams {
    body?: RequestBody;
    meta?: Meta;
    queryKey: QueryKey;
    url: Url;
  }
  export interface WithOptimisticEntities {
    optimisticEntities: Entities;
  }
  export type MutateStartParams = QueryStartParams;
  export type RequestStartAction = Action<'@@query/REQUEST_START'> & QueryStartParams;
  export interface QueryResponse {
    body: RequestBody;
    duration: Duration;
    entities: Entities;
    meta?: Meta;
    responseBody?: ResponseBody;
    responseHeaders?: ResponseHeaders;
    responseText?: ResponseText;
    queryKey: QueryKey;
    status: ResponseStatus;
    url: Url;
  }

  export type RequestSuccessAction = Action<'@@query/REQUEST_SUCCESS'> | QueryResponse | WithTime;
  export type RequestFailureAction = Action<'@@query/REQUEST_FAILURE'> | QueryResponse | WithTime;
  export type MutateAsyncAction = Action<'@@query/MUTATE_ASYNC'> & QueryConfig;
  export type MutateSuccessAction = Action<'@@query/MUTATE_SUCCESS'> & QueryResponse;
  export type UpdateEntitiesAction = Action<'@@query/UPDATE_ENTITIES'> & WithUpdateEntities;
  export type CancelQueryAction = Action<'@@query/CANCEL_QUERY'> & WithQueryKey;
  export type ReduxQueryAction =
    | RequestAsyncAction
    | MutateAsyncAction
    | UpdateEntitiesAction
    | CancelQueryAction;

  export const requestAsync: (params: QueryConfig) => RequestAsyncAction;
  export const mutateAsync: (params: QueryConfig) => MutateAsyncAction;
  export const cancelQuery: (queryKey: QueryKey) => CancelQueryAction;
  export const updateEntities: (update: Update) => UpdateEntitiesAction;

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

  export interface QueryOptions {
    credentials?: CredentialOption;
    method?: HttpMethods;
    headers?: { [key: string]: string };
  }

  export interface QueryConfig {
    body?: RequestBody;
    force?: boolean;
    meta?: Meta;
    options?: QueryOptions;
    queryKey?: QueryKey;
    transform?: TransformStrategy;
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

  export type EntitiesSelector = (state: any) => EntitiesState;

  export type QueryKeyBuilder = (queryConfig?: QueryConfig) => QueryKey | undefined;

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

  export interface ErrorsState {
    [key: string]: {
      responseBody?: ResponseBody;
      responseHeaders?: ResponseHeaders;
      responseText?: ResponseText;
    };
  }
  export interface Config {
    backoff: {
      maxAttempts: number;
      minDuration: number;
      maxDuration: number;
    };
    retryableStatusCodes: ResponseStatus[];
  }
  export type QueriesReducer = Reducer<QueriesState, ReduxQueryAction>;
  export type EntitiesReducer = Reducer<EntitiesState, ReduxQueryAction>;
  export type ErrorsReducer = Reducer<ErrorsState, ReduxQueryAction>;
  export type QueryMiddlewareFactory = (
    networkInterface: NetworkInterface,
    queriesSelector: QueriesSelector,
    entitiesSelector: EntitiesSelector,
    customConfig?: Config,
  ) => Middleware<ReduxQueryDispatch, any, ReduxQueryDispatch>;
  export const getQueryKey: QueryKeyBuilder;
  export const queriesReducer: QueriesReducer;
  export const entitiesReducer: EntitiesReducer;
  export const errorsReducer: ErrorsReducer;

  export const querySelectors: any;
  export const errorSelectors: any;
  export const actionTypes: any;

  export const queryMiddleware: QueryMiddlewareFactory;
  export interface ReduxQueryDispatch<A extends AnyAction = ReduxQueryAction> {
    <T extends ReduxQueryAction>(action: ReduxQueryAction): Promise<ActionPromiseValue>;
    <T extends A>(action: T): T;
  }
}
