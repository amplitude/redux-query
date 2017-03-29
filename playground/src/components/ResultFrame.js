import { transform } from 'babel-standalone';
import React, { Component } from 'react';
import styled from 'styled-components';

const Frame = styled.iframe`
  border: 0;
  flex-grow: 1;
`;

class ResultFrame extends Component {
  _iframeRef = null;

  componentDidMount() {
    this.update();
  }

  componentDidUpdate(prevProps) {
    const { props } = this;

    if (
      prevProps.clientCode !== props.clientCode ||
      prevProps.serverCode !== props.serverCode
    ) {
      this.update();
    }
  }

  update() {
    const { props } = this;
    const transformed = transform(props.clientCode, {
      presets: ['es2015', 'stage-2', 'react'],
      plugins: [
        [
          'transform-es2015-modules-umd',
          {
            globals: {
              react: 'React',
              redux: 'Redux',
              'react-redux': 'React-Redux',
              'redux-query': 'ReduxQuery',
            },
          },
        ],
      ],
      moduleId: 'Demo',
    });
    const transformedServer = transform(props.serverCode, {
      presets: ['es2015', 'stage-2'],
      plugins: ['transform-es2015-modules-umd'],
      moduleId: 'Server',
    });

    const srcs = [
      'https://unpkg.com/react@15/dist/react.min.js',
      'https://unpkg.com/react-dom@15/dist/react-dom.min.js',
      'https://unpkg.com/redux@3.6.0/dist/redux.min.js',
      'https://unpkg.com/react-redux@5.0.3/dist/react-redux.min.js',
      'https://unpkg.com/redux-query@1.3.0/dist/umd/redux-query/advanced.js',
    ];

    const contentWindow = this._iframeRef.contentWindow;
    contentWindow.document.open();
    contentWindow.document.write('<!doctype html>');
    contentWindow.document.write('<html lang="en">');
    contentWindow.document.write('<head><meta charset="utf-8"></head>');
    contentWindow.document.write('<body>');
    srcs.forEach(src => {
      contentWindow.document.write(`<script src="${src}"></script>`);
    });
    contentWindow.document.write(
      `<script type="text/javascript">
        ${transformedServer.code}
      </script>`
    );
    contentWindow.document.write(
      `<script type="text/javascript">
        var mockAdapter = function(url, method, config) {
        var aborted = false;

        var execute = function(callback) {
            setTimeout(function() {
              window.Server.default(url, method, config, function(status, response, headers) {
                if (aborted) {
                  return;
                }

                if (typeof response === 'object') {
                  callback(null, status, response, JSON.stringify(response), headers);
                } else {
                  let body = null;

                  try {
                      body = JSON.parse(response);
                  } catch (e) {
                      // Ignoring non-JSON response
                  }

                  callback(null, status, body, String(response), headers);
                }
              });
            }, 0);
          };

          var abort = function() {
            aborted = true;
          };

          return {
            abort: abort,
            execute: execute
          };
        };

        ReduxQuery.queryMiddleware = ReduxQuery.queryMiddlewareAdvanced(mockAdapter);
      </script>`
    );
    contentWindow.document.write(
      `<script type="text/javascript">
        var postMessageMiddleware = function(store) {
          return function(next) {
            return function(action) {
              var prevState = store.getState();
              var result = next(action);
              var nextState = store.getState();
              parent.postMessage(JSON.stringify({
                type: 'dispatch',
                action: action,
                prevState: prevState,
                nextState: nextState
              }), '*');

              return result;
            };
          };
        };
        var applyMiddleware = Redux.applyMiddleware;
        Redux.applyMiddleware = function() {
          var modifiedMiddleware = Array.prototype.slice.call(arguments).concat([postMessageMiddleware]);
          return applyMiddleware.apply(applyMiddleware, modifiedMiddleware);
        };
      </script>`
    );
    contentWindow.document.write(
      `<script type="text/javascript">
        ${transformed.code}
      </script>`
    );
    contentWindow.document.write(`<div id="app"></div>`);
    contentWindow.document.write(
      `<script type="text/javascript">
        ReactDOM.render(React.createElement(window.Demo.default), document.getElementById('app'));
      </script>`
    );
    contentWindow.document.write('</body>');
    contentWindow.document.write('</html>');
    contentWindow.document.close();
  }

  setIframeRef = ref => {
    this._iframeRef = ref;
  };

  render() {
    return <Frame innerRef={this.setIframeRef} />;
  }
}

export default ResultFrame;
