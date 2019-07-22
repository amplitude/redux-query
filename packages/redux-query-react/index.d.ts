declare module 'redux-query-react' {
  import React from 'react';
  import {
    ActionPromiseValue,
    QueriesState,
    QueryConfig,
    QueryState,
    QueriesSelector,
  } from 'redux-query';

  export type QueryConfigFactory = (...args: any[]) => QueryConfig;
  export type QueryConfigsFactory = (...args: any[]) => QueryConfig | QueryConfig[];

  export interface ConnectRequestOptions {
    forwardRef?: boolean;
    pure?: boolean;
  }
  export type ForceRequestCallback = () => Promise<ActionPromiseValue>;
  export interface WithForceRequest {
    forceRequest: ForceRequestCallback;
  }

  export type ConnectRequestWrapper<TProps extends WithForceRequest> = (
    WrappedComponent: React.ComponentType<TProps>,
  ) => React.ComponentType<Omit<TProps, 'forceRequest'>>;

  export type RequestConnector = <TProps extends WithForceRequest = WithForceRequest>(
    mapPropsToConfigs: QueryConfigsFactory,
    options?: ConnectRequestOptions,
  ) => ConnectRequestWrapper<TProps>;

  export interface ProviderProps {
    queriesSelector: QueriesSelector;
    children?: React.ReactNode;
  }

  export type ReduxQueryProvider = React.ComponentType<ProviderProps>;
  export type ActionPromise = Promise<ActionPromiseValue> | undefined;
  export type UseRequestHook = (queryConfig: QueryConfig) => [QueryState, ForceRequestCallback];
  export type MutationQueryConfigFactory = (...args: any) => QueryConfig;
  export type RunMutation = (...args: any) => Promise<ActionPromiseValue>;
  export type UseMutationHook = (
    createQueryConfig: MutationQueryConfigFactory,
  ) => [QueryState, RunMutation];

  export const connectRequest: RequestConnector;
  export const Provider: ReduxQueryProvider;
  export const useRequest: UseRequestHook;
  export const useMutation: UseMutationHook;
}
