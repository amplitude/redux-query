# redux-query

[![Travis](https://img.shields.io/travis/amplitude/redux-query.svg?style=flat-square)](https://travis-ci.org/amplitude/redux-query)
[![npm](https://img.shields.io/npm/v/redux-query.svg?style=flat-square)](https://www.npmjs.com/package/redux-query)
[![Codecov](https://img.shields.io/codecov/c/github/amplitude/redux-query.svg?style=flat-square)](https://codecov.io/gh/amplitude/redux-query)

Redux-query places several constraints in order to bring a consistent, declarative mechanisms for fetching, storing,
and updating remote data:

- All request metadata is stored in a single place in the Redux store.
- All remote resource data (aka "entities") managed by redux-query is located in a single place in the Redux store.
- Data should be normalized before being stored.
- Data must be namespaced before being stored. Queries that involve data in the same namespace should be not be made
simultaneously.
- Only the transformed, normalized data is retained (not the raw response data).
- There is no differentiation between creations, updates, and deletions. There are only "requests" for reading and
"mutations" for destructive actions.

As different endpoints can have subtle differences in their responses, redux-query does __not__ place constraints or
make assumptions about the shape of the response data, except that it is parseable JSON. This places the responsibility
on the client to handle how data is transformed and reconciled with previously-stored data.

### Requests

The recommended way to trigger a request is to use the [connectRequest](src/components/connect-request.js) React
component class wrapper. This wrapper will leverage the React lifecycle methods to trigger new requests when the
component mounts and updates. It will also cancel in-flight requests when the component unmounts.

Example usage:

    import { connectRequest } from 'redux-query';

    class Funnels extends Component {
        ...
    }

    const FunnelsContainer = connectRequest((props) => ({
        url: '/config/funnels',
        transform: normalizeFunnelsResponse,
        update: {
            funnels: (prevFunnels, funnels) => funnels,
            funnelsById: (prevFunnelsById, funnelsById) => ({ ...prevFunnelsById, ...funnelsById }),
        },
    }))(Funnels);

### Mutations

Mutations can be triggered by dispatching a `mutateAsync` action. For example:

    import { mutateAsync } from 'redux-query';

    export const removeFunnel = (id) => mutateAsync({
        url: '/config/funnels/remove',
        body: { id },
        transform: normalizeFunnelsResponse,
        update: {
            funnels: (prevFunnels, funnels) => funnels,
            funnelsById: (prevFunnelsById, funnelsById) => ({ ...prevFunnelsById, ...funnelsById }),
        },
    });

Mutation actions can be dispatched by other async actions using [redux-thunk](https://github.com/gaearon/redux-thunk).
This allows you to query the redux state to compose the body for the mutation request.

### Required setup

1. Add one entities and one queries reducer to the Redux store.
2. Add the queryMiddleware (which requires two arguments – one selector for the entities reducer state, and the other
for the queries reducer state).

The queryMiddleware is responsible for intercepting `REQUEST_ASYNC` and `MUTATE_ASYNC` actions, performing the queries,
and dispatching other actions that can alter the queries and entities reducer states.
