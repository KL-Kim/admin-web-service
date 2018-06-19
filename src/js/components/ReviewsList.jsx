import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';

// Material UI Icons
import Search from '@material-ui/icons/Search';

// Custom Component
import SettingContainer from './layout/SettingContainer';
import ProperName from './utils/ProperName';
import TablePaginationActions from './utils/TablePaginationActions';
import getElapsedTime from '../helpers/ElapsedTime';

// Actions
import { getReviews, clearReviewsList, editReview } from '../actions/review.actions';

const Quality = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const styles = (theme) => ({
});

class ReviewsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "rowsPerPage": 20,
      "page": 0,
      "search": '',
      "dialogOpen": false,
      "reviewId": '',
      "content": '',
      "status": '',
      "quality": 0,
      "username": '',
      "userId": '',
      "businessName": '',
    };

    this.handleRowClick = this.handleRowClick.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getReviews({
      limit: this.state.rowsPerPage,
      orderBy: "new",
    });
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleRowClick(e, review) {
    this.setState({
      reviewId: review._id,
      content: review.content,
      status: review.status,
      quality: review.quality,
      username: review.user.username,
      userId: review.user._id,
      businessName: review.business.krName,
      dialogOpen: true,
    });
  }

  handlePaginationChange(e, page) {
    this.props.getReviews({
      skip: page * this.state.rowsPerPage,
      limit: this.state.rowsPerPage,
      search: this.state.search,
      "orderBy": "new",
    })
    .then(response => {
      this.setState({
        page: page,
      });
    });
  }

  handleChangeRowsPerPage(e) {
    this.props.getReviews({
      skip: this.state.page * e.target.value,
      limit: e.target.value,
      search: this.state.search,
      "orderBy": "new",
    })
    .then(response => {
      if (response) {
        this.setState({
          rowsPerPage: e.target.value,
        });
      }
    });
  }

  handleSearch(e) {
    e.preventDefault();

    this.props.getReviews({
      skip: this.state.page * this.state.rowsPerPage,
      limit: this.state.rowsPerPage,
      search: this.state.search,
      "orderBy": "new",
    });
  }

  handleDialogClose() {
    this.setState({
      "dialogOpen": false
    });
  }

  handleSubmit() {
    this.props.editReview(this.state.reviewId, {
      quality: this.state.quality,
      status: this.state.status,
    })
    .then(response => {
      if (response) {
        this.props.getReviews({
          skip: this.state.page * this.state.rowsPerPage,
          limit: this.state.rowsPerPage,
          search: this.state.search,
          "orderBy": "new"
        });
      }

      this.setState({
        "dialogOpen": false,
      });
    });
  }

  render() {
    const { classes, reviews } = this.props;

    return (
      <SettingContainer>
        <div>
          <Grid container className={classes.root} spacing={16}>
            <Grid item xs={12}>
              <Typography variant="display1" gutterBottom>
                Reviews List
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <form onSubmit={this.handleSearch}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="adornment-password">Search</InputLabel>
                  <Input
                    id="search"
                    type="text"
                    name="search"
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
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

            <Grid item xs={12}>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Index</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Business</TableCell>
                      <TableCell>Content</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Quality</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      _.isEmpty(reviews) ? (<TableRow></TableRow>)
                        : reviews.map((review, index) => (
                          <TableRow hover key={index}
                            onClick={e => this.handleRowClick(e, review)}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell><ProperName user={review.user} /></TableCell>
                            <TableCell>{(_.isEmpty(review.business)) ? '': review.business.krName}</TableCell>
                            <TableCell>
                              <div dangerouslySetInnerHTML={{__html: review.content}} />
                            </TableCell>
                            <TableCell>{getElapsedTime(review.createdAt)}</TableCell>
                            <TableCell>{review.status}</TableCell>
                            <TableCell>{review.quality}</TableCell>

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
            open={this.state.dialogOpen}
            onClose={this.handleDialogClose}
            aria-labelledby="review-dialog-title"
            aria-describedby="review-dialog-description"
          >
            <DialogTitle id="review-dialog-title">
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
                    <FormLabel component="label">Staus</FormLabel>
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
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="quality">Quality</InputLabel>
                    <Select native
                      name="quality"
                      value={this.state.quality}
                      onChange={this.handleChange}
                      input={<Input id="quality" />}
                    >

                      {Quality.map(item => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <div dangerouslySetInnerHTML={{__html: this.state.content}} />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button variant="raised" autoFocus color="primary" disabled={_.isEmpty(this.state.reviewId)} onClick={this.handleSubmit}>
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

ReviewsList.propTypes = {
  "classes": PropTypes.object.isRequired,
  "reviews": PropTypes.array.isRequired,
  "totalCount": PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
    "reviews": state.reviewReducer.reviews,
    "totalCount": state.reviewReducer.totalCount,
  };
};

export default connect(mapStateToProps, { getReviews, clearReviewsList, editReview })(withStyles(styles)(ReviewsList));
