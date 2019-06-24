---
id: use-mutation
title: useMutation
---

`useMutation` is a React hook provided by redux-query-react that can be used for easily making mutations from a React component.

## API

`useMutation` takes a single parameter – a callback function that itself returns a query config. If the callback function returns null, undefined, or an invalid query config, the mutation will be a no-op. You can pass arguments to the callback function in order to parameterize the mutation query config.

Like `useRequest`, `useMutation` returns a tuple-like array, where the first value in the tuple is an object representing the [query state](query-state) for the mutation. The second value in the tuple is a callback to actually trigger the mutation. Unlike `useRequest`, the mutation action is not dispatched automatically when the associated component mounts – the returned callback must be called. Also, mutations are never cancelled automatically when the component updates or unmounts.

## Example

```javascript
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useMutation } from 'redux-query-react';

const reactMutation = (commentId, reactionType) => ({
  url: `/api/comment/${commentId}/react`,
  body: {
    reactionType,
  },
  transform: responseBody => {
    const comment = responseBody.data.comment;

    return {
      commentsById: {
        [comment.id]: comment,
      },
    };
  },
  update: {
    commentsById: (oldValue, newValue) => {
      ...oldValue,
      ...newValue,
    }
  },
});

const reactions = [
  {
    type: 'like',
    text: '👍',
  },
  {
    type: 'love',
    text: '💖',
  },
  {
    type: 'laugh',
    text: '😂',
  },
];

const Comment = () => {
  const [{ isPending }, react] = reactionType =>
    useMutation(reactMutation(props.comment.id, reactionType));

  return (
    <div>
      <div>{props.comment.body}</div>
      {emojis.map(emoji => (
        <button key={emoji.type} onClick={() => react(emoji.type)} disabled={isPending}>
          {emoji.text}
        </button>
      ))}
    </div>
  );
};
```
