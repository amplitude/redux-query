import React, { Component } from 'react';
import { Provider } from 'react-redux';
import CodeMirror from 'react-codemirror';
import styled from 'styled-components';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/jsx/jsx';

import DevTools from '../containers/dev-tools';

const Container = styled.div`
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
`;

const Browser = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    width: 960px;
    height: 600px;
    overflow: hidden;
    margin: 12px;
    border: 1px solid rgb(204, 204, 204);
    border-radius: 3px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
`;

const BrowserToolbar = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 36px;
    padding: 0 6px;
    background-color: rgb(242, 242, 242);
    border-bottom: 1px solid rgb(204, 204, 204);
`;

const ToolbarButton = styled.button`
    background-color: ${(props) => props.isSelected ? 'white' : 'transparent'};
    color: ${(props) => props.isSelected ? '#222' : '#666'};
    border: 1px solid rgb(204, 204, 204);
    border-radius: 3px;
    margin-right: 4px;
    outline: 0;

    &:last-child {
        margin-right: 0;
    }
`;

const BrowserViewport = styled.div`
    display: flex;
    flex-grow: 1;
    overflow: auto;
`;

const DemoContainer = styled.div`
    display: flex;
    flex-grow: 1;
    overflow: auto;
    padding: 8px;
`;

const DevToolsContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-left: 1px solid rgb(204, 204, 204);
    flex-basis: 470px;
    flex-grow: 0;
    flex-shrink: 0;
    overflow: auto;
    font-size: 12px;
`;

const Code = styled.div`
    flex-grow: 1;
    display: flex;
    overflow: auto;

    > * {
        width: 100%;
    }
`;

class Playground extends Component {
    state = {
        devTool: 'redux',
    };

    constructor(props) {
        super(props);
        this._store = props.demo.createStore(DevTools.instrument());
    }

    renderCode() {
        const { props } = this;
        let code;

        try {
            code = atob(props.demo.code.slice('data:text/plain;base64,'.length));
        } catch (e) {
            console.warn(e);
        }

        if (code) {
            return (
                <Code>
                    <CodeMirror
                        ref={(ref) => {
                            if (ref) {
                                const cm = ref.getCodeMirror();
                                cm.setSize('100%', '100%');
                            }
                        }}
                        options={{
                            lineNumbers: true,
                            mode: 'jsx',
                            readOnly: true,
                        }}
                        value={code}
                    />
                </Code>
            );
        }
    }

    render() {
        const { props, state } = this;
        const Demo = props.demo.component;

        return (
            <Provider store={this._store}>
                <Container>
                    <Browser>
                        <BrowserViewport>
                            <DemoContainer>
                                <Demo />
                            </DemoContainer>
                            <DevToolsContainer>
                                <BrowserToolbar>
                                    <ToolbarButton
                                        isSelected={state.devTool === 'redux'}
                                        onClick={() => {
                                            this.setState({
                                                devTool: 'redux',
                                            });
                                        }}
                                    >
                                        Redux
                                    </ToolbarButton>
                                    <ToolbarButton
                                        isSelected={state.devTool === 'code'}
                                        onClick={() => {
                                            this.setState({
                                                devTool: 'code',
                                            });
                                        }}
                                    >
                                        Code
                                    </ToolbarButton>
                                </BrowserToolbar>
                                {state.devTool === 'redux' &&
                                    <DevTools />
                                }
                                {state.devTool === 'code' &&
                                    this.renderCode()
                                }
                            </DevToolsContainer>
                        </BrowserViewport>
                    </Browser>
                </Container>
            </Provider>
        );
    }
}

export default Playground;
