/**
 * Admin Actions
 */
import _ from 'lodash';

import * as AlertActions from './alert.actions';
import userTypes from '../constants/user.types';
import { getToken } from '../api/auth.service';
import { getUsersListFetch, editUserFetch, getUserByIdFetch } from '../api/user.service';

/**
 * Fetch Users List
 * @role admin
 * @param {Number} skip - Number of users to be skipped.
 * @param {Number} limit - Limit Number of users to be returned.
 * @param {Object} rawFilter - Filter users list
 * @param {String} search - Search String
 */
export const getUsersList  = ({ skip, limit, role, status, search } = {}) => {
  const _getUsersListRequest = () => ({
    "type": userTypes.GET_USERS_LIST_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getUsersListSuccess = (response) => ({
    "type": userTypes.GET_USERS_LIST_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      list: response.users,
      totalCount: response.totalCount,
    }
  });

  const _getUsersListFailure = (error) => ({
    "type": userTypes.GET_USERS_LIST_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    dispatch(_getUsersListRequest());

    return getToken()
      .then(token => {
        return getUsersListFetch(token, { skip, limit, role, status, search });
      })
      .then(response => {
        dispatch(_getUsersListSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(_getUsersListFailure(err));
        dispatch(AlertActions.alertFailure("Get users list failed!"));

        return;
      });
  };
};

/**
 * Get user by id
 * @role admin
 * @param {String} id - User's id
 */
export const getSingleUser = (id) => {
  const _getSingleUserRequest = () => ({
    "type": userTypes.GET_SINGLE_USER_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getSingleUserSuccess = (response) => ({
    "type": userTypes.GET_SINGLE_USER_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getSingleUserFailure = (error) => ({
    "type": userTypes.GET_SINGLE_USER_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isUndefined(id)) {
      return dispatch(AlertActions.alertFailure("Bad request!"));
    }

    dispatch(_getSingleUserRequest());

    return getToken()
      .then(token => {
        return getUserByIdFetch(token, id);
      })
      .then(response => {
        dispatch(_getSingleUserSuccess());

        return response;
      })
      .catch(err => {
        dispatch(_getSingleUserFailure(err))
        dispatch(AlertActions.alertFailure("Get user failed!"));

        return ;
      });
  };
}

/**
 * Admin edit user
 * @role admin
 * @param {String} id - User's id
 * @property {String} role - User role
 * @property {String} userStatus - User status
 */
export const editUser = (id, { role, userStatus } = {}) => {
  const _editUserRequest = () => ({
    "type": userTypes.EDIT_USER_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _editUserSuccess = (response) => ({
    "type": userTypes.EDIT_USER_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _editUserFailure = (error) => ({
    "type": userTypes.EDIT_USER_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isUndefined(id)) {
      return dispatch(AlertActions.alertFailure("Bad request!"));
    }

    return getToken()
      .then(token => {
        return editUserFetch(token, id, { role, userStatus });
      })
      .then(response => {
        dispatch(_editUserSuccess(response));
        dispatch(AlertActions.alertSuccess("Update successfully"));

        return response;
      })
      .catch(err => {
        dispatch(_editUserFailure(err));
        dispatch(AlertActions.alertFailure("Update failed!"));

        return ;
      });
  };
};
