import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Material UI Components
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  footer: {
    padding: theme.spacing.unit * 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: theme.palette.background.appBar,
    paddingLeft: theme.spacing.unit * 16,
    paddingRight: theme.spacing.unit * 16,
  }
});

class Footer extends Component{
  render() {
    const { classes } = this.props;
    return (
      <footer className={classes.footer}>
        <Grid container spacing={16} justify="space-between" alignItems="center" >
          <Grid item xs={8}>
            <Grid container spacing={16}>
              <Grid item xs={2}>
                <Link to="/about">About us</Link>
              </Grid>
              <Grid item xs={2}>
                <Link to="/license">Licenses</Link>
              </Grid>
              <Grid item xs={2}>
                <Link to="/terms-policy">Terms & Policy</Link>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Typography type="caption" align="right">
              Copyright 2018 iKoreaTown
            </Typography>
          </Grid>
        </Grid>
      </footer>
    );
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Footer);
