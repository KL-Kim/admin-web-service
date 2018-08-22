import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

// Material UI Component
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';

const styles = (theme) => ({
  "button": {
    "margin": theme.spacing.unit,
    "width": 100,
  },
});

class ConfirmationDialog extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.props.operation();
  }

  render() {
    const { classes } = this.props;

    return (
      <Dialog fullWidth
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {this.props.title}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description" >
            {this.props.content}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={this.props.handleClose} className={classes.button}>
            Cancel
          </Button>
          <Button color="primary" variant="raised" onClick={this.handleSubmit} className={classes.button}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ConfirmationDialog.propTypes = {
  "classes": PropTypes.object.isRequired,
  "open": PropTypes.bool.isRequired,
  "title": PropTypes.string.isRequired,
  "content": PropTypes.string.isRequired,
  "handleClose": PropTypes.func.isRequired,
  "operation": PropTypes.func.isRequired,
}

export default withRouter(withStyles(styles)(ConfirmationDialog));
