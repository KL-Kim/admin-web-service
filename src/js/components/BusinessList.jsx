import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

// Material UI Components
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
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Badge from '@material-ui/core/Badge';

// Material UI Icons
import Search from '@material-ui/icons/Search';

// Custom Components
import SettingContainer from './layout/SettingContainer';
import LinkContainer from './utils/LinkContainer';
import TablePaginationActions from './utils/TablePaginationActions';
import { getBusinessList, clearBusinessList } from '../actions/business.actions.js';

const styles = (theme) => ({
  "container": {
    marginBottom: theme.spacing.unit,
  },
  "buttonContainer": {
    "display": "flex",
    "justifyContent": "flex-end",
  },
  "title": {
    paddingRight: theme.spacing.unit * 2,
  },
});

class BusinessList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "search": '',
      "rowsPerPage": 20,
      "page": 0,
      "status": '',
      "event": false,
      "reports": false,
      "orderBy": 'new',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleEventSwitch = this.handleEventSwitch.bind(this);
    this.handleReportSwitch = this.handleReportSwitch.bind(this);
    this.hanldeChangeStatus = this.hanldeChangeStatus.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  componentDidMount() {
    this.props.getBusinessList({
      limit: this.state.rowsPerPage,
      orderBy: this.state.orderBy,
    });
  }

  handlePaginationChange(e, page) {
    const { rowsPerPage, status, search, reports, event, orderBy } = this.state;

    this.props.getBusinessList({
      skip: page * rowsPerPage,
      limit: rowsPerPage,
      filter: {
        status,
        event,
        reports,
      },
      search,
      orderBy,
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
    const { page, status, search, reports, event, orderBy } = this.state;

    this.props.getBusinessList({
      skip: page * e.target.value,
      limit: e.target.value,
      filter: {
        status,
        event,
        reports,
      },
      search,
      orderBy,
    })
    .then(response => {
      if (response) {
        this.setState({
          rowsPerPage: e.target.value,
        });
      }
    });
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleEventSwitch(e) {
    const { page, rowsPerPage, status, search, reports, orderBy } = this.state;
    const checked = e.target.checked;

    this.props.getBusinessList({
      skip: page * rowsPerPage,
      limit: rowsPerPage,
      filter: {
      status,
      "event": checked,
      reports,
      },
      search,
      orderBy,
    })
    .then(response => {
      if (response) {
        this.setState({
          "event": checked
        });
      }
    });
  }

  handleReportSwitch(e) {
    const { page, rowsPerPage, status, search, event, orderBy } = this.state;
    const checked = e.target.checked;

    this.props.getBusinessList({
      skip: page * rowsPerPage,
      limit: rowsPerPage,
      filter: {
        status,
        event,
        reports: checked
      },
      search,
      orderBy,
    })
    .then(response => {
      if (response) {
        this.setState({
          "reports": checked
        });
      }
    })
  }

  hanldeChangeStatus(e) {
    const { value } = e.target;
    const { page, rowsPerPage, event, reports, search, orderBy } = this.state

    this.props.getBusinessList({
      skip: page * rowsPerPage,
      limit: rowsPerPage,
      filter: {
        status: value,
        event,
        reports,
      },
      search,
      orderBy,
    })
    .then(response => {
      if (response) {
        this.setState({
          status: value,
          event: event,
        });
      }
    });
  }

  handleSearch(e) {
    e.preventDefault();
    const { page, rowsPerPage, status, reports, event, search, orderBy } = this.state;

    this.props.getBusinessList({
      skip: page * rowsPerPage,
      limit: rowsPerPage,
      filter: {
        status,
        event,
        reports
      },
      search,
      orderBy,
    });
  }

  render() {
    const { classes, admin, businessList } = this.props;

    return (
      <SettingContainer>
        <div>
          <Typography variant="display1" gutterBottom>
            Business List
          </Typography>

          <Grid container spacing={16} className={classes.container}>
            <Grid item xs={3}>
              <form onSubmit={this.handleSearch}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="search">Search</InputLabel>
                  <Input
                    type="text"
                    id="search"
                    name="search"
                    onChange={this.handleChange}
                    endAdornment={
                      <InputAdornment position="end">
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
          </Grid>

          <Grid container>
            <Grid item xs={4}>
              <FormControl fullWidth >
                <FormLabel component="label">Status</FormLabel>
                <RadioGroup
                  row
                  aria-label="Status"
                  name="status"
                  value={this.state.status}
                  onChange={this.hanldeChangeStatus}
                >
                  <FormControlLabel value="" control={<Radio />} label="All" />
                  <FormControlLabel value="PUBLISHED" control={<Radio />} label="Published" />
                  <FormControlLabel value="DRAFT" control={<Radio />} label="Draft" />
                  <FormControlLabel value="TRASH" control={<Radio />} label="Trash" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <FormControl fullWidth >
                <FormLabel component="label">Event</FormLabel>
                <Switch
                  color="primary"
                  checked={this.state.event}
                  onChange={this.handleEventSwitch}
                  value="event"
                  />
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <FormControl fullWidth >
                <FormLabel component="label">Reports</FormLabel>
                <Switch
                  color="primary"
                  checked={this.state.reports}
                  onChange={this.handleReportSwitch}
                  value="event"
                  />
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <div className={classes.buttonContainer}>
                <LinkContainer to={{
                    pathname: "/business/s/new",
                    hash: '#',
                    state: {
                      "admin": admin,
                    }
                  }}
                >
                  <Button variant="raised" color="primary" aria-label="add" size="large" onClick={this.handleAddNew}>
                    Add New
                  </Button>
                </LinkContainer>
              </div>
            </Grid>
          </Grid>

          <Paper>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Index</TableCell>
                  <TableCell>中文名</TableCell>
                  <TableCell>한국어</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Views Count</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  _.isEmpty(businessList) ? (<TableRow></TableRow>)
                  : businessList.map((business, index) => (
                    <LinkContainer to={{
                        pathname: "/business/s/" + business.enName,
                        hash: '#',
                        state: {
                          "admin": admin,
                          "businessId": business._id
                        }
                      }} key={index}
                    >
                      <TableRow hover >
                        <TableCell>{index+1}</TableCell>
                        <TableCell>
                          {
                            (business.reports.length > 0)
                              ? <Badge color="secondary" badgeContent={business.reports.length}>
                                  <Typography variant="body1" className={classes.title}>
                                    {business.cnName}
                                  </Typography>
                                </Badge>
                              : business.cnName
                          }
                        </TableCell>
                        <TableCell>{business.krName}</TableCell>
                        <TableCell>{_.isEmpty(business.category) ? '' : business.category.krName}</TableCell>
                        <TableCell>{business.viewsCount}</TableCell>
                        <TableCell>{business.status}</TableCell>
                        <TableCell>{business.priority}</TableCell>
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
        </div>
      </SettingContainer>
    );
  }
}

BusinessList.propTypes = {
  "classes": PropTypes.object.isRequired,
  "history": PropTypes.object.isRequired,
  "admin": PropTypes.object.isRequired,
  "getBusinessList": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
    "businessList": state.businessReducer.businessList,
    "totalCount": state.businessReducer.totalCount,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getBusinessList, clearBusinessList })(withStyles(styles)(BusinessList));
