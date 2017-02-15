import queryAdvanced from './query-advanced.js';
import superagentAdapter from '../adapters/superagent';

const queryMiddleware = (queriesSelector, entitiesSelector, config) =>
  queryAdvanced(queriesSelector, entitiesSelector, superagentAdapter, config);

export default queryMiddleware;
