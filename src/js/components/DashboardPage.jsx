import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// Custom Component
import SettingContainer from './layout/SettingContainer';

// Actions
import { getSearchesList } from '../actions/search.actions';
import { getErrorsList } from '../actions/error.actions';

const styles = (theme) => ({

});

class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.getSearchesList({ limit: 10 });
    this.props.getErrorsList({ limit: 10 });
  }

  render() {
    const { classes } = this.props;

    return (
      <SettingContainer>
        <div>
          <Typography variant="display1" gutterBottom>Dashboard</Typography>
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <Paper>
                <List subheader={<ListSubheader component="div">Top 10 Searches</ListSubheader> }>
                  {
                    this.props.seachesList.map((item) => (
                        <ListItem key={item._id}>
                            <ListItemText primary={item.query + ` (${item.weekCount})`} />
                        </ListItem>
                    ))
                  }
                </List>
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper>
                <List subheader={<ListSubheader component="div">Errors</ListSubheader> }>
                  {
                    this.props.errorsList.map((item) => (
                        <ListItem key={item._id}>
                            <ListItemText primary={item.function} />
                        </ListItem>
                    ))
                  }
                </List>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </SettingContainer>
    );
  }
}

DashboardPage.propTypes = {
  "classes": PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
    "isLoggedIn:": state.userReducer.isLoggedIn,
    "seachesList": state.searchReducer.list,
    "errorsList": state.errorReducer.list,
  };
};

export default connect(mapStateToProps, {
  getSearchesList,
  getErrorsList,
})(withStyles(styles)(DashboardPage));
