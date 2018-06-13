import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import { FormControl, FormControlLabel, FormLabel, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import TextField from 'material-ui/TextField';

const styles = theme => ({
  "button": {
    marginRight: theme.spacing.unit,
  }
});

class ContactDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      contact: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.hanldeSubmit = this.hanldeSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleClose() {
    this.setState({
      content: '',
      contact: '',
    });
    this.props.handleClose();
  }

  hanldeSubmit() {
    this.props.handleSubmit(this.state.content, this.state.contact);
  }

  render() {
    const { classes } = this.props;

    return (
      <Dialog fullWidth
        open={this.props.open}
        onClose={this.handleClose}
        aria-labelledby="report-dialog-title"
        aria-describedby="report-dialog-description"
      >
        <DialogTitle id="report-dialog-title">
          Report
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <FormControl fullWidth >
                <InputLabel htmlFor="contact">Contact</InputLabel>
                <Input
                  type="text"
                  id="contact"
                  name="contact"
                  value={this.state.contact}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormHelperText id="contact-helper-text">Please givs us your contact information, so we can contact you</FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="content">Content</InputLabel>
                <Input
                  type="text"
                  id="content"
                  multiline
                  rows={10}
                  name="content"
                  value={this.state.content}
                  onChange={this.handleChange}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button raised color="primary" onClick={this.hanldeSubmit}>
            Send
          </Button>
          <Button color="primary" onClick={this.handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ContactDialog.propTypes = {
  "classes": PropTypes.object.isRequired,
  "open": PropTypes.bool.isRequired,
  "param": PropTypes.string.isRequired,
  "handleSubmit": PropTypes.func.isRequired,
  "handleClose": PropTypes.func.isRequired,
};

export default withStyles(styles)(ContactDialog);
