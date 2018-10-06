import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { schema, normalize } from 'normalizr';
import { connectRequest, querySelectors } from 'redux-query';
import get from 'lodash.get';
import { selectReddit } from '../actions';
import Picker from '../components/Picker';
import Posts from '../components/Posts';

const getRedditUrl = reddit => `https://www.reddit.com/r/${reddit}.json`;

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
  }

  handleChange(nextReddit) {
    this.props.dispatch(selectReddit(nextReddit));
  }

  handleRefreshClick(e) {
    e.preventDefault();
    this.props.forceRequest();
  }

  render() {
    const { selectedReddit, posts, isFetching, lastUpdated } = this.props;
    return (
      <div>
        <Picker
          value={selectedReddit}
          onChange={this.handleChange}
          options={['reactjs', 'frontend']}
        />
        <p>
          {lastUpdated && (
            <span>Last updated at {new Date(lastUpdated).toLocaleTimeString()}. </span>
          )}
          {!isFetching && <button onClick={this.handleRefreshClick}>Refresh</button>}
        </p>
        {isFetching && posts.length === 0 && <h2>Loading...</h2>}
        {!isFetching && posts.length === 0 && <h2>Empty.</h2>}
        {posts.length > 0 && (
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} />
          </div>
        )}
      </div>
    );
  }
}

App.propTypes = {
  selectedReddit: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const { selectedReddit } = state;
  const url = getRedditUrl(selectedReddit);
  const queriesState = get(state, 'queries');
  const isFetching = querySelectors.isPending(queriesState, { url }) || false;
  const lastUpdated = querySelectors.lastUpdated(queriesState, { url });
  const postIds = get(state, ['entities', 'reddits', selectedReddit, 'data', 'children'], []);
  const posts = postIds.map(id => get(state, ['entities', 'posts', id]));

  return {
    selectedReddit,
    posts,
    isFetching,
    lastUpdated,
  };
};

const getSchema = reddit => {
  const subreddit = new schema.Entity(
    'reddits',
    {},
    {
      idAttribute: () => reddit,
    },
  );

  const post = new schema.Entity(
    'posts',
    {},
    {
      idAttribute: entity => {
        return entity.data.id;
      },
    },
  );

  subreddit.define({
    data: {
      children: [post],
    },
  });

  return subreddit;
};

const AppContainer = connectRequest(props => ({
  url: getRedditUrl(props.selectedReddit),
  transform: response => normalize(response, getSchema(props.selectedReddit)).entities,
  options: {
    headers: {
      Accept: 'application/json',
    },
  },
  update: {
    posts: (prevPosts, posts) => {
      return {
        ...prevPosts,
        ...posts,
      };
    },
    reddits: (prevReddits, reddits) => {
      return {
        ...prevReddits,
        ...reddits,
      };
    },
  },
}))(App);

export default connect(mapStateToProps)(AppContainer);
