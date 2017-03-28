import React, { Component } from 'react';
import { Provider } from 'react-redux';
import CodeMirror from 'react-codemirror';
import styled from 'styled-components';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/jsx/jsx';

import ReduxDevTools from '../containers/dev-tools';

import './codemirror-overrides.css';

const Container = styled.div`
    display: flex;
    flex-grow: 1;
    height: 100vh;
    min-width: 960px;
    align-items: stretch;
    justify-content: center;
    overflow: hidden;
    background-color: #eee;
`;

const Navigation = styled.div`
    flex-basis: 200px;
    background-color: whitesmoke;
    border-right: 1px solid #ddd;
    padding: 12px;
`;

const ProjectTitle = styled.h1`
    color: #222;
    margin: 0;
    padding-bottom: 12px;
    border-bottom: 1px solid #ccc;
    font-size: 18px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 500;
`;

const Toolbar = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: center;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 30px;
    padding: 0 6px;
    background-color: rgb(242, 242, 242);
    border-bottom: 1px solid rgb(204, 204, 204);
`;

const ToolbarButton = styled.button`
    position: relative;
    background-color: transparent;
    border: 0;
    margin: 0 4px 0 0;
    outline: 0;
    font-size: 12px;
    cursor: pointer;

    &::after {
        visibility: ${(props) => props.isSelected ? 'visible' : 'hidden'};
        content: '';
        display: block;
        position: absolute;
        left: 0;
        bottom: -1px;
        width: 100%;
        height: 2px;
        background-color: #27d;
    }

    &:hover {
        color: #222;
        background-color: #ddd;
    }

    &:last-child {
        margin-right: 0;
    }
`;

const DemoContainer = styled.div`
    display: flex;
    flex-grow: 1;
    overflow: auto;
    font-family: reset;
    background-color: white;
    border-left: 1px solid #bbb;
`;

const Browser = styled.div`
    display: flex;
    flex-grow: 1;
    overflow: hidden;
    background-color: white;
`;

const DevToolsContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-basis: 450px;
    flex-grow: 0;
    flex-shrink: 0;
    overflow: auto;
    font-size: 12px;
`;

const Code = styled.div`
    flex-grow: 1;
    display: flex;
    overflow: auto;
    font-family: Menlo, monospace;

    > * {
        width: 100%;
    }
`;

const ReduxDevToolsContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    > * {
        flex-grow: 1;
    }
`;

class Playground extends Component {
    state = {
        devTool: 'code',
    };

    constructor(props) {
        super(props);
        this._store = props.demo.createStore(ReduxDevTools.instrument());
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
                    <Navigation>
                        <ProjectTitle>
                            redux-query
                        </ProjectTitle>
                    </Navigation>
                    <Browser>
                        <DevToolsContainer>
                            <Toolbar>
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
                                    Sources
                                </ToolbarButton>
                            </Toolbar>
                            {state.devTool === 'redux' &&
                                <ReduxDevToolsContainer>
                                    <ReduxDevTools />
                                </ReduxDevToolsContainer>
                            }
                            {state.devTool === 'code' &&
                                this.renderCode()
                            }
                        </DevToolsContainer>
                        <DemoContainer>
                            <Demo />
                        </DemoContainer>
                    </Browser>
                </Container>
            </Provider>
        );
    }
}

export default Playground;
