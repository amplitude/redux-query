import superagent from 'superagent';
import * as httpMethods from '../constants/http-methods';

const createRequest = (url, method) => {
    switch (method) {
        case httpMethods.GET:
            return superagent.get(url);
        case httpMethods.POST:
            return superagent.post(url);
        case httpMethods.PUT:
            return superagent.put(url);
        case httpMethods.DELETE:
            return superagent.del(url);
        default:
            throw new Error(`Unsupported HTTP method: ${method}`);
    }
};

const superagentNetworkAdapter = (url, method, { body, headers }) => {
    const request = createRequest(url, method);

    if (body) {
        request.send(body);
    }

    if (headers) {
        request.set(headers);
    }

    const execute = (cb) => request.end((err, response) => {
        const resStatus = (response && response.status) || 0;
        const resBody = (response && response.body) || undefined;
        const resText = (response && response.text) || undefined;

        return cb(err, resStatus, resBody, resText);
    });

    const abort = () => request.abort();

    return { execute, abort };
};

export default superagentNetworkAdapter;
