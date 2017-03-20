import queryAdvanced from './query-advanced.js';
import superagentAdapter from '../adapters/superagent';

const queryMiddleware = queryAdvanced(superagentAdapter);

export default queryMiddleware;
