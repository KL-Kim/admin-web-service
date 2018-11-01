import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI Components
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

// Custom Components
import Container from './layout/Container';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 5,
    color: theme.palette.text.secondary
  }
});

class HomePage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Container>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography variant="display3" align="center">Welcome to iKoreaTown</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="body1" align="center">
                It's honor to be with you
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

HomePage.propTypes = {
  "classes": PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);
