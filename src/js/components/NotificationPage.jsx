import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Componetns
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

// Material UI Icons
import DeleteIcon from '@material-ui/icons/Delete';
import FiberNew from '@material-ui/icons/FiberNew';

// Custom Componetns
import SettingContainer from './layout/SettingContainer';
import MessageContent from './utils/MessageContent';
import ConfirmationDialog from './utils/ConfirmationDialog';
import getElapsedTime from '../helpers/ElapsedTime';
import { loadFromStorage } from '../helpers/webStorage';
import webStorageTypes from '../constants/webStorage.types';

// Actions
import { getNotification, deleteNotification, clearReadNotifications } from '../actions/notification.actions';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class NotificationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      dialogOpen: false,
      limit: 20,
      count: 0,
      id: '',
      hasMore: false,
    };

    this.state.userId = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);

    this.handleDelete = this.handleDelete.bind(this);
    this.handleConfirmationDialogOpen = this.handleConfirmationDialogOpen.bind(this);
    this.handleConfirmationDialogClose = this.handleConfirmationDialogClose.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleClearNotifications = this.handleClearNotifications.bind(this);
    this.handleClickListItem = this.handleClickListItem.bind(this);
  }

  componentDidMount() {
    this.props.getNotification({ uid: this.state.userId, limit: this.state.limit })
      .then(response => {
        if (response) {
          this.setState({
            list: response.list.slice(),
            count: this.state.limit,
            hasMore: this.state.limit < response.totalCount
          });
        }
      });
  }

  handleDelete = (id, index) => e =>  {
    this.props.deleteNotification(id)
      .then(response => {
        if (response) {
          const list = this.state.list.slice();
          list.splice(index, 1);

          this.setState({
            list: list,
          });
        }
      });
  }

  handleConfirmationDialogOpen() {
    this.setState({
      dialogOpen: true,
    });
  }

  handleConfirmationDialogClose() {
    this.setState({
      dialogOpen: false
    });
  }

  handleClearNotifications() {
    this.props.clearReadNotifications(this.state.userId)
      .then(response => {
        if (response) {
          this.setState({
            dialogOpen: false,
            list: [],
          });
        }
      });
  }

  handleClickListItem = item => e => {
    switch (item.type) {
      case "BUSINESS":
        this.props.history.push('/business/s/' + item.subjectUrl);
        break;

      case "REVIEW":
        this.props.history.push('/business/s/' + item.subjectUrl, { reviewId: item.commentId });
        break;

      case "COMMENT":
        this.props.history.push('/post/s/' + item.subjectUrl, {});

      default:
        return;
    }
  }

  loadMore() {
    if (this.state.hasMore) {
      this.props.getNotification({
        uid: this.state.userId,
        limit: this.state.limit,
        skip: this.state.count
      })
      .then(response => {
        if (response) {
          this.setState({
            count: this.state.count + this.state.limit,
            hasMore: this.state.count + this.state.limit < this.props.totalCount,
            list: this.state.list.concat(response.list),
          });
        }

      });
    }
  }

  render() {
    const { classes, notificationList } = this.props;

    return (
      <SettingContainer>
        <div>
          <Grid container className={classes.root} spacing={16} justify="center" alignItems="flex-start">
            <Grid item xs={12}>
              <Typography variant="display1" gutterBottom>
                Notifications
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button color="primary" onClick={this.handleConfirmationDialogOpen}>Clear</Button>
            </Grid>
            <Grid item xs={12}>
              <List>
                <InfiniteScroll
                  pageStart={0}
                  loadMore={this.loadMore}
                  hasMore={this.state.hasMore}
                  loader={<div className="loader" key={0}>Loading ...</div>}
                >
                  {
                    _.isEmpty(this.state.list) ? ''
                      : this.state.list.map((item, index) =>
                        <Paper className={classes.paper} key={index}>
                          <ListItem className={classes.listItem} button onClick={this.handleClickListItem(item)}>
                            {
                              item.isRead ? ''
                                : <ListItemIcon>
                                    <FiberNew color="secondary"/>
                                  </ListItemIcon>
                            }
                            <ListItemText
                              primary={
                                <MessageContent
                                  key={item._id}
                                  sender={item.senderId}
                                  type={item.type}
                                  event={item.event}
                                  subjectTitle={item.subjectTitle}
                                  subjectContent={item.subjectContent}
                                  commentContent={item.commentContent}
                                  subjectUrl={item.subjectUrl}
                                  commentId={item.commentId}
                                  content={item.content}
                                />
                              }
                              secondary={getElapsedTime(item.createdAt)}
                            />
                            <ListItemSecondaryAction>
                              <IconButton aria-label="Delete" onClick={this.handleDelete(item._id, index)}>
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        </Paper>
                      )
                  }
                </InfiniteScroll>
              </List>
            </Grid>
          </Grid>
          <ConfirmationDialog
            open={this.state.dialogOpen}
            title="Warning"
            content="Are you sure to clear all?"
            operation={this.handleClearNotifications}
            handleClose={this.handleConfirmationDialogClose}
          />
        </div>
      </SettingContainer>
    );
  }
}

NotificationPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "isLoggedIn": PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "notificationList": state.notificationReducer.list,
    "totalCount": state.notificationReducer.totalCount,
  };
};

export default connect(mapStateToProps, { getNotification, deleteNotification, clearReadNotifications })(withStyles(styles)(NotificationPage));
