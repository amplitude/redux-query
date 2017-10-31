# Issues

Please use [GitHub Issues](https://github.com/amplitude/redux-query/issues) to file bug reports, request new features, and ask questions.

# Pull Requests

Please submit an issue or a small proof-of-concept before spending a large amount of time making a pull request. We don't want you to waste time working on something that won't be merged.

Please follow these rules for all code changes:

- Use [yarn](https://yarnpkg.com/) to install and commit lock file changes.
- When making feature improvements, please provide new tests.
- Code coverage for the project should stay above 90%.
- Please make sure to run `yarn run lint` to run eslint and format the code with prettier.
- Please test the changes with the redux-query site project. To do that, run `yarn run build:umd` from the root directory and `yarn run start` from the site directory. All examples should behave consistently with https://amplitude.github.io/redux-query/.
- Update the README and examples if adding new features or API changes.
- Separate commits into distinct changes with clear messages.
