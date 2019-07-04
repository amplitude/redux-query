declare module 'redux-query-react' {
  import React from 'react';
  import { ActionPromiseValue, QueriesState, QueryConfig, QueryState } from 'redux-query';

  export type QueryConfigFactory = (...args: any[]) => QueryConfig;
  export type QueryConfigsFactory = (...args: any[]) => QueryConfig | QueryConfig[];

  export interface ConnectRequestOptions {
    forwardRef?: boolean;
    pure?: boolean;
  }
  export type ForceRequestCallback = () => void;
  export interface WithForceRequest {
    forceRequest: ForceRequestCallback;
  }

  export interface WithChildren {
    children?: React.ReactNode;
  }

  export type QueriesSelector = (state: any) => QueriesState;

  export type ConnectRequestWrapper<TProps extends WithForceRequest> = (
    WrappedComponent: React.ComponentType<TProps>,
  ) => React.ComponentType<Omit<TProps, 'forceRequest'>>;

  export type RequestConnector = <TProps extends WithForceRequest = WithForceRequest>(
    mapPropsToConfigs: QueryConfigsFactory,
    options?: ConnectRequestOptions,
  ) => ConnectRequestWrapper<TProps>;

  export interface ProviderProps extends WithChildren {
    queriesSelector: QueriesSelector;
  }

  export type ReduxQueryProvider = React.ComponentType<ProviderProps>;
  export type ActionPromise = Promise<ActionPromiseValue> | undefined;
  export type UseRequestHook = (queryConfig: QueryConfig) => [QueryState, () => ActionPromise];

  export type UseMutationHook = (
    createQueryConfig: QueryConfigFactory,
  ) => [QueryState, ForceRequestCallback];

  export const connectRequest: RequestConnector;
  export const Provider: ReduxQueryProvider;
  export const useRequest: UseRequestHook;
  export const useMutationHook: UseMutationHook;
}
