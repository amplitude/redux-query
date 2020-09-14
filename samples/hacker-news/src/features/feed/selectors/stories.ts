import { RootState } from '../../../app/store';

const emptyArray: never[] = [];

export const getTopStoryIds = (state: RootState) => {
  return state.entities.topStoryIds || emptyArray;
};

export const getItem = (state: RootState, itemId: string | number) => {
  return (state.entities.itemsById || {})[itemId];
};
