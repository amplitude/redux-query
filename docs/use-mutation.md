---
id: use-mutation
title: useMutation
---

`useMutation` is a React hook provided by redux-query-react that can be used for easily making mutations from a React component.

## API

`useMutation` takes a single parameter – a function that itself returns a query config. This function can accept arguments that can affect the resulting mutation query config.

Like `useRequest`, `useMutation` returns a tuple-like array, where the first value in the tuple is an object representing the [query state](query-state) for the mutation. The second value in the tuple is a callback to actually trigger the mutation. Any parameters passed to this callback will be passed along as parameters to the function that generates the query config. Unlike `useRequest`, the mutation action is not dispatched automatically when the associated component mounts – the returned callback must be called. Also, mutations are never cancelled automatically when the component updates or unmounts.

**Note**: If the parameter to `useMutation` is not memoized, then the callback returned in the tuple will also not be memoized.

## Example

```javascript
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useMutation } from 'redux-query-react';

const makeCommentReactMutation = (commentId, reactionType) => ({
  url: `/api/comment/${commentId}/react`,
  body: {
    reactionType,
  },
  transform: (responseBody) => {
    const comment = responseBody.data.comment;

    return {
      commentsById: {
        [comment.id]: comment,
      },
    };
  },
  update: {
    commentsById: (oldValue, newValue) => ({
      ...oldValue,
      ...newValue,
    }),
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
  const [{ isPending }, reactToComment] = useMutation((reactionType) =>
    makeCommentReactMutation(props.comment.id, reactionType),
  );

  return (
    <div>
      <div>{props.comment.body}</div>
      {emojis.map((emoji) => (
        <button key={emoji.type} onClick={() => reactToComment(emoji.type)} disabled={isPending}>
          {emoji.text}
        </button>
      ))}
    </div>
  );
};
```
