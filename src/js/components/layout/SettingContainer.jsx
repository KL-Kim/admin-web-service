import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import withStyles from '@material-ui/core/styles/withStyles';

import Header from './Header';
import SettingFooter from './SettingFooter';
import Sidebar from './Sidebar';
import Alert from '../utils/Alert';

import { logout } from '../../actions/user.actions';

const styles = (theme) => ({
  root: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  content: {
    width: '100%',
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    minHeight: `calc(100vh - 112px)`,
    marginTop: 64,
    marginLeft: 260,
    marginBottom: 48
  },
});

class SettingContainer extends Component {
  componentWillReceiveProps(nextProps, nextState) {
    if (process.env.REACT_APP_ENV !== 'DEVELOPMENT') {
      if (!nextProps.isLoggedIn) {
        this.props.history.push('/404');
      }
    }
  }

  render() {
    const { classes, isLoggedIn, user, logout, updatedAt } = this.props;

    return (
      <div className={classes.root}>
        <Header
          user={user}
          isLoggedIn={isLoggedIn}
          logout={logout}
          updatedAt={updatedAt}
        />
        <Sidebar user={user} match={this.props.match} />
        <div className={classes.appFrame}>
          <main className={classes.content}>
            {this.props.children}
            <SettingFooter />
          </main>
        </div>
        <Alert />
      </div>
    );
  }
}

SettingContainer.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  user: PropTypes.object,
  updatedAt: PropTypes.number,
  isLoggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "updatedAt": state.userReducer.updatedAt,
    "isLoggedIn": state.userReducer.isLoggedIn,
  };
};

export default withRouter(connect(mapStateToProps, { logout })(withStyles(styles)(SettingContainer)));
