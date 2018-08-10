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

// Custom Component
import SettingContainer from './layout/SettingContainer';
import ConfirmationDialog from './utils/ConfirmationDialog';

// Actions
import {
  getTagsList,
  addNewTag,
  updateTag,
  deleteTag
} from '../actions/tag.actions.js';

const styles = (theme) => ({

});

class TagsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "AddNewDiaglogOpen": false,
      "confirmationDialogOpen": false,
      "search": '',
      "isNew": false,
      "_id": '',
      "code": '',
      "enName": '',
      "krName": '',
      "cnName": '',
      "orderBy": 'priority',
    };

    this.handleAddNewDialogOpen = this.handleAddNewDialogOpen.bind(this);
    this.handleAddNewDialogClose = this.handleAddNewDialogClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOpenDeleteDialog = this.handleOpenDeleteDialog.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleCloseConfirmationDialog = this.handleCloseConfirmationDialog.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    this.props.getTagsList({
      "orderBy": this.state.orderBy,
    });
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleOpenDeleteDialog() {
    this.setState({
      confirmationDialogOpen: true,
      AddNewDiaglogOpen: false,
    });
  }

  handleAddNewDialogOpen() {
    this.setState({
      "AddNewDiaglogOpen": true,
      "isNew": true,
      "_id": '',
      "code": '',
      "enName": '',
      "krName": '',
      "cnName": '',
      'priority': 0,
    });
  }

  handleAddNewDialogClose() {
    this.setState({
      AddNewDiaglogOpen: false,
      "isNew": false,
    });
  }

  handleRowClick(e, tag) {
    this.setState({
      _id: tag._id,
      code: tag.code,
      krName: tag.krName,
      cnName: tag.cnName,
      enName: tag.enName,
      priority: tag.priority,
      AddNewDiaglogOpen: true,
    });
  }

  handleSearch(e) {
    e.preventDefault();

    this.props.getTagsList({
      search: this.state.search,
      "orderBy": this.state.orderBy,
    });
  }

  handleSubmit() {
    const { _id, code, enName, krName, cnName, priority, isNew, search } = this.state;

    if (code && enName && krName && cnName) {
      if (isNew) {
        this.props.addNewTag({
          code,
          enName,
          krName,
          cnName,
          priority,
        }).then(response => {
          if (response) {
            this.props.getTagsList({
              search,
              "orderBy": this.state.orderBy,
            });
          }
        });
      } else {
        this.props.updateTag({
          _id,
          code,
          enName,
          krName,
          cnName,
          priority,
        }).then(response => {
          if (response) {
            this.props.getTagsList({
              search,
              "orderBy": this.state.orderBy,
            });
          }
        });
      }
    }

    this.setState({
      AddNewDiaglogOpen: false,
      isNew: false,
    });
  }

  handleCloseConfirmationDialog() {
    this.setState({
      confirmationDialogOpen: false,
    });
  }

  handleDelete() {
    if (this.state._id) {
      this.props.deleteTag(this.state._id)
        .then(response => {
          if (response) {
            this.props.getTagsList({
              search: this.state.search,
              "orderBy": this.state.orderBy,
            });

            this.setState({
              AddNewDiaglogOpen: false,
              confirmationDialogOpen: false,
              "isNew": false,
              "_id": '',
              "code": '',
              "enName": '',
              "krName": '',
              "cnName": '',
            });
          }
      });
    }
  }

  handleSort(e) {
    const { value } = e.target;

    this.props.getTagsList({
      search: this.state.search,
      orderBy: value
    })
    .then(response => {
      if (response) {
        this.setState({
          orderBy: value
        });
      }
    });
  }

  render() {
    const { classes, tagsList } = this.props;
    const { code, enName, krName, cnName, isNew } = this.state;

    return (
      <SettingContainer history={this.props.history} location={this.props.location}>
        <div>
          <Typography variant="display1" gutterBottom>
            Tags List
          </Typography>

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
          
          <br />

          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <FormControl fullWidth >
                <FormLabel component="label">Sort</FormLabel>
                <RadioGroup
                  row
                  aria-label="orderBy"
                  name="orderBy"
                  value={this.state.orderBy}
                  onChange={this.handleSort}
                >
                  <FormControlLabel value="" control={<Radio />} label="Default" />
                  <FormControlLabel value="priority" control={<Radio />} label="Priority" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item>
              <div className={classes.buttonContainer}>
                <Button 
                  variant="raised" 
                  color="primary" 
                  aria-label="add" 
                  onClick={this.handleAddNewDialogOpen}
                >
                  New
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
                  <TableCell>Priority</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  _.isEmpty(tagsList) ? (<TableRow></TableRow>)
                  : tagsList.map((item) => (

                      <TableRow hover key={item._id}
                        onClick={event => this.handleRowClick(event, item)}
                      >
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{item.krName}</TableCell>
                        <TableCell>{item.cnName}</TableCell>
                        <TableCell>{item.enName}</TableCell>
                        <TableCell>{item.priority}</TableCell>
                      </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </Paper>

          <Dialog
            fullWidth
            maxWidth="sm"
            open={this.state.AddNewDiaglogOpen}
            onClose={this.handleAddNewDialogClose}
            aria-labelledby="tag-dialog-title"
            aria-describedby="tag-dialog-description"
          >
            <DialogTitle id="tag-dialog-title">
              <Grid container justify="space-between" alignItems="flex-start">
                <Grid item>
                  Tag
                </Grid>
                <Grid item>
                  <Button 
                    color="secondary" 
                    size="small"
                    disabled={!(code && enName && krName && cnName) || isNew} 
                    onClick={this.handleOpenDeleteDialog}
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </DialogTitle>

            <DialogContent id="tag-dialog-description">
              <Grid container spacing={16}>
                <Grid item xs={6}>
                  <TextField 
                    fullWidth 
                    id="code" 
                    label="Code" 
                    margin="normal" 
                    name="code" 
                    value={this.state.code} 
                    onChange={this.handleChange} 
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') this.handleSubmit();
                    }} 
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    fullWidth 
                    id="enName" 
                    label="English" 
                    margin="normal" 
                    name="enName" 
                    value={this.state.enName}
                    onChange={this.handleChange} 
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') this.handleSubmit();
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    fullWidth 
                    id="krName" 
                    label="한국어" 
                    margin="normal" 
                    name="krName" 
                    value={this.state.krName} 
                    onChange={this.handleChange} 
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') this.handleSubmit();
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    fullWidth 
                    id="cnName" 
                    label="中文名" 
                    margin="normal" 
                    name="cnName" 
                    value={this.state.cnName}
                    onChange={this.handleChange}  
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') this.handleSubmit();
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    fullWidth 
                    id="priority" 
                    label="Priority" 
                    margin="normal" 
                    name="priority" 
                    value={this.state.priority}
                    onChange={this.handleChange} 
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') this.handleSubmit();
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button 
                size="small"
                onClick={this.handleAddNewDialogClose}>
                Cancel
              </Button>
              <Button 
                color="primary" 
                size="small"
                disabled={!(code && enName && krName && cnName)} 
                onClick={this.handleSubmit}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          <ConfirmationDialog
            title="Warning"
            content={"Are your sure to delete <Tag: " + this.state.krName + '> ?'}
            open={this.state.confirmationDialogOpen}
            handleClose={this.handleCloseConfirmationDialog}
            operation={this.handleDelete}
          />
        </div>
      </SettingContainer>
    );
  }
}

TagsList.propTypes = {
  "classes": PropTypes.object.isRequired,
  "history": PropTypes.object.isRequired,
  "admin": PropTypes.object.isRequired,
  "getTagsList": PropTypes.func.isRequired,
  "updateTag": PropTypes.func.isRequired,
  "deleteTag": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
    "tagsList": state.tagReducer.tagsList,
    "isFetching": state.tagReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getTagsList, addNewTag, updateTag, deleteTag })(withStyles(styles)(TagsList));
