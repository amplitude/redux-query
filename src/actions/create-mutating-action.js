import { mutateAsync } from '../actions'

const createMutatingAction = (mapArgsToDeps) => (args) => (dispatch) => {
    const deps = mapArgsToDeps(args);
    dispatch(mutateAsync(deps.url, deps.schema));
};

export default createMutatingAction;
