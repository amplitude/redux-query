import identity from 'lodash/identity';
import { mutateAsync } from '../actions'

const createMutatingAction = (mapArgsToUrl, mapArgsToTransform) => (args) => (dispatch) => {
    const url = mapArgsToUrl(args);
    const transform = mapArgsToTransform ? mapArgsToTransform(args) : identity;
    dispatch(mutateAsync(url, transform));
};

export default createMutatingAction;
