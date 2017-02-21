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
            return;
    }
};

const superagentNetworkAdapter = (url, method, body) => {
    const request = createRequest(url, method);

    if (!request) {
        console.error(`Unsupported HTTP method: ${method}`);
        return;
    }

    if (body) {
        request.send(body);
    }

    const execute = (cb) => request.end((err, response) => {
        const resOk = !!(response && response.ok);
        const resStatus = (response && response.status) || 0;
        const resBody = (response && response.body) || undefined;
        const resText = (response && response.text) || undefined;

        return cb(err, resOk, resStatus, resBody, resText);
    });

    const abort = () => request.abort();

    return { execute, abort };
};

export default superagentNetworkAdapter;
