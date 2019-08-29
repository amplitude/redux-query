declare module 'redux-query-react' {
  import React from 'react';
  import {
    ActionPromiseValue,
    Entities,
    QueriesState,
    QueryConfig,
    QueryState,
    QueriesSelector,
  } from 'redux-query';

  export type QueryConfigFactory<TEntities> = (...args: any[]) => QueryConfig<TEntities>;
  export type QueryConfigsFactory<TEntities> = (...args: any[]) => QueryConfig<TEntities> | QueryConfig<TEntities>[];

  export interface ConnectRequestOptions {
    forwardRef?: boolean;
    pure?: boolean;
  }
  export type ForceRequestCallback<TEntities> = () => Promise<ActionPromiseValue<TEntities>>;
  export interface WithForceRequest<TEntities> {
    forceRequest: ForceRequestCallback<TEntities>;
  }

  export type ConnectRequestWrapper<TProps extends WithForceRequest<any>> = (
    WrappedComponent: React.ComponentType<TProps>,
  ) => React.ComponentType<Omit<TProps, 'forceRequest'>>;

  export type RequestConnector = <TProps extends WithForceRequest<TEntities> = WithForceRequest<TEntities>, TEntities = Entities>(
    mapPropsToConfigs: QueryConfigsFactory<TEntities>,
    options?: ConnectRequestOptions,
  ) => ConnectRequestWrapper<TProps, TEntities>;

  export interface ProviderProps {
    queriesSelector: QueriesSelector;
    children?: React.ReactNode;
  }

  export type ReduxQueryProvider = React.ComponentType<ProviderProps>;
  export type ActionPromise<TEntities> = Promise<ActionPromiseValue<TEntities>> | undefined;
  export type UseRequestHook = <TEntities>(queryConfig: QueryConfig<TEntities>) => [QueryState, ForceRequestCallback<TEntities>];
  export type MutationQueryConfigFactory = <TEntities>(...args: any) => QueryConfig<TEntities>;
  export type RunMutation = <TEntities>(...args: any) => Promise<ActionPromiseValue<TEntities>>;
  export type UseMutationHook = <TEntities>(
    createQueryConfig: MutationQueryConfigFactory<TEntities>,
  ) => [QueryState, RunMutation<TEntities>];

  export const connectRequest: RequestConnector;
  export const Provider: ReduxQueryProvider;
  export const useRequest: UseRequestHook;
  export const useMutation: UseMutationHook;
}
