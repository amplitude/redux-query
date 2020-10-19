import * as actionTypes from '../constants/action-types';

import {
  Duration,
  Entities,
  Meta,
  QueryConfig,
  QueryKey,
  RequestBody,
  ResponseBody,
  ResponseHeaders,
  ResponseText,
  Status,
  Update,
  Url,
} from '../types';

type RequestStartParams = {
  body: RequestBody;
  meta: Meta | null | undefined;
  queryKey: QueryKey;
  url: Url;
};

type RequestStartAction = RequestStartParams & {
  type: '@@query/REQUEST_START';
};

export const requestStart = ({
  body,
  meta,
  queryKey,
  url,
}: RequestStartParams): RequestStartAction => {
  return {
    type: actionTypes.REQUEST_START,
    url,
    body,
    meta,
    queryKey,
  };
};

type RequestSuccessParams = {
  body: RequestBody;
  duration: Duration;
  entities: Entities;
  meta: Meta | null | undefined;
  responseBody: ResponseBody | null | undefined;
  responseHeaders: ResponseHeaders | null | undefined;
  responseText: ResponseText | null | undefined;
  queryKey: QueryKey;
  status: Status;
  url: Url;
};

type RequestSuccessAction = RequestSuccessParams & {
  type: '@@query/REQUEST_SUCCESS';
  time: number;
};

export const requestSuccess = ({
  body,
  duration,
  entities,
  meta,
  queryKey,
  responseBody,
  responseHeaders,
  responseText,
  status,
  url,
}: RequestSuccessParams): RequestSuccessAction => {
  return {
    type: actionTypes.REQUEST_SUCCESS,
    url,
    body,
    duration,
    status,
    entities,
    responseBody,
    responseText,
    responseHeaders,
    meta,
    queryKey,
    time: Date.now(),
  };
};

type RequestFailureParams = {
  body: RequestBody;
  duration: Duration;
  meta: Meta | null | undefined;
  responseBody: ResponseBody | null | undefined;
  responseHeaders: ResponseHeaders | null | undefined;
  responseText: ResponseText | null | undefined;
  queryKey: QueryKey;
  status: Status;
  url: Url;
};

type RequestFailureAction = RequestFailureParams & {
  type: '@@query/REQUEST_FAILURE';
  time: number;
};

export const requestFailure = ({
  body,
  duration,
  meta,
  queryKey,
  responseBody,
  responseHeaders,
  responseText,
  status,
  url,
}: RequestFailureParams): RequestFailureAction => {
  return {
    type: actionTypes.REQUEST_FAILURE,
    url,
    body,
    duration,
    status,
    responseBody,
    responseText,
    responseHeaders,
    meta,
    queryKey,
    time: Date.now(),
  };
};

type MutateStartParams = {
  body: RequestBody;
  meta: Meta | null | undefined;
  optimisticEntities: Entities;
  queryKey: QueryKey;
  url: Url;
};

type MutateStartAction = MutateStartParams & {
  type: '@@query/MUTATE_START';
};

export const mutateStart = ({
  body,
  meta,
  optimisticEntities,
  queryKey,
  url,
}: MutateStartParams): MutateStartAction => {
  return {
    type: actionTypes.MUTATE_START,
    url,
    body,
    optimisticEntities,
    queryKey,
    meta,
  };
};

type MutateSuccessParams = {
  body: RequestBody;
  duration: Duration;
  entities: Entities;
  meta: Meta | null | undefined;
  responseBody: ResponseBody | null | undefined;
  responseHeaders: ResponseHeaders | null | undefined;
  responseText: ResponseText | null | undefined;
  queryKey: QueryKey;
  status: Status;
  url: Url;
};

type MutateSuccessAction = MutateSuccessParams & {
  type: '@@query/MUTATE_SUCCESS';
  time: number;
};

export const mutateSuccess = ({
  body,
  duration,
  entities,
  meta,
  queryKey,
  responseBody,
  responseHeaders,
  responseText,
  status,
  url,
}: MutateSuccessParams): MutateSuccessAction => {
  return {
    type: actionTypes.MUTATE_SUCCESS,
    url,
    body,
    duration,
    status,
    responseBody,
    responseText,
    responseHeaders,
    entities,
    queryKey,
    time: Date.now(),
    meta,
  };
};

type MutateFailureParams = {
  body: RequestBody;
  duration: Duration;
  meta: Meta | null | undefined;
  responseBody: ResponseBody | null | undefined;
  responseHeaders: ResponseHeaders | null | undefined;
  responseText: ResponseText | null | undefined;
  rolledBackEntities: Entities | null | undefined;
  queryKey: QueryKey;
  status: Status;
  url: Url;
};

type MutateFailureAction = MutateFailureParams & {
  type: '@@query/MUTATE_FAILURE';
  time: number;
};

export const mutateFailure = ({
  body,
  duration,
  meta,
  queryKey,
  responseBody,
  responseHeaders,
  responseText,
  rolledBackEntities,
  status,
  url,
}: MutateFailureParams): MutateFailureAction => {
  return {
    type: actionTypes.MUTATE_FAILURE,
    url,
    body,
    duration,
    status,
    responseBody,
    responseText,
    responseHeaders,
    rolledBackEntities,
    queryKey,
    time: Date.now(),
    meta,
  };
};

type RequestAsyncAction = QueryConfig & {
  type: '@@query/REQUEST_ASYNC';
};

export const requestAsync = ({
  body,
  force,
  meta,
  options,
  queryKey,
  retry,
  transform,
  update,
  url,

  /* eslint-disable-next-line camelcase */
  unstable_preDispatchCallback,
}: QueryConfig): RequestAsyncAction => {
  return {
    type: actionTypes.REQUEST_ASYNC,
    body,
    force,
    queryKey,
    meta,
    options,
    retry,
    transform,
    update,
    url,
    unstable_preDispatchCallback,
  };
};

type MutateAsyncAction = QueryConfig & {
  type: '@@query/MUTATE_ASYNC';
};

export const mutateAsync = ({
  body,
  meta,
  optimisticUpdate,
  options,
  queryKey,
  rollback,
  transform,
  update,
  url,
}: QueryConfig): MutateAsyncAction => {
  return {
    type: actionTypes.MUTATE_ASYNC,
    body,
    meta,
    optimisticUpdate,
    options,
    queryKey,
    rollback,
    transform,
    update,
    url,
  };
};

type CancelQueryAction = {
  type: '@@query/CANCEL_QUERY';
  queryKey: QueryKey | null | undefined;
};

export const cancelQuery = (queryKey: QueryKey): CancelQueryAction => {
  return {
    type: actionTypes.CANCEL_QUERY,
    queryKey,
  };
};

type UpdateEntitiesAction = {
  type: '@@query/UPDATE_ENTITIES';
  update: Update;
};

export const updateEntities = (update: Update): UpdateEntitiesAction => {
  return {
    type: actionTypes.UPDATE_ENTITIES,
    update,
  };
};

type ResetParams = {
  entities: Entities;
};

type ResetAction = {
  type: '@@query/RESET';
  entities: Entities;
};

export const reset = ({ entities }: ResetParams): ResetAction => {
  return {
    type: actionTypes.RESET,
    entities,
  };
};

export type PublicAction =
  | RequestAsyncAction
  | MutateAsyncAction
  | CancelQueryAction
  | UpdateEntitiesAction
  | ResetAction;

export type Action =
  | PublicAction
  | RequestStartAction
  | RequestSuccessAction
  | RequestFailureAction
  | MutateStartAction
  | MutateSuccessAction
  | MutateFailureAction;
