/**
 * User Actions
 */
import _ from 'lodash';

import * as AlertActions from './alert.actions';
import userTypes from '../constants/user.types';
import webStorageTypes from '../constants/webStorage.types.js';
import {
  registerFetch,
  verifyFetch,
  changePasswordFetch,
  getUserByIdFetch,
  updateUserFetch,
  uploadProfilePhotoFetch,
  updateMobilePhoneFetch,
  faverOperationFetch,
} from '../api/user.service';
import { getToken, loginFetch, logoutFetch } from '../api/auth.service';
import { removeFromStorage } from '../helpers/webStorage';

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
      const error = new Error("Email or password is empty")
      dispatch(_loginSuccess(error));
      dispatch(AlertActions.alertFailure("Email and passwords should not be empty"));
      return Promise.reject(error);
    }

    dispatch(AlertActions.alertClear());
    dispatch(_requestLogin());
    return loginFetch(email, password)
      .then(user => {
        dispatch(_loginSuccess(user));
        dispatch(AlertActions.alertSuccess("Login successfully"));

        return ;
      }).catch(err => {
        if (err.message) {
          dispatch(AlertActions.alertFailure(err.message));
        }
        dispatch(_loginFailure(err));

        return ;
      });
  };
};

/**
 * Register user
 * @param {Object} user - User
 * @property {String} user.email - User's email
 * @property {String} user.password - User's passwords
 * @property {String} user.passwordConfirmation - Password Confirmation
 */
export const register = (user) => {
  const _requestRegister = () => ({
      "type": userTypes.REGISTER_REQUEST,
      "meta": {},
      "error": null,
      "payload": {}
    }
  );

  const _registerSuccess = (user) => ({
    "type": userTypes.REGISTER_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    }
  });

  const _registerFailure = error => ({
    "type": userTypes.REGISTER_FAILURE,
    "meta": {},
    "error": error,
    "payload": {},
  });

  return (dispatch, getState) => {
    if (_.isEmpty(user.email)
      || _.isEmpty(user.password)
      || _.isEmpty(user.passwordConfirmation)) {
        const error = new Error("Requests params missing");
        dispatch(AlertActions.alertFailure(error.message));
        return Promise.reject(error);
    }

    dispatch(AlertActions.alertClear());
    dispatch(_requestRegister());
    return registerFetch(user)
      .then(res => {
        dispatch(_registerSuccess(res.user));
        dispatch(AlertActions.alertSuccess("Sign up successfully"));

        return ;

      }).catch(err => {
        dispatch(_registerFailure(err));
        if (err.message) {
          dispatch(AlertActions.alertFailure(err.message));
        }
        return ;
    });
  };
};

/**
 * Account Verification
 * @param {String} token - Access Token
 */
