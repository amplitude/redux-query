import prettier from 'prettier';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
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
    flex-shrink: 0;
    flex-grow: 0;
    background-color: whitesmoke;
    border-right: 1px solid #ccc;
    padding: 12px;
`;

const NavigationSection = styled.ul`
    list-style: none;
    margin: 0;
    padding: 8px 0;
`;

const NavigationItem = styled.li`
    display: flex;
    font-size: 14px;
`;

const NavigationLink = styled(NavLink)`
    flex-grow: 1;
    text-decoration: none;
    color: #666;
    padding: 8px 0;

    &:hover {
        text-decoration: underline;
    }

    &.${(props) => props.activeClassName} {
        color: #27d;
    }
`

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
    justify-content: space-between;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 30px;
    padding: 0 6px;
    background-color: rgb(242, 242, 242);
    border-bottom: 1px solid #ccc;
`;

const ToolbarSection = styled.div`
    display: flex;
    align-items: stretch;
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

const RunButton = styled.button`
    background-color: transparent;
    border: 0;
    outline: 0;
    font-size: 12px;
    cursor: pointer;

    &:hover:not([disabled]) {
        color: #222;
        background-color: #ddd;
    }
`;

const ResultContainer = styled.div`
    display: flex;
    flex-grow: 1;
    overflow: auto;
    font-family: reset;
    background-color: white;
    border-left: 1px solid #ccc;
`;

const Main = styled.div`
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

const ReduxLog = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;

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
    flex-shrink: 0;
`;

const parseCode = (input) => {
    try {
        const parsed = atob(input.slice('data:text/plain;base64,'.length));
        const prettified = prettier.format(parsed, {
            printWidth: 80,
            tabWidth: 2,
            bracketSpacing: true,
            jsxBracketSameLine: true,
        });

        return prettified;
    } catch (e) {
        console.warn('Unable to parse initial code', e);
    }

    return null;
};

class Playground extends Component {
    state = {
        clientCode: '',
        devTool: 'CLIENT_CODE',
        messages: [],
        pendingClientCode: '',
        pendingServerCode: '',
        serverCode: '',
        version: 0,
    };

    constructor(props) {
        super(props);

        if (props.demo) { 
            const clientCode = parseCode(props.demo.clientCode) || '';
            const serverCode = parseCode(props.demo.serverCode) || '';

            this.state = {
                ...this.state,
                clientCode,
                pendingClientCode: clientCode,
                pendingServerCode: serverCode,
                serverCode,
            };
        }
    }

    componentDidMount() {
        window.addEventListener('message', this.onMessage);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.onMessage);
    }

    onMessage = (e) => {
        try {
            const message = JSON.parse(e.data);
            if (message.type === 'dispatch') {
                this.setState((prevState) => ({
                    messages: [...prevState.messages, message],
                }));
            }
        } catch (e) {
            // Ignoring other messages
        }
    };

    run = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                clientCode: prevState.pendingClientCode,
                messages: [],
                serverCode: prevState.pendingServerCode,
                version: prevState.version + 1,
            };
        });
    };

    renderCode = (stateKey) => {
        const { state } = this;
        const code = state[stateKey];

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
                    onChange={(newValue) => {
                        this.setState({
                            [stateKey]: newValue,
                        });
                    }}
                    value={code}
                />
            </Code>
        );
    };

    render() {
        const { state } = this;

        return (
            <Container>
                <Navigation>
                    <ProjectTitle>
                        redux-query
                    </ProjectTitle>
                    <NavigationSection>
                        <NavigationItem>
                            <NavigationLink to="/hello-world" activeClassName="active">
                                Hello World
                            </NavigationLink>
                        </NavigationItem>
                        <NavigationItem>
                            <NavigationLink to="/echo" activeClassName="active">
                                Echo
                            </NavigationLink>
                        </NavigationItem>
                    </NavigationSection>
                </Navigation>
                <Main>
                    <DevToolsContainer>
                        <Toolbar>
                            <ToolbarSection>
                                <ToolbarButton
                                    isSelected={state.devTool === 'CLIENT_CODE'}
                                    onClick={() => {
                                        this.setState({
                                            devTool: 'CLIENT_CODE',
                                        });
                                    }}
                                >
                                    Client
                                </ToolbarButton>
                                <ToolbarButton
                                    isSelected={state.devTool === 'SERVER_CODE'}
                                    onClick={() => {
                                        this.setState({
                                            devTool: 'SERVER_CODE',
                                        });
                                    }}
                                >
                                    Server
                                </ToolbarButton>
                                <ToolbarButton
                                    isSelected={state.devTool === 'REDUX_LOG'}
                                    onClick={() => {
                                        this.setState({
                                            devTool: 'REDUX_LOG',
                                        });
                                    }}
                                >
                                    Redux Log
                                </ToolbarButton>
                            </ToolbarSection>
                            <ToolbarSection>
                                <RunButton
                                    onClick={this.run}
                                >
                                    Run
                                </RunButton>
                            </ToolbarSection>
                        </Toolbar>
                        {state.devTool === 'REDUX_LOG' &&
                            <ReduxLog>
                                {state.messages.reduce((accum, message, i, messages) => {
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
                                            <LogDivider
                                                key={`$divider-${i}`}
                                            />
                                        );
                                    }

                                    return accum;
                                }, [])}
                            </ReduxLog>
                        }
                        {state.devTool === 'CLIENT_CODE' &&
                            this.renderCode('pendingClientCode')
                        }
                        {state.devTool === 'SERVER_CODE' &&
                            this.renderCode('pendingServerCode')
                        }
                    </DevToolsContainer>
                    <ResultContainer>
                        <ResultFrame
                            key={`resultFrame-${state.version}`}
                            clientCode={state.clientCode}
                            serverCode={state.serverCode}
                        />
                    </ResultContainer>
                </Main>
            </Container>
        );
    }
}

export default Playground;
