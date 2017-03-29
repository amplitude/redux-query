export const SELECT_REDDIT = 'SELECT_REDDIT';

export const selectReddit = reddit => {
  return {
    type: SELECT_REDDIT,
    reddit,
  };
};
