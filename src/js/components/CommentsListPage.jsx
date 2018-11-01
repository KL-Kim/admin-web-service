import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// Material UI Components
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

// Material UI Icons
import Search from '@material-ui/icons/Search';

// Custom Components
import SettingContainer from './layout/SettingContainer';
import ProperName from './utils/ProperName';
import TablePaginationActions from './utils/TablePaginationActions';

// Actions
import {
  getComments,
  editComment,
  clearCommentsList
} from '../actions/comment.actions';

const styles = (theme) => ({});

class CommentsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "rowsPerPage": 20,
      "page": 0,
      "editDialogOpen": false,
      "commentId": '',
      "content": '',
      "status": '',
      "listStatus": 'ALL',
      "userId": '',
      "username": '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getComments({
      limit: this.state.rowsPerPage,
      status: this.state.listStatus,
    });
  }

  componentWillUnmount() {
    this.props.clearCommentsList();
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleChangeStatus(e) {
    const { value } = e.target;

    this.props.getComments({
      limit: this.state.rowsPerPage,
      status: value,
    })
    .then(response => {
      if (response) {
        this.setState({
          listStatus: value
        });
      }
    })
  }

  handleRowClick(e, item) {
    this.setState({
      editDialogOpen: true,
      commentId: item._id,
      content: item.content,
      status: item.status,
      userId: item.userId._id,
      username: item.userId.username,
    });
  }

  handlePaginationChange(e, page) {
    this.props.getComments({
      skip: page * this.state.rowsPerPage,
      limit: this.state.rowsPerPage,
    }).then(response => {
      if (response) {
        this.setState({
          page: page
        });
      }
    });
  }

  handleChangeRowsPerPage(e) {
    this.props.getComments({
      skip: this.state.page * e.target.value,
      limit: e.target.value,
    })
    .then(response => {
      if (response) {
        this.setState({
          limit: e.target.value,
        });
      }
    });
  }

  handleDialogClose() {
    this.setState({
      editDialogOpen: false,
      commentId: '',
      content: '',
      status: '',
      userId: '',
      username: '',
    });
  }

  handleSubmit() {
    if (this.state.commentId) {
      this.props.editComment(this.state.commentId, this.state.status)
        .then(response => {
          if (response) {
            return this.props.getComments({
              skip: this.state.page * this.state.rowsPerPage,
              limit: this.state.rowsPerPage,
              status: this.state.listStatus,
            });
          }
        })
        .then(response => {
          this.setState({
            editDialogOpen: false
          });
        });
    }
  }

  render() {
    const { classes, comments } = this.props;

    return (
      <SettingContainer>
        <div>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="display1" gutterBottom>Comments List</Typography>
            </Grid>

            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={6}>
                  <FormControl fullWidth >
                    <FormLabel component="label">Comment Status</FormLabel>
                    <RadioGroup
                      row
                      aria-label="Status"
                      name="listStatus"
                      value={this.state.listStatus}
                      onChange={this.handleChangeStatus}
                    >
                      <FormControlLabel value="ALL" control={<Radio />} label="All" />
                      <FormControlLabel value="NORMAL" control={<Radio />} label="Normal" />
                      <FormControlLabel value="SUSPENDED" control={<Radio />} label="Suspended" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Index</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Post</TableCell>
                      <TableCell>Content</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {
                      _.isEmpty(comments) ? (<TableRow></TableRow>)
                        : comments.map((comment, index) => (
                          <TableRow hover key={index}
                            onClick={e => this.handleRowClick(e, comment)}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell><ProperName user={comment.userId} /></TableCell>
                            <TableCell>{comment.postId.title}</TableCell>
                            <TableCell>{comment.content}</TableCell>
                            <TableCell>{comment.status}</TableCell>
                          </TableRow>
                      ))
                    }
                  </TableBody>

                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        colSpan={3}
                        count={this.props.totalCount}
                        rowsPerPage={this.state.rowsPerPage}
                        rowsPerPageOptions={[10, 20, 30]}
                        page={this.state.page}
                        onChangePage={this.handlePaginationChange}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </Paper>
            </Grid>
          </Grid>
          
          <Dialog fullWidth
            open={this.state.editDialogOpen}
            onClose={this.handleDialogClose}
            aria-labelledby="comment-dialog-title"
            aria-describedby="comment-dialog-description"
          >
            <DialogTitle id="comment-dialog-title">
              <Link to={{
                  pathname: "/user/s/" + this.state.username,
                  hash: '#',
                  state: {
                    "admin": this.props.admin,
                    "userId": this.state.userId,
                  }
                }}
              >
                {this.state.username}
              </Link>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={16}>
                <Grid item xs={6}>
                  <FormControl fullWidth >
                    <FormLabel component="label">Status</FormLabel>
                    <RadioGroup
                      row
                      aria-label="Status"
                      name="status"
                      value={this.state.status}
                      onChange={this.handleChange}
                    >
                      <FormControlLabel value="NORMAL" control={<Radio />} label="Normal" />
                      <FormControlLabel value="SUSPENDED" control={<Radio />} label="Suspended" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>{this.state.content}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button variant="raised" autoFocus color="primary" disabled={_.isEmpty(this.state.commentId)} onClick={this.handleSubmit}>
                Save
              </Button>
              <Button color="primary" onClick={this.handleDialogClose}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </SettingContainer>
    );
  }
}

CommentsList.propTypes = {
  "classes": PropTypes.object.isRequired,
  "comments": PropTypes.array.isRequired,
  "totalCount": PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
    "comments": state.commentReducer.comments,
    "totalCount": state.commentReducer.totalCount,
  };
};

export default connect(mapStateToProps, { getComments, editComment, clearCommentsList })(withStyles(styles)(CommentsList));
