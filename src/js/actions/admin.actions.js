/**
 * Admin Actions
 */
import * as AlertActions from './alert.actions';
import _ from 'lodash';
import { getToken } from '../api/auth.service';
import { getUsersListFetch, adminEditUserFetch, getUserByIdFetch } from '../api/user.service';

/**
 * Fetch Users List
 * @role admin
 * @param {Number} skip - Number of users to be skipped.
 * @param {Number} limit - Limit Number of users to be returned.
 * @param {Object} rawFilter - Filter users list
 * @param {String} search - Search String
 */
export const getUsersList  = ({ skip, limit, role, status, search } = {}) => {
  return (dispatch, getState) => {
    return getToken()
      .then(token => {
        return getUsersListFetch(token, { skip, limit, role, status, search });
      })
      .then(usersList => {
        return usersList;
      })
      .catch(err => {
        return dispatch(AlertActions.alertFailure("Get users list failed!"));
      });
  };
};

/**
 * Get user by id
 */
export const adminGetUser = (id) => {
  return (dispatch, getState) => {
    if (_.isUndefined(id)) {
      return dispatch(AlertActions.alertFailure("Bad request!"));
    }

    return getToken()
      .then(token => {
        return getUserByIdFetch(token, id)
      })
      .then(response => {
        return response;
      })
      .catch(err => {
        dispatch(AlertActions.alertFailure("Get user failed!"));

        return ;
      });
  };
}

/**
 * Admin edit user
 * @role admin
 * @param {String} id - User's id
 * @param {Object} data - User's account object
 */
export const adminEditUser = (id, data) => {
  return (dispatch, getState) => {
    if (_.isUndefined(id) || _.isEmpty(data)) {
      return dispatch(AlertActions.alertFailure("Bad request!"));
    }

    return getToken()
      .then(token => {
        return adminEditUserFetch(token, id, data)
      })
      .then(response => {
        return dispatch(AlertActions.alertSuccess("Update successfully"));
      })
      .catch(err => {
        return dispatch(AlertActions.alertFailure("Update failed!"));
      });
  };
};
