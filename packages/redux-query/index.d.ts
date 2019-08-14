declare module 'redux-query' {
  import { Action, AnyAction, Middleware, Reducer, Store } from 'redux';
  export type CredentialOption = 'include' | 'same-origin' | 'omit';
  export type Url = string;
  export type RequestBody = any;
  export type RequestHeader = string;
  export interface RequestHeaders {
    [key: string]: RequestHeader;
  }
  export type MetaValue = any;
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

  export type KnownHttpMethods = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH' | 'OPTIONS';
  export type HttpMethods = KnownHttpMethods | string;

  export const httpMethods: { [k in KnownHttpMethods]: KnownHttpMethods };

  export type TransformStrategy<Entities, Body = ResponseBody> = (
    body: Body,
    text: ResponseText,
  ) => Partial<Entities>;
  export type UpdateStrategy<T> = (prevValue: T, newValue: T) => T;
  export type OptimisticUpdateStrategy<T> = (prevValue: T) => T;
  export type RollbackStrategy<T> = (initialValue: T, currentValue: T) => T;

  export type Update<Entities> = {
    [K in keyof Entities]?: UpdateStrategy<Entities[K]>;
  }

  export type OptimisticUpdate<Entities> = {
    [K in keyof Entities]?: OptimisticUpdateStrategy<Entities[K]>;
  }

  export type Rollback<Entities> = {
    [K in keyof Entities]?: RollbackStrategy<Entities[K]>;
  }

  export interface WithTime {
    time: number;
  }

  export interface WithQueryKey {
    queryKey: QueryKey;
  }

  export interface WithUpdateEntities<Entities> {
    update: Update<Entities>;
  }

  export type RequestAsyncAction<Entities> = Action<'@@query/REQUEST_ASYNC'> & QueryConfig<Entities>;

  export interface QueryStartParams {
    body?: RequestBody;
    meta?: Meta;
    queryKey: QueryKey;
    url: Url;
  }
  export interface WithOptimisticEntities<Entities> {
    optimisticEntities: Entities;
  }
  export type MutateStartParams = QueryStartParams;
  export type RequestStartAction = Action<'@@query/REQUEST_START'> & QueryStartParams;
  export interface QueryResponse<Entities> {
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

  export type RequestSuccessAction<Entities> = Action<'@@query/REQUEST_SUCCESS'> | QueryResponse<Entities> | WithTime;
  export type RequestFailureAction<Entities> = Action<'@@query/REQUEST_FAILURE'> | QueryResponse<Entities> | WithTime;
  export type MutateAsyncAction<Entities> = Action<'@@query/MUTATE_ASYNC'> & QueryConfig<Entities>;
  export type MutateSuccessAction = Action<'@@query/MUTATE_SUCCESS'> & QueryResponse;
  export type UpdateEntitiesAction<Entities> = Action<'@@query/UPDATE_ENTITIES'> & WithUpdateEntities<Entities>;
  export type CancelQueryAction = Action<'@@query/CANCEL_QUERY'> & WithQueryKey;
  export type ReduxQueryAction<Entities> =
    | RequestAsyncAction<Entities>
    | MutateAsyncAction<Entities>
    | UpdateEntitiesAction<Entities>
    | CancelQueryAction;

  export const requestAsync: <T>(params: QueryConfig<T>) => RequestAsyncAction<T>;
  export const mutateAsync: <T>(params: QueryConfig<T>) => MutateAsyncAction<T>;
  export const cancelQuery: <T>(queryKey: QueryKey) => CancelQueryAction;
  export const updateEntities: <T>(update: Update<T>) => UpdateEntitiesAction<T>;

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

  export interface QueryConfig<Entities> {
    body?: RequestBody;
    force?: boolean;
    meta?: Meta;
    options?: QueryOptions;
    queryKey?: QueryKey;
    transform?: TransformStrategy<Entities>;
    update?: Update<Entities>;
    optimisticUpdate?: OptimisticUpdate<Entities>;
    retry?: boolean;
    rollback?: Rollback<Entities>;
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

  export type EntitiesSelector<EntitiesState, State = any> = (state: State) => EntitiesState;

  export type QueryKeyBuilder<Entities> = (queryConfig?: QueryConfig<Entities>) => QueryKey | undefined;

  export interface QueryState {
    headers?: ResponseHeaders;
    isFinished: boolean;
    isPending: boolean;
    lastUpdated?: number;
    queryCount?: number;
    status?: ResponseStatus;
  }

  export interface ActionPromiseValue<Entities> {
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
  export type EntitiesReducer<EntitiesState> = Reducer<EntitiesState, ReduxQueryAction>;
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

  export const querySelectors: {
    isFinished: (queriesState: QueriesState, queryConfig: QueryConfig<any>) => boolean;
    isPending: (queriesState: QueriesState, queryConfig: QueryConfig<any>) => boolean;
    status: (queriesState: QueriesState, queryConfig: QueryConfig<any>) => ResponseStatus | undefined;
    headers: (queriesState: QueriesState, queryConfig: QueryConfig<any>) => ResponseHeaders | undefined;
    lastUpdated: (queriesState: QueriesState, queryConfig: QueryConfig<any>) => number | undefined;
    queryCount: (queriesState: QueriesState, queryConfig: QueryConfig<any>) => number;
  };

  export const errorSelectors: {
    responseBody: (errorsState: ErrorsState, queryConfig: QueryConfig<any>) => ResponseBody;
    responseText: (errorsState: ErrorsState, queryConfig: QueryConfig<any>) => ResponseText;
    responseHeaders: (errorsState: ErrorsState, queryConfig: QueryConfig<any>) => ResponseHeaders;
  };
  export const actionTypes: {
    REQUEST_ASYNC: string;
    REQUEST_START: string;
    REQUEST_SUCCESS: string;
    REQUEST_FAILURE: string;
    CANCEL_QUERY: string;
    MUTATE_ASYNC: string;
    MUTATE_START: string;
    MUTATE_SUCCESS: string;
    MUTATE_FAILURE: string;
    RESET: string;
    UPDATE_ENTITIES: string;
  };

  export const queryMiddleware: QueryMiddlewareFactory;
  export interface ReduxQueryDispatch<A extends AnyAction = ReduxQueryAction> {
    <T extends ReduxQueryAction>(action: ReduxQueryAction): Promise<ActionPromiseValue>;
    <T extends A>(action: T): T;
  }
}
