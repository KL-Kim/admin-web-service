import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

// Material UI Component
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';

import Checkbox from '@material-ui/core/Checkbox';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

// Material UI Icons
import Search from '@material-ui/icons/Search';

// Custom Components
import SettingContainer from './layout/SettingContainer';
import LinkContainer from './utils/LinkContainer';
import TablePaginationActions from './utils/TablePaginationActions';

// Actions
import { getUsersList } from '../actions/admin.actions.js';

const styles = (theme) => ({});

class UsersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "rowsPerPage": 20,
      "page": 0,
      "search": '',
      "role": '',
      "status": ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleFilterRole = this.handleFilterRole.bind(this);
    this.handleFilterStatus = this.handleFilterStatus.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.props.getUsersList({
      limit: this.state.rowsPerPage,
    });
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    })
  }

  handlePaginationChange(e, page) {
    this.props.getUsersList({
      skip: page * this.state.rowsPerPage,
      limit: this.state.rowsPerPage,
      role: this.state.role,
      status: this.state.status,
      search: this.state.search,
    })
    .then(response => {
      if (response.users) {
        this.setState({
          page: page,
        });
      }
    });
  }

  handleChangeRowsPerPage(e) {
    const { value } = e.target;

    this.props.getUsersList({
      skip: this.state.page * e.target.value,
      limit: value,
      role: this.state.role,
      status: this.state.status,
      search: this.state.search,
    })
    .then(response => {
      if (response.users) {
        this.setState({
          rowsPerPage: value,
        });
      }
    });
  }

  handleFilterRole(e) {
    const { value } = e.target;

    this.props.getUsersList({
      skip: this.state.page * this.state.rowsPerPage,
      limit: this.state.rowsPerPage,
      role: value,
      status: this.state.status,
      search: this.state.search
    })
    .then(response => {
      if (response.users) {
        this.setState({
          role: value,
        });
      }
    });
  }

  handleFilterStatus(e) {
    const { value } = e.target;

    this.props.getUsersList({
      skip: this.state.page * this.state.rowsPerPage,
      limit: this.state.rowsPerPage,
      role: this.state.role,
      status: value,
      search: this.state.search
    })
    .then(response => {
      if (response.users) {
        this.setState({
          status: value,
        });
      }
    });
  }

  handleSearch(e) {
    e.preventDefault();

    this.props.getUsersList({
      limit: this.state.rowsPerPage,
      role: this.state.role,
      status: this.state.status,
      search: this.state.search
    });
  }

  render() {
    const { classes, usersList } = this.props;

    return (
      <SettingContainer>
        <div>
          <Typography variant="display1" gutterBottom>
            Users List
          </Typography>

          <Grid container spacing={16}>
            <Grid item xs={8}>
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
                  <FormHelperText id="search-helper-text">Email or Username</FormHelperText>
                </FormControl>
              </form>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth >
                <FormLabel component="label">Role</FormLabel>
                <RadioGroup
                  row
                  aria-label="Role"
                  name="role"
                  value={this.state.role}
                  onChange={this.handleFilterRole}
                >
                  <FormControlLabel value="" control={<Radio />} label="All" />
                  <FormControlLabel value="regular" control={<Radio />} label="Regular" />
                  <FormControlLabel value="writer" control={<Radio />} label="Writer" />
                  <FormControlLabel value="manager" control={<Radio />} label="Manager" />
                  <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth >
                <FormLabel component="label">User Status</FormLabel>
                <RadioGroup
                  row
                  aria-label="Status"
                  name="status"
                  value={this.state.status}
                  onChange={this.handleFilterStatus}
                >
                  <FormControlLabel value="" control={<Radio />} label="All" />
                  <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                  <FormControlLabel value="suspended" control={<Radio />} label="Suspended" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Paper>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Index</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { _.isEmpty(usersList)
                  ? (<TableRow></TableRow>)
                  : usersList.map((user, index) => (
                    <LinkContainer to={{
                        pathname: "/user/s/" + user.username,
                        state: {
                          "admin": this.props.admin,
                          "userId": user._id
                        }
                      }} key={index}
                    >
                      <TableRow hover >
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.userStatus}</TableCell>
                      </TableRow>
                    </LinkContainer>
                  ))
                }
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
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
        </div>
      </SettingContainer>
    );
  }
}

UsersList.propTypes = {
  "classes": PropTypes.object.isRequired,
  "admin": PropTypes.object.isRequired,
  "isFetching": PropTypes.bool.isRequired,
  "usersList": PropTypes.array.isRequired,
  "totalCount": PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
    "isFetching": state.userReducer.isFetching,
    "usersList": state.userReducer.list,
    "totalCount": state.userReducer.totalCount,
  };
};

export default connect(mapStateToProps, { getUsersList })(withStyles(styles)(UsersList));
