import * as React from 'react';
import { useSelector } from 'react-redux';
import { useRequest } from 'redux-query-react';

import * as storyQueryConfigs from '../query-configs/stories';
import * as storySelectors from '../selectors/stories';
import { RootState } from '../../../app/store';

const Item = (props: { itemId: any }) => {
  const [{ isPending }] = useRequest(storyQueryConfigs.itemRequest(props.itemId));

  const item = useSelector((state: RootState) => storySelectors.getItem(state, props.itemId));

  return (
    <li>
      {isPending && 'Loading…'}
      {!!item && (
        <div>
          <div>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
          </div>
          <div>
            {item.score} points by{' '}
            <a
              href={`https://news.ycombinator.com/user?id=${item.by}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.by}
            </a>
          </div>
        </div>
      )}
    </li>
  );
};

export default Item;
