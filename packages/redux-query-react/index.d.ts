import React from 'react';
import { QueryConfig, QueryState, ActionPromiseValue } from 'redux-query';

declare module 'redux-query-react' {
  export type MapPropsToConfigs<T> = (props: T) => QueryConfig | QueryConfig[];

  export interface ConnectRequestOptions {
    forwardRef?: boolean;
    pure?: boolean;
  }

  export interface WithForceRequest {
    forceRequest: () => void;
  }

  export interface WithChildren {
    children?: React.ReactNode;
  }

  export type QueriesState = {
    [key: string]: QueryState;
  };

  export type QueriesSelector = <TState>(state: TState, ...any) => QueriesState;

  type ConnectRequestWrapper<TProps> = (
    WrappedComponent: React.ComponentType<TProps>,
  ) => React.ComponentType<Omit<TProps, 'forceRequest'>>;

  export type RequestConnector = <TProps extends {} = {}>(
    mapPropsToConfigs: MapPropsToConfigs<TProps>,
    options?: ConnectRequestOptions,
  ) => ConnectRequestWrapper<TProps>;

  export interface ProviderProps extends WithChildren {
    queriesSelector: QueriesSelector;
  }

  export type ReduxQueryProvider = React.ComponentType<ProviderProps>;
  export type ActionPromise = Promise<ActionPromiseValue> | undefined;
  export type UseRequestHook = (queryConfig: QueryConfig) => [QueryState, () => ActionPromise];
  export type QueryConfigFactory = (...any) => QueryConfig;
  export type UseMutationHook = (
    createQueryConfig: QueryConfigFactory,
  ) => [QueryState, ActionPromise];

  export const connectRequest: RequestConnector;
  export const Provider: ReduxQueryProvider;
  export const useRequest: UseRequestHook;
  export const useMutationHook: UseMutationHook;
}
