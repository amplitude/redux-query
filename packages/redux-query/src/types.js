// @flow

import type { HttpMethod } from './constants/http-methods';

type QueryOptions = {
  credentials?: 'include' | 'same-origin' | 'omit',
  method?: HttpMethod,
  headers?: { [key: string]: any },
};

export type QueryConfig = {|
  body?: any,
  force?: boolean,
  meta?: { [key: string]: any },
  options?: QueryOptions,
  queryKey?: string,
  transform?: (data: any) => { [key: string]: any },
  update?: { [key: string]: (prevVal: any, val: any) => any },
  optimisticUpdate?: { [key: string]: (prevVal: any) => any },
  retry?: boolean,
  rollback?: { [key: string]: (initialValue: any, currentValue: any) => any },
  unstable_preDispatchCallback?: () => void,
  url: string,
|};
