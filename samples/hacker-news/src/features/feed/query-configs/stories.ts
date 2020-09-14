export const topStoriesRequest = () => {
  return {
    url: `https://hacker-news.firebaseio.com/v0/topstories.json`,
    transform: (body: any) => ({
      // The server responds with an array of IDs
      topStoryIds: body,
    }),
    update: {
      topStoryIds: (_prev: any, next: any) => {
        // Discard previous `response` value (we don't need it anymore).
        return next;
      },
    },
  };
};

export const itemRequest = (itemId: any) => {
  return {
    url: `https://hacker-news.firebaseio.com/v0/item/${itemId}.json`,
    transform: (body: any) => ({
      // The server responds with the metadata for that item
      itemsById: {
        [itemId]: body,
      },
    }),
    update: {
      itemsById: (prev: any, next: any) => {
        return {
          ...prev,
          ...next,
        };
      },
    },
  };
};
