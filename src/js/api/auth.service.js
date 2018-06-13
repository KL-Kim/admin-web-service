import fetch from 'cross-fetch';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import config from '../config/config';
import emailTypes from '../constants/email.types';
import { loadFromStorage, saveToStorage } from '../helpers/webStorage';
import webStorageTypes from '../constants/webStorage.types';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * Auth serivce uri
 */
const authServiceUri = {
  loginUrl: config.API_GATEWAY_ROOT + '/api/v1/auth/login',
  logoutUrl: config.API_GATEWAY_ROOT + '/api/v1/auth/logout',
  getNewTokenUrl: config.API_GATEWAY_ROOT + '/api/v1/auth/token',
  sendEmailVerificationUrl: config.API_GATEWAY_ROOT + '/api/v1/auth/mail/verify',
  sendChangePasswordEmailUrl: config.API_GATEWAY_ROOT + '/api/v1/auth/mail/password',
  sendPhoneVerificationCodeUrl: config.API_GATEWAY_ROOT + '/api/v1/auth/phoneVerificationCode',
};

/**
 * Fetch new token
 */
const newTokenFetch = () => {
  const options = {
    "method": 'GET',
    "headers": {
      'Content-Type': 'application/json',
    },
    "credentials": "include",
  };

  return fetch(authServiceUri.getNewTokenUrl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(res => {
      console.log("Get new token");
      saveToStorage(webStorageTypes.WEB_STORAGE_TOKEN_KEY, res.token);
      return res.token;
    })
    .catch(err => {
      return Promise.reject(err);
  });
};

/**
 * Get token from webStorage or server
 */
export const getToken = () => {
  return new Promise((resolve, reject) => {
    // Get token form webStorage
    const token = loadFromStorage(webStorageTypes.WEB_STORAGE_TOKEN_KEY);
    const decoded = _.isEmpty(token) ? null : jwt.decode(token, {});
    const now = _.now();

    if (_.isEmpty(decoded) || decoded.exp * 1000 < now) {
      newTokenFetch()
        .then(accessToken => {
          return resolve(accessToken);
        })
        .catch(err => {
          return reject(err);
      });
    } else {
      return resolve(token);
    }
  });
};

/**
 * Fetch login
 * @param {String} email - User's email
 * @param {String} password - User's password
 */
export const loginFetch = (email, password) => {
  const options = {
    "method": 'POST',
    "headers": {
      "Accept": "application/json",
      'Content-Type': 'application/json',
    },
    "credentials": 'include',
    "body": JSON.stringify({ email, password }),
  };

  return fetch(authServiceUri.loginUrl, options)
    .then(response => {
      if (response.ok) {
        saveToStorage(webStorageTypes.WEB_STORAGE_LOGIN_FAILED, 0);
        return response.json();
      } else {
        let error = new Error(response.statusText);
        error.status = response.status;

        if (response.status === 401) {
          error.message = "Invalid email or password";
          const loginFailedCount = loadFromStorage(webStorageTypes.WEB_STORAGE_LOGIN_FAILED);
          saveToStorage(webStorageTypes.WEB_STORAGE_LOGIN_FAILED, loginFailedCount + 1);

        } else {
          error.message = "Unknown Server Error";
        }

        return Promise.reject(error);
      }
    })
    .then(json => {
      if (json.token) {
        saveToStorage(webStorageTypes.WEB_STORAGE_TOKEN_KEY, json.token);
      }

      if (json.user) {
        saveToStorage(webStorageTypes.WEB_STORAGE_USER_KEY, json.user._id);
        saveToStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR, json.user.favors);
        return json.user;
      } else {
        const err = new Error("Bad Response");
        return Promise.reject(err);
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Fetch log out
 */
export const logoutFetch = () => {
  const options = {
    "method": 'GET',
    "headers": {
      "Accept": "application/json",
      'Content-Type': 'application/json',
    },
    "credentials": 'include',
  };

  return fetch(authServiceUri.logoutUrl, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    }).catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Request sending changing password email
 * @param {String} type - Email type
 * @param {String} email - User's email
 */
export const requestSendEmailFetch = (type, email) => {
  const options = {
    "method": 'GET',
    "headers": {
      'Content-Type': 'application/json',
    },
  };

  let url;

  switch (type) {
    case emailTypes.CHANGE_PASSWORD:
      url = authServiceUri.sendChangePasswordEmailUrl
      break;

    case emailTypes.ACCOUNT_VERIFICATION:
      url = authServiceUri.sendEmailVerificationUrl
      break;

    default:
      return Promise.reject(new Error("Type missing"));
  }

  return fetch(url + '/' + email, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    }).catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Request sending phone verification code
 * @param {String} phoneNumber - Phone number
 */
export const requestSendPhoneVerificationCodeFetch = (phoneNumber) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(authServiceUri.sendPhoneVerificationCodeUrl + '/' + phoneNumber, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
};
