import { HttpMethod } from './constants/http-methods';
import { PublicAction } from './actions';
import { State as QueriesState } from './reducers/queries';
import { State as EntitiesState } from './reducers/entities';

type CredentialOption = 'include' | 'same-origin' | 'omit';

type QueryOptions = {
  credentials?: CredentialOption;
  method?: HttpMethod;
  headers?: {
    [key: string]: any;
  };
};

export type QueryConfig = {
  body?: RequestBody;
  force?: boolean;
  meta?: Meta;
  options?: QueryOptions;
  queryKey?: QueryKey;
  transform?: Transform;
  update?: Update;
  optimisticUpdate?: OptimisticUpdate;
  retry?: boolean;
  rollback?: {
    [key: string]: (initialValue: any, currentValue: any) => any;
  };
  unstable_preDispatchCallback?: () => void;
  url: Url;
};

export type QueryDetails = {
  isFinished: boolean;
  isPending: boolean;
  status?: number;
  headers:
    | {
        [key: string]: any;
      }
    | null
    | undefined;
  lastUpdated?: number;
  queryCount: number;
};

export type Url = string;

export type RequestBody = any;

export type RequestHeaders = {
  [key: string]: any;
};

export type Meta = {
  [key: string]: any;
};

export type QueryKey = string;

export type ResponseBody = any;

export type ResponseText = string;

export type ResponseHeaders = {
  [key: string]: any;
};

export type Status = number;

export type Duration = number;

export type Entities = {
  [key: string]: any;
};

export type Transform = (
  body: ResponseBody | null | undefined,
  text: ResponseText | null | undefined,
) => {
  [key: string]: any;
};

export type Update = {
  [key: string]: (prevValue: any, newValue: any) => any;
};

export type OptimisticUpdate = {
  [key: string]: (prevValue: any) => any;
};

export type Rollback = {
  [key: string]: (initialValue: any, currentValue: any) => any;
};

export type NetworkHandler = {
  abort: () => void;
  execute: (
    callback: (
      error: any,
      status: Status,
      responseBody: ResponseBody | null | undefined,
      responseText: ResponseText | null | undefined,
      responseHeaders: ResponseHeaders | null | undefined,
    ) => void,
  ) => void;
};

export type NetworkOptions = {
  body: RequestBody | null | undefined;
  headers: RequestHeaders | null | undefined;
  credentials: CredentialOption | null | undefined;
};

export type NetworkInterface = (
  url: Url,
  method: HttpMethod,
  networkOptions: NetworkOptions,
) => NetworkHandler;

export type QueriesSelector = (state: any) => QueriesState;

export type EntitiesSelector = (state: any) => EntitiesState;

export type QueryKeyGetter = (
  queryConfig: QueryConfig | null | undefined,
) => QueryKey | null | undefined;

export type ActionPromiseValue = {
  body: ResponseBody;
  duration: Duration;
  entities?: Entities;
  headers: ResponseHeaders | null | undefined;
  status: Status;
  text: ResponseText | null | undefined;
  transformed?: Entities;
};

export type Action = PublicAction;
