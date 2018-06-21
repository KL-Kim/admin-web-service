/**
 * User Actions
 */
import _ from 'lodash';

import * as AlertActions from './alert.actions';
import userTypes from '../constants/user.types';
import emailTypes from '../constants/email.types';
import webStorageTypes from '../constants/webStorage.types.js';
import {
  getMyselfFetch,
} from '../api/user.service';
import { getToken, loginFetch, logoutFetch, requestSendEmailFetch } from '../api/auth.service';
import { saveToStorage, removeFromStorage } from '../helpers/webStorage';

/**
 * Login
 * @param {String} email - User's email
 * @param {String} password - User's password
 */
export const login = (email, password) => {
  const _requestLogin = () => ({
      "type": userTypes.LOGIN_REQUEST,
      "meta": {},
      "error": null,
      "payload": {}
    }
  );

  const _loginSuccess = user => ({
    "type": userTypes.LOGIN_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user,
    }
  });

  const _loginFailure = error => ({
    "type": userTypes.LOGIN_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(email) || _.isEmpty(password)) {
      return dispatch(AlertActions.alertFailure("Email and passwords should not be empty"));
    }

    dispatch(_requestLogin());

    return loginFetch(email, password)
      .then(response => {
        saveToStorage(webStorageTypes.WEB_STORAGE_LOGIN_FAILED, 0);

        if (response.token) {
          saveToStorage(webStorageTypes.WEB_STORAGE_TOKEN_KEY, response.token);
        }

        if (response.user) {
          saveToStorage(webStorageTypes.WEB_STORAGE_USER_KEY, response.user._id);
          saveToStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR, response.user.favors);
          dispatch(_loginSuccess(response.user));
        }

        dispatch(AlertActions.alertSuccess("Welcome back!"));

        return response;
      }).catch(err => {
        dispatch(_loginFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
};


/**
 * Get user own data
 * @param {String} id - User's id
 */
export const getMyself = (id) => {
  const _getMyselfRequest = () => ({
    "type": userTypes.GET_MYSELF_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getMyselfSuccess = (user) => ({
    "type": userTypes.GET_MYSELF_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    }
  });

  const _getMyselfFailure = (error) => ({
    "type": userTypes.GET_MYSELF_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    return getToken()
      .then(token => {
        dispatch(_getMyselfRequest());
        return getMyselfFetch(token, id);
      })
      .then(user => {
        dispatch(_getMyselfSuccess(user));

        return user;
      }).catch(err => {
        dispatch(_getMyselfFailure(err));

        return ;
      });
  };
}

/**
 * Log out
 */
export const logout = () => {
  const _logoutRequest = () => ({
    "type": userTypes.LOGOUT_REQUEST,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _logoutSuccess = () => ({
    "type": userTypes.LOGOUT_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _logoutFailure = (error) => ({
    "type": userTypes.LOGOUT_FAILURE,
    "meta": {},
    "error": error,
    "payload": {},
  });

  return (dispatch, getState) => {
    dispatch(_logoutRequest);
    removeFromStorage(webStorageTypes.WEB_STORAGE_TOKEN_KEY);
    removeFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);
    removeFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR);

    return logoutFetch()
      .then(response => {
        dispatch(_logoutSuccess());
        dispatch(AlertActions.alertSuccess("Log out successfully"));

        return response;
      })
      .catch(err => {
        dispatch(_logoutFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
};

/**
 * Send email
 * @param {String} type - email type
 * @param {String} email - user's email
 */
export const sendEmail = (type, email) => {
  const _requestSendEmail = () => ({
    "type": emailTypes.SEND_EMAIL_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _sendEmailSuccess = () => ({
    "type": emailTypes.SEND_EMAIL_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _sendEmailFailure = (error) => ({
    "type": emailTypes.SEND_EMAIL_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    let err;

    if (_.isEmpty(type) || _.isEmpty(email)) {
      err = new Error("Bad requset");
      dispatch(AlertActions.alertFailure(err.message));
      return Promise.reject(err);
    }

    dispatch(_requestSendEmail());
    return requestSendEmailFetch(type, email)
      .then(res => {
        dispatch(_sendEmailSuccess());
        dispatch(AlertActions.alertSuccess("Send email successfully"));

        return res;
      }).catch(err => {
        dispatch(_sendEmailFailure());
        dispatch(AlertActions.alertFailure("Send email failed"));

        return ;
      });
  };
};
