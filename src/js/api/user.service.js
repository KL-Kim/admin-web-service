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
  singleUserUrl: config.API_GATEWAY_ROOT + '/api/v1/user/single/',
  registerUrl: config.API_GATEWAY_ROOT + '/api/v1/user/register',
  verifyAccountUrl: config.API_GATEWAY_ROOT + '/api/v1/user/verify',
  changePasswordUrl: config.API_GATEWAY_ROOT + '/api/v1/user/password',
  updateUsernameUrl: config.API_GATEWAY_ROOT + '/api/v1/user/username',
  updatePhoneUrl: config.API_GATEWAY_ROOT + '/api/v1/user/phone',
  uploadProfilePhotoUrl: config.API_GATEWAY_ROOT + '/api/v1/user/profilePhoto',
  favorUrl: config.API_GATEWAY_ROOT + '/api/v1/user/favor/',

  // Admin common URI
  adminCommenUrl: config.API_GATEWAY_ROOT + '/api/v1/user/admin',
};

/**
 * Fetch registering user
 * @param {Object} user - User credential Object
 * @property {String} user.email - User's email
 * @property {String} user.password - Users's password
 * @property {String} user.passwordConfirmation - User's password confirmation
 */
export const registerFetch = (user) => {
  const options = {
    "method": 'POST',
    "headers": {'Content-Type': 'application/json'},
    "credentials": 'include',
    "body": JSON.stringify({
      "email": user.email,
      "password": user.password,
      "passwordConfirmation": user.passwordConfirmation
    }),
  };

  return fetch(userServiceUri.registerUrl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        let error = new Error(response.statusText);
        error.status = response.status;

        if (response.status === 400) {
          error.message = "Bad request formatting in the request";
        } else if (response.status === 409) {
          error.message = "The email has been used by someone else."
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
        return json;
      } else {
        const err = new Error("Bad response")
        return Promise.reject(err);
      }
    }).catch(err => {
      return Promise.reject(err);
  });
};

/**
 * Fetch account verify
 * @param {String} token - Bearer Token
 */
export const verifyFetch = (token) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
  };

  return fetch(userServiceUri.verifyAccountUrl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(user => {
      return user;
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Fetch user by Id
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

  return fetch(userServiceUri.singleUserUrl + id, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        let error = new Error(response.statusText);
        error.status = response.status;

        if (response.status === 400) {
          error.message = "Bad request formatting in the request";
        } else if (response.status === 409) {
          error.message = "The email has been used by someone else."
        } else {
          error.message = "Unknown Server Error";
        }
        return Promise.reject(error);
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
 * Request changing password
 * @param {String} token - Verification Token
 * @param {String} user.password - Users's password
 * @param {String} user.passwordConfirmation - User's password confirmation
 */
export const changePasswordFetch = (token, password, passwordConfirmation) => {
  const options = {
    "method": 'POST',
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    "body": JSON.stringify({
      "password": password,
      "passwordConfirmation": passwordConfirmation
    }),
  };

  return fetch(userServiceUri.changePasswordUrl, options)
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
 * Fetch updating user profile
 * @param {String} type - Updating type
 * @param {String} token - Bearer Token
 * @param {String} id - User's id
 * @param {Object} data - User's account Object
 */
export const updateUserFetch = (type = "PROFILE", token, id, data) => {
  const options = {
    "method": 'PUT',
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    "body": JSON.stringify({...data}),
  };
  let url;

  switch (type) {
    case userTypes.UPDATE_USERNAME:
      url = userServiceUri.updateUsernameUrl + '/' + id;
      break;

    default:
      url = userServiceUri.singleUserUrl + id;
  }

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(user => {
      return user;
    }).catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Upload user profile photo
 * @param {String} token - Bearer Token
 * @param {String} id - User's id
 * @param {formData} data - Image formdata
 */
export const uploadProfilePhotoFetch = (token, id, data) => {
  const options = {
    "method": 'POST',
    "headers": {
      "Authorization": 'Bearer ' + token,
    },
    "body": data,
  };

  return fetch(userServiceUri.uploadProfilePhotoUrl + '/' + id, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(user => {
      return user;
    }).catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Upddate user's phone
 * @param {String} token - Bearer Token
 * @param {String} id - User's id
 * @param {String} phoneNumber - Phone Number
 * @param {Number} code - Verification code
 */
export const updateMobilePhoneFetch = (token, id, phoneNumber, code) => {
  const options = {
    "method": 'POST',
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    "body": JSON.stringify({
      "phoneNumber": phoneNumber,
      "code": code
    }),
  };

  return fetch(userServiceUri.updatePhoneUrl + '/' + id, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        const error = new Error(response.statusText);
        error.status = response.status;

        switch (response.status) {
          case 401:
          case 403:
            error.message = "Verification Code is not matched";
            break;

          default:
            error.message = "Unknown Server Error";
        }

        return Promise.reject(error);
      }
    })
    .then(user => {
      return user;
    }).catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Add or delete user's favorite business
 * @param {String} token - Bearer Token
 * @param {String} id - User's id
 * @param {String} bid - Business id
 */
export const faverOperationFetch = (token, id, bid) => {
  const options = {
    "method": 'POST',
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    "body": JSON.stringify({
      bid: bid
    }),
  };

  return fetch(userServiceUri.favorUrl + id, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(user => {
      saveToStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR, user.favors);
      return user;
    }).catch(err => {
      return Promise.reject(err);
    });
}

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
 * Admin edit user
 * @role admin
 * @param {String} token - Bearer Token
 * @param {String} id - User's id
 * @param {Object} data - User's account Object
 */
export const adminEditUserFetch = (token, id, data) => {
  const options = {
    "method": 'POST',
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    "body": JSON.stringify({ ...data }),
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
