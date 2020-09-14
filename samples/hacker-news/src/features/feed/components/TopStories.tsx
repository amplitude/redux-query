import * as React from 'react';
import { useSelector } from 'react-redux';
import { useRequest } from 'redux-query-react';

import Item from '../components/Item';
import * as storyQueryConfigs from '../query-configs/stories';
import * as storySelectors from '../selectors/stories';

const TopStories = (props: any) => {
  useRequest(storyQueryConfigs.topStoriesRequest());
  const topStoryIds = useSelector(storySelectors.getTopStoryIds);

  return (
    <ol>
      {topStoryIds.slice(0, 30).map((itemId: any) => (
        <Item itemId={itemId} key={itemId} />
      ))}
    </ol>
  );
};

export default TopStories;