export const verifyAccount = (token) => {
  /**
   *  Request verify account
   */
  const _requestVerify = () => ({
    "type": userTypes.VERIFY_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  /**
   *  Verify account success
   */
  const _verifySuccess = user => ({
    "type": userTypes.VERIFY_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    }
  });

  /**
   *  Verify account failure
   */
  const _verifyFailure = error => ({
    "type": userTypes.VERIFY_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(token)) {
      const err = new Error("Token missing");
      dispatch(AlertActions.alertFailure(err.message));
      return Promise.reject(err);
    }

    dispatch(_requestVerify());
    return verifyFetch(token)
      .then(user => {
        return dispatch(_verifySuccess(user))
      }).catch(err => {
        return dispatch(_verifyFailure(err));
      });
  };
};

/**
 * Change password
 * @param {String} token - Access Token
 * @param {String} password - Password
 * @param {String} passwordConfirmation - Password Confirmation
 */
export const changePassword = (token, password, passwordConfirmation) => {
  const _requestChangePassword = () => ({
    "type": userTypes.CHANGE_PASSWORD_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _changePasswordSuccess = () => ({
    "type": userTypes.CHANGE_PASSWORD_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _changePasswordFailure = (error) => ({
    "type": userTypes.CHANGE_PASSWORD_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    let err;

    if (_.isEmpty(token)) {
      err = new Error("Token missing");
      dispatch(AlertActions.alertFailure(err.message));
      return Promise.reject(err);
    }

    if(_.isEmpty(password) || _.isEmpty(passwordConfirmation)) {
      err = new Error("Passwords missing");
      dispatch(AlertActions.alertFailure(err.message));
      return Promise.reject(err);
    }

    dispatch(_requestChangePassword());
    return changePasswordFetch(token, password, passwordConfirmation)
      .then(res => {
        dispatch(_changePasswordSuccess());
        dispatch(AlertActions.alertSuccess("Your password has been changed successfully"));

        return ;
      }).catch(err => {
        dispatch(_changePasswordFailure(err));
        dispatch(AlertActions.alertFailure("Permission denied"));

        return ;
      });
  };
};

/**
 * Get user own dasta
 * @param {String} id - User's id
 */
export const getMyself = (id) => {
  const _getMeRequest = () => ({
    "type": userTypes.GET_MYSELF_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getMeSuccess = (user) => ({
    "type": userTypes.GET_MYSELF_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    }
  });

  const _getMeFailure = (error) => ({
    "type": userTypes.GET_MYSELF_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    getToken()
      .then(token => {
        dispatch(_getMeRequest());
        return getUserByIdFetch(token, id);
      })
      .then(user => {
        dispatch(_getMeSuccess(user));

        return user;
      }).catch(err => {
        return dispatch(_getMeFailure(err));
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

    return logoutFetch().then(json => {
      dispatch(_logoutSuccess());
      dispatch(AlertActions.alertSuccess("Log out successfully"));

      return ;
    }).catch(err => {
      dispatch(_logoutFailure(err));
      if (err.message) {
        dispatch(AlertActions.alertFailure(err.message));
      }

      return ;
    });
  };
};

/**
 * Update user's profile
 * @param {String} id - Users' id
 * @param {Object} data - User's profile Object
 */
export const updateUserProfile = (id, data) => {
  const _updateUserProfileRequest  = () => ({
    "type": userTypes.UPDATE_USER_PROFILE_REQUEST,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _updateUserProfileSuccess  = (user) => ({
    "type": userTypes.UPDATE_USER_PROFILE_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    },
  });

  const _updateUserProfileFailure  = (error) => ({
    "type": userTypes.UPDATE_USER_PROFILE_FAILURE,
    "meta": {},
    "error": error,
    "payload": {},
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id) || _.isEmpty(data)) {
      const error = new Error("Bad Request");
      return Promise.reject(error);
    }

    const user = getState().userReducer.user;
    let modified = false;

    _.map(data, (value, name) => {
      if (value !== user[name]) {
        modified = true;
      }
    });

    if (!modified) {
      return dispatch(AlertActions.alertSuccess("Nothing changed"));
    }

    dispatch(_updateUserProfileRequest());

    return getToken()
      .then(token => {
        let type = 'PROFILE';
        if (!_.isEmpty(data.username)) type = userTypes.UPDATE_USERNAME;

        return updateUserFetch(type, token, id, data);
      }).then(user => {
          dispatch(_updateUserProfileSuccess(user));
          dispatch(AlertActions.alertSuccess("Updated successfully"));

          return ;
      }).catch(err => {
        if (err.message) {
          dispatch(AlertActions.alertFailure(err.message));
        }
        dispatch(_updateUserProfileFailure(err));

        return ;
      });
  }
}

/**
 * Upload user's profile photo
 * @param {String} id - Users' id
 * @param {FormData} formData - Users' profile photo image
 */
export const uploadProfilePhoto = (id, formData) => {
  const _uploadProfilePhotoRequset = () => ({
    "type": userTypes.UPLOAD_PROFILE_PHOTO_REQUEST,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _uploadProfilePhotoSuccess = (user) => ({
    "type": userTypes.UPLOAD_PROFILE_PHOTO_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    },
  });

  const _uploadProfilePhotoFailure = (error) => ({
    "type": userTypes.UPLOAD_PROFILE_PHOTO_FAILURE,
    "meta": {},
    "error": error,
    "payload": {},
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id)) {
      const error = new Error("Bad Request");
      return Promise.reject(error);
    }

    dispatch(_uploadProfilePhotoRequset());

    return getToken()
      .then(token => {
        return uploadProfilePhotoFetch(token, id, formData);
      }).then(user => {
        dispatch(_uploadProfilePhotoSuccess(user));
        dispatch(AlertActions.alertSuccess("Updated successfully"));

        return ;
      }).catch(err => {
        dispatch(_uploadProfilePhotoFailure(err));
        if (err.message) {
          dispatch(AlertActions.alertFailure(err.message));
        }

        return ;
      });
  };
};

/**
 * Update users' mobile phone
 * @param {String} id - Users' id
 * @param {String} phoneNumber - Mobile phone phoneNumber
 * @param {Number} code - Verification Code
 */
export const updateMobilePhone = (id, phoneNumber, code) => {
  const _updateMobilePhoneRequset = () => ({
    "type": userTypes.UPDATE_MOBILE_PHONE_REQUEST,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _updateMobilePhoneSuccess = (user) => ({
    "type": userTypes.UPDATE_MOBILE_PHONE_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    },
  });

  const _updateMobilePhoneFailure = (error) => ({
    "type": userTypes.UPDATE_MOBILE_PHONE_FAILURE,
    "meta": {},
    "error": error,
    "payload": {},
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id) || _.isEmpty(phoneNumber) || _.isEmpty(code)) {
      const error = new Error("Bad Request");
      return Promise.reject(error);
    }

    dispatch(_updateMobilePhoneRequset());
    return getToken()
      .then(token => {
        return updateMobilePhoneFetch(token, id, phoneNumber, code);
      }).then(user => {
        dispatch(_updateMobilePhoneSuccess(user));
        dispatch(AlertActions.alertSuccess("Updated successfully"));

        return true;
      }).catch(err => {
        dispatch(_updateMobilePhoneFailure(err));
        if (err.message) {
          dispatch(AlertActions.alertFailure(err.message));
        }

        return false;
      });
  };
}

/**
  * Add or delete user's favorite business
  * @param {String} id - User's id
  * @param {String} bid - Business id
 */
export const favorOperation = (id, bid) => {
  const _favorOperationRequest  = () => ({
    "type": userTypes.FAVOR_OPERATION_REQUEST,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _favorOperationSuccess  = (user) => ({
    "type": userTypes.FAVOR_OPERATION_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    },
  });

  const _favorOperationFailure  = (error) => ({
    "type": userTypes.FAVOR_OPERATION_FAILURE,
    "meta": {},
    "error": error,
    "payload": {},
  });

  return (dispatch, getState) => {
    if (_.isUndefined(id) || _.isUndefined(bid)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_favorOperationRequest());

    return getToken()
      .then(token => {
        return faverOperationFetch(token, id, bid);
      })
      .then(response => {
        dispatch(_favorOperationSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(_favorOperationFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return;
      });
  }
}
