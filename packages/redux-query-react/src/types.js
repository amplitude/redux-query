// @flow

export type QueryState = {|
  headers: ?{ [key: string]: any },
  isFinished: boolean,
  isPending: boolean,
  lastUpdated: ?number,
  queryCount: number,
  status: ?number,
|};
