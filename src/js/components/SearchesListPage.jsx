import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

// Material UI Components
import withStyles from '@material-ui/core/styles/withStyles';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
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
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

// Material UI Icons
import Search from '@material-ui/icons/Search';

// Custom Components
import SettingContainer from './layout/SettingContainer';
import TablePaginationActions from './utils/TablePaginationActions';

// Actions
import { getSearchesList } from '../actions/search.actions';

const styles = (theme) => ({});

class SearchesListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "rowsPerPage": 20,
            "page": 0,
            "search": '',
        };
    }

    componentDidMount() {
        this.props.getSearchesList({
            limit: this.state.rowsPerPage,
        });
    }

    handleChange = e => {
        const { name, value } = e.target;

        this.setState({
            [name]: value
        });
    }

    handleSearch = e => {
        e.preventDefault();
    
        this.props.getSearchesList({
          search: this.state.search,
          limit: this.state.rowsPerPage,
        });
    }

    handlePaginationChange = (e, page) => {
        const { rowsPerPage, search } = this.state;
    
        this.props.getSearchesList({
            skip: page * rowsPerPage,
            limit: rowsPerPage,
            search,
        })
        .then(response => {
            if (response) {
                this.setState({
                    page: page,
                });
            }
        });
    }

    handleChangeRowsPerPage = (e) => {
        const { page, search } = this.state;
    
        this.props.getSearchesList({
            skip: page * e.target.value,
            limit: e.target.value,
            search,
        })
        .then(response => {
            if (response) {
                this.setState({
                    rowsPerPage: e.target.value,
                });
            }
        });
    }

    render() {
        const { classes, searchesList } = this.props;

        return <SettingContainer>
            <div>
                <Typography variant="display1" gutterBottom>Search Queries List</Typography>

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
                                        aria-label="Search"
                                        onClick={this.handleSearch}
                                    >
                                        <Search />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </form>

                <br />

                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Index</TableCell>
                                <TableCell>Query</TableCell>
                                <TableCell>Week</TableCell>
                                <TableCell>Month</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Empty Result</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {
                                _.isEmpty(searchesList) 
                                    ? <TableRow></TableRow>
                                    : searchesList.map((item, index) => (
                                        <TableRow hover key={item._id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.query}</TableCell>
                                            <TableCell>{item.weekCount}</TableCell>
                                            <TableCell>{item.monthCount}</TableCell>
                                            <TableCell>{item.totalCount}</TableCell>
                                            <TableCell>{item.isEmptyResult ? "yes": "no"}</TableCell>
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
            </div>
        </SettingContainer>
    }
}

SearchesListPage.proptypes = {
    "classes": PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return {
      "searchesList": state.searchReducer.list,
      "totalCount": state.searchReducer.totalCount,
      "isFetching": state.searchReducer.isFetching,
    };
};

export default connect(mapStateToProps, { getSearchesList })(withStyles(styles)(SearchesListPage));