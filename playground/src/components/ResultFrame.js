import { transform } from 'babel-standalone';
import React, { Component } from 'react';
import styled from 'styled-components';

const Frame = styled.iframe`
    border: 0;
`;

class ResultFrame extends Component {
    _iframeRef = null;

    componentDidMount() {
        this.update();
    }

    componentDidUpdate(prevProps) {
        const { props } = this;

        if (prevProps.code !== props.code) {
            this.update();
        }
    }

    update() {
        const { props } = this;
        const transformed = transform(props.code, {
            presets: ['es2015', 'stage-2', 'react'],
            plugins: [
                [
                    'transform-es2015-modules-umd',
                    {
                        globals: {
                            'react': 'React',
                            'redux': 'Redux',
                            'react-redux': 'React-Redux',
                            'redux-query': 'ReduxQuery',
                        },
                    },
                ],
            ],
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
        contentWindow.document.write('<body>');
        srcs.forEach((src) => {
            contentWindow.document.write(`<script src="${src}"></script>`);
        });
        contentWindow.document.write(`<script type="text/javascript">
            var mockAdapter = function() {
                var execute = function(cb) {
                    var response = { message: 'World' };
                    setTimeout(function() {
                        cb(null, 200, response, JSON.stringify(response));
                    }, 1000);
                };
                var abort = function() {};

                return {
                    abort: abort,
                    execute: execute
                };
            };

            ReduxQuery.queryMiddleware = ReduxQuery.queryMiddlewareAdvanced(mockAdapter);
        </script>`);
        contentWindow.document.write(`<script type="text/javascript">
            var createStore = Redux.createStore;
            Redux.createStore = function() {
                var store = createStore.apply(createStore, arguments);
                var dispatch = store.dispatch;
                store.dispatch = function(action) {
                    var prevState = store.getState();
                    var result = dispatch.call(store, action);
                    var nextState = store.getState();
                    parent.postMessage(JSON.stringify({
                        type: 'dispatch',
                        action: action,
                        prevState: prevState,
                        nextState: nextState
                    }), '*');

                    return result;
                };

                return store;
            };
        </script>`);
        contentWindow.document.write(`<script type="text/javascript">${transformed.code}</script>`);
        contentWindow.document.write(`<div id="app"></div>`);
        contentWindow.document.write(`<script type="text/javascript">
            ReactDOM.render(React.createElement(window.unknown.default), document.getElementById('app'));
        </script>`);
        contentWindow.document.write('</body>');
        contentWindow.document.close();
    }

    setIframeRef = (ref) => {
        this._iframeRef = ref;
    };

    render() {
        return (
            <Frame
                innerRef={this.setIframeRef}
            />
        );
    }
}

export default ResultFrame;
