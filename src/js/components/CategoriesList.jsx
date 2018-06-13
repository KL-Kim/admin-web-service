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
import FormControl from '@material-ui/core/FormControl';
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

// Material UI Icons
import Search from '@material-ui/icons/Search';

// Custom Components
import SettingContainer from './layout/SettingContainer';
import ConfirmationDialog from './utils/ConfirmationDialog';

// Actions
import {
  getCategoriesList,
  addNewCategory,
  updateCategory,
  deleteCategory
} from '../actions/category.actions.js';

const styles = (theme) => ({
  "container": {
    marginBottom: theme.spacing.unit,
  },
  "buttonContainer": {
    "display": "flex",
    "justifyContent": "flex-end",
  },
  "button": {
    margin: theme.spacing.unit,
  },
});

class CategoryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "AddNewDiaglogOpen": false,
      "confirmationDialogOpen": false,
      "search": '',
      "list": {},
      "isNew": false,
      "_id": '',
      "code": '',
      "enName": '',
      "krName": '',
      "cnName": '',
      'parent': '',
    };

    this.handleAddNew = this.handleAddNew.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOpenDeleteDialog = this.handleOpenDeleteDialog.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleCloseConfirmationDialog = this.handleCloseConfirmationDialog.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.props.getCategoriesList();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.categoriesList) {
      this.setState({
        list: nextProps.categoriesList
      });
    }

  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleRowClick(e, category) {
    this.setState({
      _id: category._id,
      code: category.code,
      krName: category.krName,
      cnName: category.cnName,
      enName: category.enName,
      parent: category.parent || '',
      AddNewDiaglogOpen: true,
    });
  }

  handleOpenDeleteDialog() {
    this.setState({
      confirmationDialogOpen: true,
      AddNewDiaglogOpen: false,
    });
  }

  handleDelete() {
    if (this.state._id) {
      this.props.deleteCategory(this.state._id).then(response => {
        if (response) {
          this.setState({
            AddNewDiaglogOpen: false,
            confirmationDialogOpen: false,
            "isNew": false,
            "_id": '',
            "code": '',
            "enName": '',
            "krName": '',
            "cnName": '',
            'parent': '',
          });
        }
      });
    }
  }

  handleAddNew() {
    this.setState({
      "AddNewDiaglogOpen": true,
      "isNew": true,
      "_id": '',
      "code": '',
      "enName": '',
      "krName": '',
      "cnName": '',
      'parent': '',
    });
  }

  handleDialogClose() {
    this.setState({
      AddNewDiaglogOpen: false,
      "isNew": false,
      "_id": '',
      "code": '',
      "enName": '',
      "krName": '',
      "cnName": '',
      'parent': '',
    });
  }

  handleCloseConfirmationDialog() {
    this.setState({
      confirmationDialogOpen: false,
    });
  }

  handleSearch(e) {
    e.preventDefault();
    const { search } = this.state;

    this.props.getCategoriesList(search);
  }

  handleSubmit() {
    const { _id, code, enName, krName, cnName, parent, isNew } = this.state;

    if (code && enName && krName && cnName) {
      if (isNew) {
        this.props.addNewCategory({
          code: code,
          enName: enName,
          krName: krName,
          cnName: cnName,
          parent: parent,
        });
      } else {
        this.props.updateCategory({
          _id: _id,
          code: code,
          enName: enName,
          krName: krName,
          cnName: cnName,
          parent: parent,
        });
      }
    }

    this.setState({
      AddNewDiaglogOpen: false,
      isNew: false,
    });
  }

  render() {
    const { classes } = this.props;
    const { code, enName, krName, cnName, isNew } = this.state;

    return (
      <SettingContainer history={this.props.history} location={this.props.location}>
        <div>
          <Typography variant="display1" gutterBottom>
            Category List
          </Typography>

          <Grid container spacing={16} className={classes.container}>
            <Grid item xs={4}>
              <form onSubmit={this.handleSearch}>
                <FormControl fullWidth>
                  <Input
                    id="search"
                    type="text"
                    name="search"
                    placeholder="Search"
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
            <Grid item xs={8}>
              <div className={classes.buttonContainer}>
                <Button variant="raised" color="primary" aria-label="add" size="large" onClick={this.handleAddNew}>
                  Add New
                </Button>
              </div>
            </Grid>
          </Grid>

          <Paper>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>한국어</TableCell>
                  <TableCell>中文名</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Parent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  _.isEmpty(this.state.list) ? (<TableRow></TableRow>)
                  : this.state.list.map((c, index) => (

                      <TableRow hover key={index}
                        onClick={e => this.handleRowClick(e, c)}
                      >
                        <TableCell>{c.code}</TableCell>
                        <TableCell>{c.krName}</TableCell>
                        <TableCell>{c.cnName}</TableCell>
                        <TableCell>{c.enName}</TableCell>
                        <TableCell>{c.parent}</TableCell>
                      </TableRow>

                  ))
                }
              </TableBody>
            </Table>
          </Paper>

          <Dialog
            open={this.state.AddNewDiaglogOpen}
            onClose={this.handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              <Grid container>
                <Grid item xs={6}>
                  Category
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.buttonContainer}>
                    <Button color="secondary" disabled={!(code && enName && krName && cnName) || isNew} onClick={this.handleOpenDeleteDialog}>
                      Delete
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={16}>
                <Grid item xs={6}>
                  <TextField fullWidth id="code" label="Code" margin="normal" name="code" onChange={this.handleChange} value={this.state.code} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth id="enName" label="English" margin="normal" name="enName" onChange={this.handleChange} value={this.state.enName} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth id="krName" label="한국어" margin="normal" name="krName" onChange={this.handleChange} value={this.state.krName} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth id="cnName" label="中文名" margin="normal" name="cnName" onChange={this.handleChange} value={this.state.cnName} />
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="parent">Parent</InputLabel>
                    <Select native
                      name="parent"
                      value={this.state.parent}
                      onChange={this.handleChange}
                      input={<Input id="parent" />}
                    >
                      <option value="" />
                        {_.isEmpty(this.state.list) ? '' : this.state.list.map(item => (
                          <option key={item.code} value={item.code}>{item.krName}</option>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                variant="raised"
                color="primary"
                disabled={!(code && enName && krName && cnName)}
                onClick={this.handleSubmit}
              >
                Save
              </Button>
              <Button color="primary" onClick={this.handleDialogClose}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <ConfirmationDialog
            open={this.state.confirmationDialogOpen}
            handleClose={this.handleCloseConfirmationDialog}
            operation={this.handleDelete}
            title="Warning"
            content="Are your sure to delete the category?"
          />
        </div>
      </SettingContainer>
    );
  }
}

CategoryList.propTypes = {
  "classes": PropTypes.object.isRequired,
  "history": PropTypes.object.isRequired,
  "categoriesList": PropTypes.array.isRequired,
  "totalCount": PropTypes.number.isRequired,
  "isFetching": PropTypes.bool.isRequired,
  "getCategoriesList": PropTypes.func.isRequired,
  "addNewCategory": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "categoriesList": state.categoryReducer.categoriesList,
    "totalCount": state.categoryReducer.totalCount,
    "isFetching": state.categoryReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getCategoriesList, addNewCategory, updateCategory, deleteCategory })(withStyles(styles)(CategoryList));
