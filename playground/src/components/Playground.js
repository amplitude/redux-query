import prettier from 'prettier';
import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import Inspector from 'react-inspector';
import styled from 'styled-components';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/jsx/jsx';

import ResultFrame from './ResultFrame';

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
    border-right: 1px solid #ccc;
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
    border-bottom: 1px solid #ccc;
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
    border-left: 1px solid #ccc;
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
    flex-basis: 50%;
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

    > li {
        padding: 4px 8px 2px;
    }
`;

const LogDivider = styled.hr`
    height: 1px;
    background-color: #ddd;
    border: 0;
    margin: 6px 0 4px 0;
    padding: 0 !important;
`;

class Playground extends Component {
    state = {
        code: '',
        devTool: 'code',
        messages: [],
    };

    constructor(props) {
        super(props);
        let code = null;

        try {
            code = atob(props.demo.code.slice('data:text/plain;base64,'.length));
            code = prettier.format(code, {
                printWidth: 80,
                tabWidth: 2,
                bracketSpacing: true,
                jsxBracketSameLine: true,
            });
        } catch (e) {
            console.warn(e);
        }

        this.state = {
            ...this.state,
            code: code || '',
        };
    }

    componentDidMount() {
        window.addEventListener('message', this.onMessage);
    }

    onMessage = (e) => {
        const message = JSON.parse(e.data);
        this.setState((prevState) => ({
            messages: [...prevState.messages, message],
        }));
    };

    onCodeChange = (newValue) => {
        this.setState({
            code: newValue,
        });
    };

    renderCode() {
        const { state } = this;

        if (state.code) {
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
                        }}
                        onChange={this.onCodeChange}
                        value={state.code}
                    />
                </Code>
            );
        }
    }

    render() {
        const { state } = this;

        return (
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
                                isSelected={state.devTool === 'code'}
                                onClick={() => {
                                    this.setState({
                                        devTool: 'code',
                                    });
                                }}
                            >
                                Client Source
                            </ToolbarButton>
                            <ToolbarButton
                                isSelected={state.devTool === 'redux'}
                                onClick={() => {
                                    this.setState({
                                        devTool: 'redux',
                                    });
                                }}
                            >
                                Redux Log
                            </ToolbarButton>
                        </Toolbar>
                        {state.devTool === 'redux' &&
                            <ReduxDevToolsContainer>
                                {state.messages.filter((message) => message.type === 'dispatch')
                                    .reduce((accum, message, i, messages) => {
                                        accum.push(
                                            <Inspector
                                                key={`$prevState-${i}`}
                                                showNonenumerable={true}
                                                name="prev state"
                                                data={message.prevState}
                                                expandLevel={1}
                                            />
                                        );

                                        accum.push(
                                            <Inspector
                                                key={`$action-${i}`}
                                                showNonenumerable={true}
                                                name={`action (${message.action.type})`}
                                                data={message.action}
                                                expandLevel={1}
                                            />
                                        );

                                        accum.push(
                                            <Inspector
                                                key={`$nextState-${i}`}
                                                showNonenumerable={true}
                                                name={"next state"}
                                                data={message.nextState}
                                                expandLevel={1}
                                            />
                                        );

                                        if (i < messages.length - 1) {
                                            accum.push(
                                                <LogDivider />
                                            );
                                        }

                                        return accum;
                                    }, [])
                                }
                            </ReduxDevToolsContainer>
                        }
                        {state.devTool === 'code' &&
                            this.renderCode()
                        }
                    </DevToolsContainer>
                    <DemoContainer>
                        <ResultFrame
                            code={state.code}
                        />
                    </DemoContainer>
                </Browser>
            </Container>
        );
    }
}

export default Playground;
