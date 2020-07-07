## 3.4.2

- Security fixes
- Package upgrades (rctbusk [#189](https://github.com/amplitude/redux-query/pull/189))
- Fix typescript typings (siegcollado [#188](https://github.com/amplitude/redux-query/pull/188))

## 3.4.1

- Correct docs of updateEntitites (jaschaephraim [#183](https://github.com/amplitude/redux-query/pull/183))
- Update typescript typings (siegcollado [#176](https://github.com/amplitude/redux-query/pull/176))
- Add reselect dependency improving cache, add getQueryDetails to query selectors (myztiq [#186](https://github.com/amplitude/redux-query/pull/186))

## 3.3.1

- Fix `finishedCallback` to not throw console warning (mili-confluent [#166](https://github.com/amplitude/redux-query/pull/166))
- Add useRequests typescript and fix other typescript typings (kamranayub [#165](https://github.com/amplitude/redux-query/pull/165))
- Fix Security vulnerbilities and update logs for 3.3.1 (rctbusk [#167](https://github.com/amplitude/redux-query/pull/167))

## 3.3.0

- New React hook - `useRequests` (rctbusk [#159](https://github.com/amplitude/redux-query/pull/159))

## 3.2.1

- Generic Entities Typing Fix (petejohanson [#155](https://github.com/amplitude/redux-query/pull/155))
- Misc Package updates for security

## 3.2.0

- Generic Entities Typing (petejohanson [#138](https://github.com/amplitude/redux-query/pull/138))
- Fix HttpMethods TypeScript Typings (karevn [#139](https://github.com/amplitude/redux-query/pull/139))

## 3.1.1

- Support typescript (karevn [#131](https://github.com/amplitude/redux-query/pull/131))
- Security vulnerability fixes [#132](https://github.com/amplitude/redux-query/pull/132), [#133](https://github.com/amplitude/redux-query/pull/133)

## 3.0.0

Please refer to the [v3 upgrade guide](https://amplitude.github.io/redux-query/docs/upgrade-guides/v2-to-v3) for instructions on how to upgrade from redux-query 2.x to 3.0. See [#129](https://github.com/amplitude/redux-query/pull/129) for the (unfortunately massive) PR.

- New React hooks – `useRequest` and `useMutation`
- Split project into separate packages – `redux-query`, `redux-query-react` and `redux-query-interface-superagent` – for better support for non-React apps and apps with custom network interfaces
- Flow types
- Support for react-redux v7.1.0 and new React Context API

### Other changes

- Revamped docs
- Removed the `redux-query/advanced` entrypoint
- Network interfaces must always be provided to the query middleware (no more default superagent network interface)
- The `update` query config field is no longer required
- The network handler instance is no longer stored in the query reducer state
- The queries reducer state no longer stores the query url
- connectRequest has been rewritten to use hooks internally
- connectRequest's `withRef` option has been renamed to `forwardRef`

## 2.3.1

- Support redux v4 (karevn [#103](https://github.com/amplitude/redux-query/pull/103))

## 2.3.0

- Add `duration` to `_SUCCESS` and `_FAILURE` redux actions (blazzy [#92](https://github.com/amplitude/redux-query/pull/92))

## 2.2.0

- Store the response headers in the queries state and add a selector (hobbeswalsh [#84](https://github.com/amplitude/redux-query/pull/84))

## 2.1.0

- Support React 16 (ryanashcraft [#88](https://github.com/amplitude/redux-query/pull/88))
- Switch to yarn (ryanashcraft [#88](https://github.com/amplitude/redux-query/pull/88))
- Change Prettier settings (ryanashcraft [#88](https://github.com/amplitude/redux-query/pull/88))

## 2.0.0

Refer to the [v2 transition guide](https://amplitude.github.io/redux-query/docs/upgrade-guides/v1-to-v2) for instructions on how to upgrade from redux-query 1.x to 2.x.

- Use the latest entities state when the network request finishes for mutations
- Replace `request` fields in queries reducer and relevant actions with `networkHandler`
- New, safer rollback behavior when mutations fail
- New `rollback` option in query configs to handle reverting optimistic updates
- New, optional reducer, `errorsReducer`, for tracking response bodies, text, and headers for failed queries
- Change `connectRequest` to work around a race condition resulting in invalid warnings
- Update to superagent 3.x
- Avoid creating new functions in connectRequest's render function (acontreras89 [#67](https://github.com/amplitude/redux-query/pull/67))
- Replace `removeEntity` and `removeEntities` actions with a more generic `updateEntities` action
- Remove `reconcileQueryKey` and change `getQueryKey` to only accept query config objects as a parameter
- Replace usage of deprecated `react-addons-shallow-compare`
- Renamed "network adapters" to "network interfaces"
- Some top-level exports have been removed or renamed (see v2 transition guide for more information)

## 1.5.0

- Use prop-types to avoid React 15.5.0 deprecation warnings (ryanashcraft)
- Transform `body` into query params for GET requests (acontreras89 [#57](https://github.com/amplitude/redux-query/pull/57))
- Fix error with React Native's Packager (jeanregisser [#58](https://github.com/amplitude/redux-query/pull/58))
- Use Prettier for automatic code formatting (ryanashcraft [#60](https://github.com/amplitude/redux-query/pull/60))
- New site (see https://amplitude.github.io/redux-query) with interactive demos (ryanashcraft [#60](https://github.com/amplitude/redux-query/pull/60))

## 1.4.0

- Move react from dependencies to devDependencies (jeanregisser [#56](https://github.com/amplitude/redux-query/pull/56))
- Fix regression from 1.3.0 with the `request` field in start actions (ryanashcraft [#54](https://github.com/amplitude/redux-query/pull/54))
- Add meta field to mutate actions (ryanashcraft [#54](https://github.com/amplitude/redux-query/pull/54))

## 1.3.0

- Support for custom network adapters with `redux-query/advanced` to enable usage without superagent and support other advanced use cases (iamlacroix [#23](https://github.com/amplitude/redux-query/pull/23))
- Support for PATCH verb (jnutter [#35](https://github.com/amplitude/redux-query/pull/35))
- Include response text and body in all Redux success and failure actions (ryanashcraft [#39](https://github.com/amplitude/redux-query/pull/39) and [#40](https://github.com/amplitude/redux-query/pull/40))
- Include response headers in resolved Promise values and all Redux success and failure actions (jnutter [#42](https://github.com/amplitude/redux-query/pull/42))
- Allow retries on successful requests (lozlow [#26](https://github.com/amplitude/redux-query/pull/26))

## 1.2.0

- CORS support (rogovdm [#27](https://github.com/amplitude/redux-query/pull/29))
- Switch to react-addons-shallow-compare for React Native compatibility (mmalfertheiner [#27](https://github.com/amplitude/redux-query/pull/27))
- Pass transformed and updated entities to the promise result for `mutateAsync` and `requestAsync` (CAPSLOCKUSER [#25](https://github.com/amplitude/redux-query/pull/25))
- Improve connectRequest's displayName
- Use the `queryKey` property from query configs in connectRequest
- Allow passing full query configs instead of the url and body to the query selectors

## 1.1.2

- Fix `connectRequest` not retrying failed/cancelled requests on update

## 1.1.1

- Use lodash.includes instead of native Array#includes

## 1.1.0

- Added support for multiple requests with `connectRequest` (MrNice [#8](https://github.com/amplitude/redux-query/pull/8))
- Added support for setting request headers (adamsanderson [#10](https://github.com/amplitude/redux-query/pull/10))
- Added ability to override HTTP method for mutations (tonovotny [#20](https://github.com/amplitude/redux-query/pull/20))
- Fixed request timeout HTTP status code (victorandree [#22](https://github.com/amplitude/redux-query/pull/22))
