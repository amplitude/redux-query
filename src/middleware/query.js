import queryAdvanced from './query-advanced.js';
import superagentInterface from '../network-interfaces/superagent';

const queryMiddleware = queryAdvanced(superagentInterface);

export default queryMiddleware;
