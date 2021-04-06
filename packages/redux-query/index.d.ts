declare module 'redux-query' {
  import { Action, AnyAction, Middleware, Reducer } from 'redux';
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
  export interface Entities {
    [key: string]: any;
  }
  export type EntitiesState = Entities;

  export type KnownHttpMethods = 'GET' | 'HEAD' | 'PUT' | 'POST' | 'DELETE' | 'PATCH' | 'OPTIONS';
  export type HttpMethod = KnownHttpMethods | string;

  export const HttpMethod: { [k in KnownHttpMethods]: KnownHttpMethods };

  export type TransformStrategy<TEntities = Entities, TBody = ResponseBody> = (
    body: TBody,
    text: ResponseText,
  ) => Partial<TEntities>;
  export type UpdateStrategy<T> = (prevValue: T, newValue: T) => T;
  export type OptimisticUpdateStrategy<T> = (prevValue: T) => T;
  export type RollbackStrategy<T> = (initialValue: T, currentValue: T) => T;

  export type Update<TEntities = Entities> = {
    [K in keyof TEntities]?: UpdateStrategy<TEntities[K]>;
  };

  export type OptimisticUpdate<TEntities = Entities> = {
    [K in keyof TEntities]?: OptimisticUpdateStrategy<TEntities[K]>;
  };

  export type Rollback<TEntities = Entities> = {
    [K in keyof TEntities]?: RollbackStrategy<TEntities[K]>;
  };

  export interface WithTime {
    time: number;
  }

  export interface WithQueryKey {
    queryKey: QueryKey;
  }

  export interface WithUpdateEntities<TEntities = Entities> {
    update: Update<TEntities>;
  }

  export type RequestAsyncAction<TEntities = Entities> = Action<'@@query/REQUEST_ASYNC'> &
    QueryConfig<TEntities>;

  export interface QueryStartParams {
    body?: RequestBody;
    meta?: Meta;
    queryKey: QueryKey;
    url: Url;
  }
  export interface WithOptimisticEntities<TEntities = Entities> {
    optimisticEntities: TEntities;
  }
  export type MutateStartParams = QueryStartParams;
  export type RequestStartAction = Action<'@@query/REQUEST_START'> & QueryStartParams;
  export interface QueryResponse<TEntities = Entities> {
    body: RequestBody;
    duration: Duration;
    entities: TEntities;
    meta?: Meta;
    responseBody?: ResponseBody;
    responseHeaders?: ResponseHeaders;
    responseText?: ResponseText;
    queryKey: QueryKey;
    status: ResponseStatus;
    url: Url;
  }

  export type RequestSuccessAction<TEntities = Entities> = Action<'@@query/REQUEST_SUCCESS'> &
    QueryResponse<TEntities> &
    WithTime;
  export type RequestFailureAction<TEntities = Entities> = Action<'@@query/REQUEST_FAILURE'> &
    QueryResponse<TEntities> &
    WithTime;
  export type MutateAsyncAction<TEntities = Entities> = Action<'@@query/MUTATE_ASYNC'> &
    QueryConfig<TEntities>;
  export type MutateSuccessAction = Action<'@@query/MUTATE_SUCCESS'> & QueryResponse;
  export type UpdateEntitiesAction<TEntities = Entities> = Action<'@@query/UPDATE_ENTITIES'> &
    WithUpdateEntities<TEntities>;
  export type CancelQueryAction = Action<'@@query/CANCEL_QUERY'> & WithQueryKey;
  export type ReduxQueryAction<TEntities = Entities> =
    | RequestAsyncAction<TEntities>
    | MutateAsyncAction<TEntities>
    | UpdateEntitiesAction<TEntities>
    | CancelQueryAction;

  export const requestAsync: <T>(params: QueryConfig<T>) => RequestAsyncAction<T>;
  export const mutateAsync: <T>(params: QueryConfig<T>) => MutateAsyncAction<T>;
  export const cancelQuery: (queryKey: QueryKey) => CancelQueryAction;
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
    method: HttpMethod,
    networkOptions: NetworkOptions,
  ) => NetworkHandler;

  export interface QueryOptions {
    credentials?: CredentialOption;
    method?: HttpMethod;
    headers?: { [key: string]: string };
  }

  export type QueryDetails = {
    isFinished: boolean;
    isPending: boolean;
    status?: number;
    headers?: ResponseHeaders;
    lastUpdated?: number;
    queryCount: number;
  };

  export interface QueryConfig<TEntities = Entities> {
    body?: RequestBody;
    force?: boolean;
    meta?: Meta;
    options?: QueryOptions;
    queryKey?: QueryKey;
    transform?: TransformStrategy<TEntities>;
    update?: Update<TEntities>;
    optimisticUpdate?: OptimisticUpdate<TEntities>;
    retry?: boolean;
    rollback?: Rollback<TEntities>;
    unstable_preDispatchCallback?: () => void;
    url: Url;
  }

  export interface QueriesState {
    [key: string]: {
      headers?: ResponseHeaders | null;
      isFinished: boolean;
      isMutation: boolean;
      isPending: boolean;
      lastUpdated?: number;
      queryCount: number;
      status?: ResponseStatus;
      url: Url;
    };
  }

  export type QueriesSelector<TState = any> = (state: TState) => QueriesState;

  export type EntitiesSelector<TEntities = EntitiesState, TState = any> = (
    state: TState,
  ) => TEntities;

  export type QueryKeyBuilder<TEntities = Entities> = (
    queryConfig?: QueryConfig<TEntities>,
  ) => QueryKey;

  export interface QueryState {
    headers?: ResponseHeaders;
    isFinished: boolean;
    isPending: boolean;
    lastUpdated?: number;
    queryCount?: number;
    status?: ResponseStatus;
  }

  export interface ActionPromiseValue<TEntities = Entities> {
    body: ResponseBody;
    duration: Duration;
    entities?: TEntities;
    headers?: ResponseHeaders;
    status: ResponseStatus;
    text?: ResponseText;
    transformed?: TEntities;
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
  export type QueriesReducer<TEntities = EntitiesState> = Reducer<
    QueriesState,
    ReduxQueryAction<TEntities>
  >;
  export type EntitiesReducer<TEntities = EntitiesState> = Reducer<
    TEntities,
    ReduxQueryAction<TEntities>
  >;
  export type ErrorsReducer<TEntities = EntitiesState> = Reducer<
    ErrorsState,
    ReduxQueryAction<TEntities>
  >;
  export type QueryMiddlewareFactory = <TEntities = EntitiesState, TState = any>(
    networkInterface: NetworkInterface,
    queriesSelector: QueriesSelector<TState>,
    entitiesSelector: EntitiesSelector<TEntities, TState>,
    customConfig?: Config,
  ) => Middleware<ReduxQueryDispatch<TEntities>, any, ReduxQueryDispatch<TEntities>>;
  export const getQueryKey: QueryKeyBuilder;
  export const queriesReducer: QueriesReducer;
  export const entitiesReducer: EntitiesReducer;
  export const errorsReducer: ErrorsReducer;

  export const querySelectors: {
    getQueryDetails: <TEntities = Entities>(
      queriesState: QueriesState,
      queryConfig: QueryConfig<TEntities>,
    ) => QueryDetails;
    isFinished: <TEntities = Entities>(
      queriesState: QueriesState,
      queryConfig: QueryConfig<TEntities>,
    ) => boolean;
    isPending: <TEntities = Entities>(
      queriesState: QueriesState,
      queryConfig: QueryConfig<TEntities>,
    ) => boolean;
    status: <TEntities = Entities>(
      queriesState: QueriesState,
      queryConfig: QueryConfig<TEntities>,
    ) => ResponseStatus | undefined;
    headers: <TEntities = Entities>(
      queriesState: QueriesState,
      queryConfig: QueryConfig<TEntities>,
    ) => ResponseHeaders | undefined;
    lastUpdated: <TEntities = Entities>(
      queriesState: QueriesState,
      queryConfig: QueryConfig<TEntities>,
    ) => number | undefined;
    queryCount: <TEntities = Entities>(
      queriesState: QueriesState,
      queryConfig: QueryConfig<TEntities>,
    ) => number;
  };

  export const errorSelectors: {
    responseBody: <TEntities = Entities>(
      errorsState: ErrorsState,
      queryConfig: QueryConfig<TEntities>,
    ) => ResponseBody;
    responseText: <TEntities = Entities>(
      errorsState: ErrorsState,
      queryConfig: QueryConfig<TEntities>,
    ) => ResponseText;
    responseHeaders: <TEntities = Entities>(
      errorsState: ErrorsState,
      queryConfig: QueryConfig<TEntities>,
    ) => ResponseHeaders;
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
  export interface ReduxQueryDispatch<
    TEntities = Entities,
    A extends AnyAction = ReduxQueryAction<TEntities>
  > {
    <T extends ReduxQueryAction<TEntities>>(action: T): Promise<ActionPromiseValue<TEntities>>;
    <T extends A>(action: T): T;
  }
}
