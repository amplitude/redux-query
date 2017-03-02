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
