/**
 * User Actions
 */
import _ from 'lodash';

import * as AlertActions from './alert.actions';
import errorTypes from '../constants/error.types';

import { getToken } from '../api/auth.service';
import { getErrorsListFetch, editErrorFetch, deleteErrorFetch } from '../api/error.service';

/**
 * Get errors list
 * @param {Number} skip
 * @param {Number} limit
 * @param {String} search
 * @param {String} orderby
 * @param {Boolean} unChecked
 */
export const getErrorsList = ({ skip, limit, search, orderby, unChecked } = {}) => {
    const _getErrorsListRequest = () => ({
        "type": errorTypes.GET_ERRORS_LIST_REQUEST,
        "meta": {},
        "error": null,
        "payload": {}
    });
  
    const _getErrorsListSuccess = res => ({
      "type": errorTypes.GET_ERRORS_LIST_SUCCESS,
      "meta": {},
      "error": null,
      "payload": {
        "list": res.list,
        "totalCount": res.count,
      }
    });
  
    const _getErrorsListFailure = error => ({
      "type": errorTypes.GET_ERRORS_LIST_FAILURE,
      "meta": {},
      "error": error,
      "payload": {}
    });

    return (dispatch, getState) => {
        dispatch(_getErrorsListRequest());

        return getToken()
            .then(token => {
                return getErrorsListFetch(token, { skip, limit, search, orderby, unChecked });
            })
            .then(response => {
                dispatch(_getErrorsListSuccess(response));

                return response;
            })
            .catch(err => {
                dispatch(_getErrorsListFailure(err));
                dispatch(AlertActions.alertFailure("Failed to get errors list."));

                return ;
            });
    }
};

/**
 * Edit error 
 * @param {String} id
 * @param {Boolean} isChecked
 */
export const eidtError = ({ id, isChecked }) => {
    const _editErrorRequest = () => ({
        "type": errorTypes.EDIT_ERROR_REQUEST,
        "meta": {},
        "error": null,
        "payload": {}
    });
  
    const _editErrorSuccess = () => ({
      "type": errorTypes.EDIT_ERROR_SUCCESS,
      "meta": {},
      "error": null,
      "payload": {}
    });
  
    const _editErrorFailure = error => ({
      "type": errorTypes.EDIT_ERROR_FAILURE,
      "meta": {},
      "error": error,
      "payload": {}
    });

    return (dispatch, getState) => {
        dispatch(_editErrorRequest());

        return getToken()
            .then(token => {
                return editErrorFetch(token, {id, isChecked});
            })
            .then(res => {
                dispatch(_editErrorSuccess());
                dispatch(AlertActions.alertSuccess("Updated"));

                return res;
            })
            .catch(err => {
                dispatch(_editErrorFailure(err));
                dispatch(AlertActions.alertFailure("Failed to update."));

                return ;
            })
    };
}

/**
 * Delete error
 * @param {String} id 
 */
export const deleteError = (id) => {
    const _deleteErrorRequest = () => ({
        "type": errorTypes.DELETE_ERROR_REQUEST,
        "meta": {},
        "error": null,
        "payload": {}
    });
  
    const _deleteErrorSuccess = () => ({
      "type": errorTypes.DELETE_ERROR_SUCCESS,
      "meta": {},
      "error": null,
      "payload": {}
    });
  
    const _deleteErrorFailure = error => ({
      "type": errorTypes.DELETE_ERROR_FAILURE,
      "meta": {},
      "error": error,
      "payload": {}
    });

    return (dispatch, getState) => {
        dispatch(_deleteErrorRequest());

        return getToken()
            .then(token => {
                return deleteErrorFetch(token, id);
            })
            .then(res => {
                dispatch(_deleteErrorSuccess());
                dispatch(AlertActions.alertSuccess("Deleted"));

                return res;
            })
            .catch(err => {
                dispatch(_deleteErrorFailure(err));
                dispatch(AlertActions.alertFailure("Failed to delete."));

                return ;
            })
    }
}