import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit,
  }
});

class CategoryBar extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={24} justify="center" alignItems="center">
          <Grid item xs={3}>
            <Button color="primary">Category1</Button>
          </Grid>
          <Grid item xs={3}>
            <Button color="primary">Category2</Button>
          </Grid>
          <Grid item xs={3}>
            <Button color="primary">Category3</Button>
          </Grid>
          <Grid item xs={3}>
            <Button color="primary">Category4</Button>
          </Grid>
          <Grid item xs={3}>
            <Button color="primary">Category5</Button>
          </Grid>
          <Grid item xs={3}>
            <Button color="primary">Category6</Button>
          </Grid>
          <Grid item xs={3}>
            <Button color="primary">Category7</Button>
          </Grid>
          <Grid item xs={3}>
            <Button color="primary">Category8</Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(CategoryBar);
