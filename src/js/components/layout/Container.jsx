import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';

// Custom Components
import Header from './Header';
import Footer from './Footer';
import Alert from '../utils/Alert';

// Actions
import { logout } from '../../actions/user.actions';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    width: 'auto',
    height: '100%',
    marginTop: theme.spacing.unit * 12,
    marginLeft: theme.spacing.unit * 16,
    marginRight: theme.spacing.unit * 16,
    paddingBottom: theme.spacing.unit * 10,
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }
});

class Container extends Component {
  render() {
    const { classes, isLoggedIn, user, updatedAt, logout } = this.props;

    return (
      <div className={classes.root}>
        <Header
          user={user}
          isLoggedIn={isLoggedIn}
          updatedAt={updatedAt}
          logout={logout}
          getNotification={this.props.getNotification}
        />
        <main className={classes.appFrame}>
          {this.props.children}
        </main>
        <Footer />
        <Alert />
      </div>
    );
  }
}

Container.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  user: PropTypes.object,
  updatedAt: PropTypes.number,
  isLoggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "updatedAt": state.userReducer.updatedAt,
  };
};

export default connect(mapStateToProps, { logout })(withStyles(styles)(Container));
