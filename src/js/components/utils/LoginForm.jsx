import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import validator from 'validator';

// Material UI Components
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

// Material UI Icons
import Error from '@material-ui/icons/Error';

import config from '../../config/config';
import { loadFromStorage, saveToStorage } from '../../helpers/webStorage';
import webStorageTypes from '../../constants/webStorage.types';

const styles = (theme) => ({
  button: {
    marginTop: theme.spacing.unit * 4,
  },
});

const passwordMinLength = config.passwordMinLength;

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "email": {
        "value": '',
        "showError": false,
        "errorMessage": '',
      },
      "password": {
        "value": '',
        "showError": false,
        "errorMessage": '',
      },
      "waitUntil": null,
      "goodToGo": true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValidEmail = this.isValidEmail.bind(this);
    this.isValidPassword = this.isValidPassword.bind(this);
    this.handleTimeout = this.handleTimeout.bind(this);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.loginError) {
      this.setState({
        password: {
          value: this.state.password.value,
          showError: true,
          errorMessage: nextProps.errorMessage
        }
      });
    }
  }

  handleChange(e) {
    const { name, value } = e.target;

    if (_.isEqual('email', name)) {
      this.setState({
        email: {
          value: value,
          showError: false,
          errorMessage: ''
        }
      });
    }

    if (_.isEqual('password', name)) {
      this.setState({
        password: {
          value: value,
          showError: false,
          errorMessage: ''
        }
      });
    }
  }

  isValidEmail() {
    if (!this.state.email.value || !validator.isEmail(this.state.email.value)) {
      this.setState({
        email: {
          value: this.state.email.value,
          showError: true,
          errorMessage: 'Error: Input a valid Email'
        },
      });
      return false;
    } else {
      this.setState({
        email: {
          value: this.state.email.value,
          showError: false,
          errorMessage: ''
        },
      });
      return true;
    }
  }

  isValidPassword() {
    if (this.state.password.value.length < passwordMinLength) {
      this.setState({
        password: {
          value: this.state.password.value,
          showError: true,
          errorMessage: 'Should not be shorter than ' + passwordMinLength,
        },
      });
      return false;
    } else {
      this.setState({
        password: {
          value: this.state.password.value,
          showError: false,
          errorMessage: ''
        },
      });
      return true;
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const { email, password } = this.state;

    let loginFailedCount = loadFromStorage(webStorageTypes.WEB_STORAGE_LOGIN_FAILED);

    if (loginFailedCount >= 5) {
      let time = 30;
      var nInverId = setInterval(() => {
        time = time - 1;

        this.setState({
          "waitUntil": time,
        });
        console.log("You can try after " + time);

        if (time < 1) {
          clearInterval(nInverId);
          saveToStorage(webStorageTypes.WEB_STORAGE_LOGIN_FAILED, 0);
          this.setState({
            "goodToGo": true
          });
        }
      }, 1000);

      this.setState({
         "goodToGo": false
      });
    }

    if (this.isValidEmail() && this.isValidPassword() && (loginFailedCount <= 5)) {
      this.props.login(email.value, password.value);
    }
  }

  handleTimeout() {

    this.setState({
      captcha: false,
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <Typography variant="display1" align="center">Sign In</Typography>
        <FormControl fullWidth>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            type="text"
            id="email"
            name="email"
            error={this.state.email.showError}
            onBlur={this.isValidEmail}
            onChange={this.handleChange}
            endAdornment={
              this.state.email.showError
                ? (<InputAdornment position="end">
                    <Error color="secondary"/>
                  </InputAdornment>)
                : ''
            }
          />
          <FormHelperText id="email-helper-text" error>{this.state.email.showError ? this.state.email.errorMessage : ' '}</FormHelperText>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            type="password"
            id="password"
            name="password"
            error={this.state.password.showError}
            onBlur={this.isValidPassword}
            onChange={this.handleChange}
            endAdornment={
              this.state.password.showError
                ? (<InputAdornment position="end">
                    <Error color="secondary"/>
                  </InputAdornment>)
                : ''
            }
          />
          <FormHelperText id="password-helper-text" error>
            {this.state.password.showError ? this.state.password.errorMessage : ' '}
          </FormHelperText>
        </FormControl>
        <Button
          fullWidth
          variant="raised"
          name="signin"
          disabled={this.state.email.showError || this.state.password.showError || this.props.isFetching || !this.state.goodToGo}
          className={classes.button}
          color="primary"
          type="submit"
        >
        {
          this.props.isFetching
          ? (<CircularProgress size={20} />)
          : this.state.waitUntil ? "Wait " + this.state.waitUntil : ('Sign in')
        }
        </Button>
      </form>
    );
  }
}

LoginForm.propTypes = {
  isFetching: PropTypes.bool,
  loginError: PropTypes.bool,
  errorMessage: PropTypes.string,
  login: PropTypes.func.isRequired,
};

export default withStyles(styles)(LoginForm);
