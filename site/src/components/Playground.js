import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import styled from 'styled-components';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/jsx/jsx';

import CoreLayout from './CoreLayout';
import ReduxLog from './ReduxLog';
import ResultFrame from './ResultFrame';

import './codemirror-overrides.css';

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
    flex-grow: 1;
  }
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
  padding: 0 8px;
  outline: 0;
  font-size: 12px;
  cursor: pointer;
  color: ${props => props.isSelected ? '#222' : '#444'};

  &::after {
    visibility: ${props => props.isSelected ? 'visible' : 'hidden'};
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
  margin: 0;
  padding: 0 8px;
  font-size: 12px;
  cursor: pointer;
  color: ${props => props.highlight ? '#27d' : '#444'};

  &:hover:not([disabled]) {
    background-color: #ddd;
    color: ${props => props.highlight ? '#27d' : '#222'};
  }

  &::before {
    content: '▶ ';
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

const parseCode = input => {
    try {
        return atob(input.slice('data:text/plain;base64,'.length));
    } catch (e) {
        console.warn('Unable to parse initial code', e);
    }

    return null;
};

class Playground extends Component {
    state = {
        clientCode: '',
        devTool: 'CLIENT_CODE',
        isDirty: false,
        messages: [],
        pendingClientCode: '',
        pendingServerCode: null,
        serverCode: null,
        version: 0,
    };

    constructor(props) {
        super(props);

        if (props.demo) {
            const clientCode = parseCode(props.demo.clientCode) || '';
            const serverCode = props.demo.serverCode ? parseCode(props.demo.serverCode) : null;

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
        this.logEvent('view demo');
        window.addEventListener('message', this.onMessage);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.onMessage);
    }

    onMessage = e => {
        try {
            const message = JSON.parse(e.data);
            if (message.type === 'dispatch') {
                this.setState(prevState => ({
                    messages: [...prevState.messages, message],
                }));
            }
        } catch (e) {
            // Ignoring other messages
        }
    };

    run = () => {
        this.logEvent('run');
        this.setState(prevState => {
            return {
                ...prevState,
                clientCode: prevState.pendingClientCode,
                messages: [],
                serverCode: prevState.pendingServerCode,
                version: prevState.version + 1,
                isDirty: false,
            };
        });
    };

    logEvent = (name, eventProps) => {
        const { props } = this;

        window.amplitude.getInstance().logEvent(name, {
            ...eventProps,
            demo: props.name,
        });
    };

    renderCode = stateKey => {
        const { state } = this;
        const code = state[stateKey];

        return (
            <Code>
                <CodeMirror
                    ref={ref => {
                        if (ref) {
                            const cm = ref.getCodeMirror();
                            cm.setSize('100%', '100%');
                        }
                    }}
                    options={{
                        lineNumbers: true,
                        mode: 'jsx',
                    }}
                    onChange={newValue => {
                        this.setState({
                            [stateKey]: newValue,
                            isDirty: true,
                        });
                    }}
                    value={code}
                />
            </Code>
        );
    };

    render() {
        const { props, state } = this;

        return (
            <CoreLayout disableBodyScroll={true}>
                <DevToolsContainer>
                    <Toolbar>
                        <ToolbarSection>
                            <ToolbarButton
                                isSelected={state.devTool === 'CLIENT_CODE'}
                                onClick={() => {
                                    this.logEvent('change devtool', {
                                        devTool: 'client code',
                                    });
                                    this.setState({
                                        devTool: 'CLIENT_CODE',
                                    });
                                }}>
                                Client
                            </ToolbarButton>
                            {!!props.demo.serverCode &&
                                <ToolbarButton
                                    isSelected={state.devTool === 'SERVER_CODE'}
                                    onClick={() => {
                                        this.logEvent('change devtool', {
                                            devTool: 'server code',
                                        });
                                        this.setState({
                                            devTool: 'SERVER_CODE',
                                        });
                                    }}>
                                    Mock Server
                                </ToolbarButton>}
                            <ToolbarButton
                                isSelected={state.devTool === 'REDUX_LOG'}
                                onClick={() => {
                                    this.logEvent('change devtool', {
                                        devTool: 'redux log',
                                    });
                                    this.setState({
                                        devTool: 'REDUX_LOG',
                                    });
                                }}>
                                Redux Log
                            </ToolbarButton>
                        </ToolbarSection>
                        <ToolbarSection>
                            <RunButton onClick={this.run} highlight={state.isDirty}>
                                Run
                            </RunButton>
                        </ToolbarSection>
                    </Toolbar>
                    {state.devTool === 'REDUX_LOG' && <ReduxLog messages={state.messages} />}
                    {state.devTool === 'CLIENT_CODE' && this.renderCode('pendingClientCode')}
                    {state.devTool === 'SERVER_CODE' && this.renderCode('pendingServerCode')}
                </DevToolsContainer>
                <ResultContainer>
                    <ResultFrame
                        key={`resultFrame-${state.version}`}
                        clientCode={state.clientCode}
                        serverCode={state.serverCode}
                    />
                </ResultContainer>
            </CoreLayout>
        );
    }
}

export default Playground;
