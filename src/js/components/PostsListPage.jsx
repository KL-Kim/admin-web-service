import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';

// Material UI Component
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import Chip from '@material-ui/core/Chip';

// Custom Component
import SettingContainer from './layout/SettingContainer';
import TablePaginationActions from './utils/TablePaginationActions';
import ElapsedTime from '../helpers/ElapsedTime';

// Actions
import { getPostsList, updatePostState } from '../actions/blog.actions';
import LinkContainer from './utils/LinkContainer';

const styles = (theme) => ({

});

class BlogList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "dialogOpen": false,
      "search": '',
      "rowsPerPage": 20,
      "page": 0,
      "title": '',
      "content": '',
      "state": '',
      "postId": '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.hanldeDialogClose = this.hanldeDialogClose.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleUpdatePostState = this.handleUpdatePostState.bind(this);
  }

  componentDidMount() {
    this.props.getPostsList({
      limit: this.state.rowsPerPage,
    });
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleRowClick = blog => e => {
    this.setState({
      dialogOpen: true,
      title: blog.title,
      content: blog.content,
      state: blog.state,
      postId: blog._id,
    });
  }

  hanldeDialogClose() {
    this.setState({
      dialogOpen: false,
      title: '',
      content: '',
    });
  }

  handlePaginationChange(e, page) {
    this.props.getPostsList({
      skip: page * this.state.rowsPerPage,
      limit: this.state.rowsPerPage,
    })
    .then(response => {
      if (response) {
        this.setState({
          page: page,
        });
      }
    });
  }

  handleChangeRowsPerPage(e) {
    this.props.getPostsList({
      limit: e.target.value,
      skip: this.state.page * e.target.value
    }).then(response => {
      if (response) {
        this.setState({
          rowsPerPage: e.target.value
        });
      }
    });
  }

  handleUpdatePostState() {
    if (this.state.postId) {
      this.props.updatePostState(this.state.postId, this.state.state)
        .then(response => {
          if (response) {
            this.props.getPostsList({
              limit: this.state.rowsPerPage,
              skip: this.state.page * this.state.rowsPerPage,
            });
          }

          this.setState({
            dialogOpen: false
          });
        });
    }
  }

  render() {
    const { classes, blogList } = this.props;

    return (
      <SettingContainer>
        <div>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="display1">
                Posts List
              </Typography>
            </Grid>

            <Grid item>
              <LinkContainer to={{
                  pathname: "/post/s/new",
                  state: {
                    admin: this.props.admin
                  },
                }}
              >
                <Button variant="raised" color="primary">New</Button>
              </LinkContainer>
            </Grid>
          </Grid>

          <Grid container className={classes.root} spacing={16} justify="center" alignItems="center">
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Index</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Summary</TableCell>
                      <TableCell>Publish Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Reports</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      _.isEmpty(blogList)
                        ? (<TableRow></TableRow>)
                        : blogList.map((item, index) => (
                            <LinkContainer to={{
                                pathname: "/post/s/" + item._id,
                                hash: '#',
                                state: {
                                  "admin": this.props.admin,
                                }
                              }} 
                              key={item._id}
                            >
                              <TableRow hover>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.summary.substring(0, 50)}...</TableCell>
                                <TableCell>{item.publishedAt ? ElapsedTime(item.publishedAt): 'Not published'}</TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell>
                                  {
                                    item.reports.length > 0
                                      ? <Chip label={item.reports.length} color="secondary" />
                                      : "None"
                                  }
                                </TableCell>
                              </TableRow>
                            </LinkContainer>
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

          <div>
            <Dialog
              fullWidth
              open={this.state.dialogOpen}
              onClose={this.hanldeDialogClose}
              aria-labelledby="blog-dialog-title"
              aria-describedby="blog-dialog-description"
            >
              <DialogTitle id="blog-dialog-title">
                {this.state.title}
              </DialogTitle>
              <DialogContent id="blog-dialog-content">
                <Grid container>
                  <Grid item xs={12}>
                    <FormControl fullWidth >
                      <FormLabel component="label">State</FormLabel>
                      <RadioGroup
                        row
                        aria-label="State"
                        name="state"
                        value={this.state.state}
                        onChange={this.handleChange}
                      >
                        <FormControlLabel value="NORMAL" control={<Radio />} label="Normal" />
                        <FormControlLabel value="SUSPENDED" control={<Radio />} label="Suspended" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button color="primary" variant="raised" onClick={this.handleUpdatePostState} className={classes.button}>
                  Save
                </Button>
                <Button color="primary" onClick={this.hanldeDialogClose} className={classes.button}>
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </SettingContainer>
    );
  }
}

BlogList.propTypes = {
  "classes": PropTypes.object.isRequired,
  "blogList": PropTypes.array.isRequired,
  "isFetching": PropTypes.bool.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
    "blogList": state.blogReducer.list,
    "totalCount": state.blogReducer.totalCount,
    "isFetching": state.blogReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getPostsList, updatePostState })(withStyles(styles)(BlogList));
