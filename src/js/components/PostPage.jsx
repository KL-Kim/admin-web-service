import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

// Material UI Icons
import Search from '@material-ui/icons/Search';

// Custom Components
import Container from '../layout/Container';
import PostCard from '../utils/PostCard';

// Actions
import { getPostsList } from 'js/actions/blog.actions';

// Webstorage
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

const styles = theme => ({
  "masonryWrapper": {
    width: 976,
    position: 'relative',
    top: 0,
    left: -theme.spacing.unit,
  },
  "mansoryItem": {
    width: "33.33%",
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
});

class PostPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "limit": 18,
      "count": 0,
      'hasMore': false,
      "search": '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    const userId = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);

    if (userId) {
      this.props.getPostsList({
        'uid': this.state.userId,
        'limit': this.state.limit,
      }).then(response => {
        if (response) {
          this.setState({
            userId,
            hasMore: response.list.length < response.totalCount,
            count: response.list.length,
          });
        }
      });
    }
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  loadMore() {
    if (this.state.hasMore) {
      this.props.getPostsList({
        'uid': this.state.userId,
        'limit': this.state.limit + this.state.count,
        'search': this.state.search,
      }).then(response => {
        if (response) {
          this.setState({
            hasMore: response.list.length < response.totalCount,
            count: response.list.length,
          });
        }
      });
    }
  }

  handleSearch(e) {
    e.preventDefault();

    this.props.getPostsList({
      'uid': this.state.userId,
      'limit': this.state.limit,
      'search': this.state.search,
    }).then(response => {
      if (response) {
        this.setState({
          hasMore: response.list.length < response.totalCount,
          count: response.list.length,
        });
      }
    });
  }

  render() {
    const { classes, postsList } = this.props;

    return _.isEmpty(this.props.user) ? null : (
      <Container>
        <div>
          <Typography variant="title" >My Posts</Typography>
          <br />

          <Grid container justify="space-between" alignItems="flex-end">
            <Grid item xs={4}>
              <form onSubmit={this.handleSearch}>
                <FormControl fullWidth>
                  <Input
                    type="search"
                    id="search-post"
                    autoComplete="off"
                    name="search"
                    placeholder="Search ..."
                    onChange={this.handleChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton
                          aria-label="Searching"
                          onClick={this.handleSearch}
                        >
                          <Search />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </form>
            </Grid>

            <Grid item>
              <Link to="/setting/post/s/new">
                <Button variant="outlined" color="primary">Add new</Button>
              </Link>
            </Grid>
          </Grid>

          <br />

          {
            _.isEmpty(postsList)
              ? <Typography>None</Typography>
              : <div>
                  <InfiniteScroll
                      pageStart={0}
                      loadMore={this.loadMore}
                      hasMore={this.state.hasMore}
                      loader={<div style={{ textAlign: 'center' }} key={0}>
                                <CircularProgress size={30} />
                              </div>}
                    >
                    <div className={classes.masonryWrapper}>
                      <Masonry>
                        {
                          postsList.map(item => (
                            <div key={item._id} className={classes.mansoryItem}>
                              <PostCard
                                key={item._id}
                                id={item._id}
                                author={item.authorId}
                                user={this.props.user}
                                title={item.title}
                                summary={item.summary}
                                status={item.status}
                              />
                            </div>
                          ))
                        }
                      </Masonry>
                    </div>
                  </InfiniteScroll>

                  {
                    !this.state.hasMore
                      ?   <Typography variant="caption" align="center">
                            --- No more posts, You have total {this.props.totalCount} posts ---
                          </Typography>
                      : null
                  }
                </div>
              }
        </div>
      </Container>
    );
  }
}

PostPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "postsList": state.blogReducer.list,
    "totalCount": state.blogReducer.totalCount,
  };
};

export default connect(mapStateToProps, { getPostsList })(withStyles(styles)(PostPage));
