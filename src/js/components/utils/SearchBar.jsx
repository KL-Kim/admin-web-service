import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui-icons/Search';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit * 8,
  }
});

class SearchBar extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <form noValidate autoComplete="off" >
          <Grid container spacing={8} justify="center" alignItems="center">
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="adornment-password">Search</InputLabel>
                <Input
                  id="search"
                  type="text"
                  onChange={this.handleChange}
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
            </Grid>
          </Grid>
          <Grid container spacing={0} justify="center" alignItems="center">
            <Grid item xs={8}>
              <Grid container spacing={0} justify="center" alignItems="center">
                <Grid item xs={3}>
                  <Button color="primary">#Tag1</Button>
                </Grid>
                <Grid item xs={3}>
                  <Button color="primary">#Tag2</Button>
                </Grid>
                <Grid item xs={3}>
                  <Button color="primary">#Tag3</Button>
                </Grid>
                <Grid item xs={3}>
                  <Button color="primary">#Tag4</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(SearchBar);
