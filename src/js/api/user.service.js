import Promise from 'bluebird';
import fetch from 'cross-fetch';

import config from '../config/config';
import { saveToStorage } from '../helpers/webStorage';
import userTypes from '../constants/user.types';
import webStorageTypes from '../constants/webStorage.types';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * User serivce uri
 */
const userServiceUri = {
  commonUserUrl: config.API_GATEWAY_ROOT + '/api/v1/user',
  adminCommenUrl: config.API_GATEWAY_ROOT + '/api/v1/user/admin',
};

/**
 * Fetch user ownself
 * @param {String} token - Bearer Token
 * @param {String} id - User's id
 */
export const getMyselfFetch = (token, id) => {
  const options = {
    "method": 'GET',
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
  };

  return fetch(userServiceUri.commonUserUrl + '/single/'+ id, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(user => {
      if (user) {
        return user;
      } else {
        const err = new Error("Bad response");
        return Promise.reject(err);
      }
    }).catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Fetch Users List
 * @role admin
 * @param {String} token - Bearer Token
 * @param {Number} skip - Number of users to be skipped.
 * @param {Number} limit - Limit Number of users to be returned.
 * @param {Object} filter - Filter users list
 * @param {String} search - Search String
 */
export const getUsersListFetch = (token, { skip, limit, role, status, search } = {}) => {
  const options = {
    "method": 'GET',
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
  };

  let url = userServiceUri.adminCommenUrl + '?';

  if (skip) {
    url = url + '&skip=' + skip;
  }

  if (limit) {
    url = url + '&limit=' + limit;
  }

  if (role) {
    url = url + '&role=' + role;
  }

  if (status) {
    url = url + '&status=' + status;
  }

  if (search)
    url = url + '&search=' + search;

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(json => {
      return json;
    }).catch(err => {
      return Promise.reject(err);
    });
}

/**
 * Fetch user by admin
 * @param {String} token - Bearer Token
 * @param {String} id - User's id
 */
export const getUserByIdFetch = (token, id) => {
  const options = {
    "method": 'GET',
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
  };

  return fetch(userServiceUri.adminCommenUrl + '/' + id, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    }).catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Admin edit user
 * @role - admin
 * @param {String} token - Bearer Token
 * @param {String} id - User's id
 * @property {String} role - User role
 * @property {String} userStatus - User status
 */
export const editUserFetch = (token, id, { role, userStatus } = {}) => {
  const options = {
    "method": 'POST',
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    "body": JSON.stringify({
      role,
      userStatus,
    }),
  };

  return fetch(userServiceUri.adminCommenUrl + '/' + id, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(response => {
      return response;
    }).catch(err => {
      return Promise.reject(err);
    });
}
