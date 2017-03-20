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
