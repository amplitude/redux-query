import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { connectRequest } from 'redux-query';

const getTodoList = () => ({
    url: '/api/todos',
    transform: (data = []) => {
        return {
            todos: data.map((todo) => todo.id),
            todosById: data.reduce((accum, todo) => ({
                ...accum,
                [todo.id]: todo,
            }), {}),
        };
    },
    update: {
        todos: (prev, next) => next,
        todosById: (prev, next) => ({ ...prev, ...next }),
    },
});

const TodoItem = ({ todo }) => (
    <li>{todo.title}</li>
);

const TodoList = ({ todos }) => (
    <ol>
        {todos.map((todo, i) => (
            <TodoItem key={i} todo={todo} />
        ))}
    </ol>
);

const mapStateToProps = () => ({
    todos: [
        {
            title: 'Feed cat',
        },
    ],
});

const TodoListContainer = compose(
    connect(mapStateToProps),
    connectRequest(() => getTodoList())
)(TodoList);

class App extends Component {
    render() {
        return (
            <div>
                <h1>Todo List</h1>
                <TodoListContainer />
            </div>
        );
    }
}

export default App;
