import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Schema, arrayOf, normalize } from 'normalizr';
import { connectRequest, querySelectors } from 'redux-query';
import get from 'lodash.get';
import { selectReddit } from '../actions';
import Picker from '../components/Picker';
import Posts from '../components/Posts';

const getRedditUrl = (reddit) => `https://www.reddit.com/r/${reddit}.json`;

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
        <Picker value={selectedReddit}
                onChange={this.handleChange}
                options={['reactjs', 'frontend']} />
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <a href="#"
               onClick={this.handleRefreshClick}>
              Refresh
            </a>
          }
        </p>
        {isFetching && posts.length === 0 &&
          <h2>Loading...</h2>
        }
        {!isFetching && posts.length === 0 &&
          <h2>Empty.</h2>
        }
        {posts.length > 0 &&
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} />
          </div>
        }
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

function mapStateToProps(state) {
    const { selectedReddit } = state;
    const url = getRedditUrl(selectedReddit);
    const queriesState = get(state, 'queries');
    const isFetching = querySelectors.isPending(url)(queriesState) || false;
    const lastUpdated = querySelectors.lastUpdated(url)(queriesState);
    const postIds = get(state, ['entities', 'reddits', selectedReddit, 'data', 'children'], []);
    const posts = postIds.map((id) => get(state, ['entities', 'posts', id]));

    return {
      selectedReddit,
      posts,
      isFetching,
      lastUpdated,
  };
}

function getSchema(reddit) {
    const subreddit = new Schema('reddits', {
      idAttribute: () => reddit,
  });

    const post = new Schema('posts', {
      idAttribute: (entity) => {
        return entity.data.id;
    },
  });

    subreddit.define({
      data: {
        children: arrayOf(post),
    },
  });

    return subreddit;
}

const AppContainer = connectRequest((props) => ({
    url: getRedditUrl(props.selectedReddit),
    transform: (response) => normalize(response, getSchema(props.selectedReddit)).entities,
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
