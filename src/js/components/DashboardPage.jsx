import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

// Custom Component
import SettingContainer from './layout/SettingContainer';
import LinkContainer from './utils/LinkContainer';

const styles = (theme) => ({

});

class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classes } = this.props;

    return (
      <SettingContainer>
        <div>
          <Typography variant="display1" gutterBottom>Dashboard</Typography>
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
  };
};

export default connect(mapStateToProps, {})(withStyles(styles)(DashboardPage));
