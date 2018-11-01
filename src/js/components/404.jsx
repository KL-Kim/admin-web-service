import React, { Component } from 'react';

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

class NotFoundPage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Container>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography variant="display3" align="center">404 Not found</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="body1" align="center">
                You can search here.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );


  }
}

export default withStyles(styles)(NotFoundPage);
