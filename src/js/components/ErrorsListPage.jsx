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
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Select from '@material-ui/core/Select';
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
import Switch from '@material-ui/core/Switch';

// Material UI Icons
import Search from '@material-ui/icons/Search';

// Custom Components
import SettingContainer from './layout/SettingContainer';
import TablePaginationActions from './utils/TablePaginationActions';
import ConfirmationDialog from './utils/ConfirmationDialog';

// Actions
import { getErrorsList, eidtError, deleteError } from '../actions/error.actions';

const styles = (theme) => ({});

class ErrorsListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "rowsPerPage": 20,
            "page": 0,
            "editDialogOpen": false,
            "confirmationDialogOpen": false,
            "search": '',
            "orderBy": '',
            "unChecked": false,
            "id": '',
            "function": '',
            "message": '',
            "level": 0,
            "isChecked": false,
        };
    }

    componentDidMount() {
        this.props.getErrorsList({
            limit: this.state.rowsPerPage,
        });
    }

    handleChange = e => {
        const { name, value } = e.target;

        this.setState({
            [name]: value
        });
    }

    handleSwitch = e => {
        this.setState({
            isChecked: !this.state.isChecked
        });
    }

    handleSearch = e => {
        e.preventDefault();
    
        this.props.getErrorsList({
          search: this.state.search,
          limit: this.state.rowsPerPage,
        });
    }

    handlePaginationChange = (e, page) => {
        const { rowsPerPage, search } = this.state;
    
        this.props.getErrorsList({
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
    
        this.props.getErrorsList({
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

    handleRowClick = (e, item) => {
        this.setState({
          editDialogOpen: true,
          "id": item._id,
          "function": item.function,
          "message": item.message,
          "level": item.level,
          "isChecked": item.isChecked,
        });
    }

    handleDialogClose = (e) => {
        this.setState({
            editDialogOpen: false,
            "id": '',
            "function": '',
            "message": '',
            "level": 0,
            "isChecked": false,
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if (this.state.id) {
            this.props.eidtError({
                id: this.state.id,
                isChecked: this.state.isChecked,
            }).then(res => {
                if (!_.isEmpty(res)) {
                    this.props.getErrorsList({
                        limit: this.state.rowsPerPage,
                    });
                }

                this.setState({
                    editDialogOpen: false,
                    "id": '',
                    "function": '',
                    "message": '',
                    "level": 0,
                    "isChecked": false,
                });
            });
        }
    }

    handleOpenDeleteDialog = e => {
        this.setState({
            confirmationDialogOpen: true
        });
    }

    handleCloseConfirmationDialog = (e) => {
        this.setState({
            confirmationDialogOpen: false
        });
    }

    handleDelete = e => {
        if (this.state.id) {
            this.props.deleteError(this.state.id).then(res => {
                if (!_.isEmpty(res)) {
                    this.props.getErrorsList({
                        limit: this.state.rowsPerPage,
                    });
                }

                this.setState({
                    confirmationDialogOpen: false,
                    editDialogOpen: false,
                    "id": '',
                    "function": '',
                    "message": '',
                    "level": 0,
                    "isChecked": false,
                });
            });
        }

        
    }

    render() {
        const { classes, errorsList } = this.props;

        return (
            <SettingContainer history={this.props.history} location={this.props.location}>
                <div>
                    <Typography variant="display1" gutterBottom>Errors List</Typography>

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
                                    <TableCell>Function</TableCell>
                                    <TableCell>Message</TableCell>
                                    <TableCell>Level</TableCell>
                                    <TableCell>Checked or not</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    _.isEmpty(errorsList) 
                                        ? <TableRow></TableRow>
                                        : errorsList.map((err, index) => (
                                            <TableRow hover key={err._id}
                                                onClick={e => this.handleRowClick(e, err)}
                                            >
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{err.function}</TableCell>
                                                <TableCell>{err.message}</TableCell>
                                                <TableCell>{err.level}</TableCell>
                                                <TableCell>{err.isChecked ? "yes": "no"}</TableCell>
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

                    <div>
                        <Dialog
                            fullWidth
                            open={this.state.editDialogOpen}
                            onClose={this.handleDialogClose}
                            aria-labelledby="error-dialog-title"
                            aria-describedby="error-dialog-description"
                        >
                            <DialogTitle id="error-dialog-title">
                                <Grid container justify="space-between" alignItems="flex-start">
                                    <Grid item>
                                        Error
                                    </Grid>
                                    <Grid item>
                                        <Button 
                                            color="secondary"
                                            size="small" 
                                            onClick={this.handleOpenDeleteDialog}
                                        >
                                            Delete
                                        </Button>
                                    </Grid>
                                </Grid>
                            </DialogTitle>

                            <DialogContent>
                                <Grid container spacing={16}>
                                    <Grid item xs={6}>
                                        <TextField 
                                            fullWidth 
                                            disabled
                                            id="function" 
                                            label="Function" 
                                            margin="normal" 
                                            name="function" 
                                            value={this.state.function} 
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') this.handleSubmit();
                                            }} 
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField 
                                            fullWidth 
                                            disabled
                                            id="message" 
                                            label="Error Message" 
                                            margin="normal" 
                                            name="message"
                                            value={this.state.message} 
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') this.handleSubmit();
                                            }} 
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField 
                                            fullWidth 
                                            disabled
                                            id="level" 
                                            label="Error Level" 
                                            margin="normal" 
                                            name="level"
                                            value={this.state.level} 
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') this.handleSubmit();
                                            }} 
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <FormControl margin="normal">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={this.state.isChecked}
                                                        onChange={this.handleSwitch}
                                                        color="primary"
                                                        value="checked"
                                                    />
                                                }
                                            label="Checked or Not"
                                           />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </DialogContent>

                            <DialogActions>
                                <Button 
                                    size="small"
                                    onClick={this.handleDialogClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="small"
                                    color="primary"
                                    onClick={this.handleSubmit}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') this.handleSubmit();
                                    }}
                                >
                                    Save
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <ConfirmationDialog
                            title="Warning"
                            content={"Are your sure to delete <Error : " + this.state.function + '/' + this.state.message+ '> ?'}
                            open={this.state.confirmationDialogOpen}
                            handleClose={this.handleCloseConfirmationDialog}
                            operation={this.handleDelete}
                        />
                    </div>
                </div>
            </SettingContainer>        
        );
    };
}

ErrorsListPage.proptypes = {
    "classes": PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return {
      "errorsList": state.errorReducer.list,
      "totalCount": state.errorReducer.totalCount,
      "isFetching": state.errorReducer.isFetching,
    };
};

export default connect(mapStateToProps, { getErrorsList, eidtError, deleteError })(withStyles(styles)(ErrorsListPage))