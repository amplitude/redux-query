declare module 'redux-query-react' {
  import React from 'react';
  import {
    ActionPromiseValue,
    QueriesState,
    QueryConfig,
    QueryState,
    QueriesSelector,
  } from 'redux-query';

  export type QueryConfigFactory<T> = (...args: any[]) => QueryConfig<T>;
  export type QueryConfigsFactory<T> = (...args: any[]) => QueryConfig<T> | QueryConfig<T>[];

  export interface ConnectRequestOptions {
    forwardRef?: boolean;
    pure?: boolean;
  }
  export type ForceRequestCallback<T> = () => Promise<ActionPromiseValue<T>>;
  export interface WithForceRequest<T> {
    forceRequest: ForceRequestCallback<T>;
  }

  export type ConnectRequestWrapper<TProps extends WithForceRequest> = (
    WrappedComponent: React.ComponentType<TProps>,
  ) => React.ComponentType<Omit<TProps, 'forceRequest'>>;

  export type RequestConnector = <TState, TProps extends WithForceRequest = WithForceRequest>(
    mapPropsToConfigs: QueryConfigsFactory<TState>,
    options?: ConnectRequestOptions,
  ) => ConnectRequestWrapper<TProps>;

  export interface ProviderProps {
    queriesSelector: QueriesSelector;
    children?: React.ReactNode;
  }

  export type ReduxQueryProvider = React.ComponentType<ProviderProps>;
  export type ActionPromise<T> = Promise<ActionPromiseValue<T>> | undefined;
  export type UseRequestHook<T> = (queryConfig: QueryConfig<T>) => [QueryState, ForceRequestCallback<T>];
  export type MutationQueryConfigFactory<T> = (...args: any) => QueryConfig<T>;
  export type RunMutation<T> = (...args: any) => Promise<ActionPromiseValue<T>>;
  export type UseMutationHook<T> = (
    createQueryConfig: MutationQueryConfigFactory<T>,
  ) => [QueryState, RunMutation<T>];

  export const connectRequest: RequestConnector;
  export const Provider: ReduxQueryProvider;
  export const useRequest: UseRequestHook;
  export const useMutation: UseMutationHook;
}
