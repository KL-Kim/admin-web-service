/**
 * Business Tag Actions
 */
import _ from 'lodash';

import tagTypes from '../constants/tag.types';
import * as AlertActions from './alert.actions';
import { getToken } from '../api/auth.service';
import { fetchCategoriesOrTags, tagOperationFetch } from '../api/business.service';

/**
 * Get business tags list
 * @param {Object} params - Parameter object
 */
export const getTagsList = (params) => {
  const _getTagsRequest = () => ({
    "type": tagTypes.GET_TAGS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getTagsSuccess = (reponse) => ({
    "type": tagTypes.GET_TAGS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      list: reponse,
    }
  });

  const _getTagsFailure = (error) => ({
    "type": tagTypes.GET_TAGS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    dispatch(_getTagsRequest());

    return fetchCategoriesOrTags("TAG", params)
      .then(response => {
        return dispatch(_getTagsSuccess(response));
      })
      .catch(err => {
        dispatch(_getTagsFailure(err));
        if (err.message)
          dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}

/**
 * Add tag
 * @param {Object} data - Tag object
 * @property {Number} data.code - Tag code
 * @property {String} data.krName - Tag korean name
 * @property {String} data.cnName - Tag chinese name
 * @property {String} data.enName - Tag enligsh name
 */
export const addNewTag = (data) => {
  const _addNewTagRequest = () => ({
    "type": tagTypes.ADD_NEW_TAG_REQUEST,
  });

  const _addNewTagSuccess = () => ({
    "type": tagTypes.ADD_NEW_TAG_SUCCESS,
  });

  const _addNewTagFailure = (err) => ({
    "type": tagTypes.ADD_NEW_TAG_FAILURE,
    "error": err
  });

  return (dispatch, getState) => {
    if (_.isEmpty(data)
      || _.isUndefined(data.code)
      || _.isUndefined(data.krName)
      || _.isUndefined(data.cnName)
      || _.isUndefined(data.enName)) {
        return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_addNewTagRequest());

    return getToken()
      .then(token => {
        return tagOperationFetch("ADD", token, data);
      })
      .then(response => {
        dispatch(AlertActions.alertSuccess("Added tag successfully"));
        dispatch(_addNewTagSuccess());

        return response;
      })
      .catch(err => {
        dispatch(_addNewTagFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}

/**
 * Update tag
 * @param {Object} data - Tag object
 * @param {string} data._id - Tag id
 * @property {Number} data.code - Tag code
 * @property {String} data.krName - Tag korean name
 * @property {String} data.cnName - Tag chinese name
 * @property {String} data.enName - Tag enligsh name
 */
export const updateTag = (data) => {
  const _updateTagRequest = () => ({
    "type": tagTypes.UPDATE_TAG_REQUEST,
  });

  const _updateTagSuccess = () => ({
    "type": tagTypes.UPDATE_TAG_SUCCESS,
  });

  const _updateTagFailure = (err) => ({
    "type": tagTypes.UPDATE_TAG_FAILURE,
    "error": err,
  });

  return (dispatch, getState) => {
    if (_.isEmpty(data)
      || _.isUndefined(data._id)
      || _.isUndefined(data.code)
      || _.isUndefined(data.krName)
      || _.isUndefined(data.cnName)
      || _.isUndefined(data.enName)) {
        return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_updateTagRequest());

    return getToken()
      .then(token => {
        return tagOperationFetch("UPDATE", token, data);
      })
      .then(response => {
        dispatch(_updateTagSuccess());
        dispatch(AlertActions.alertSuccess("Updated tag successfully"));

        return response;
      })
      .catch(err => {
        dispatch(_updateTagFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}

/**
 * Delete tag
 * @property {String} id - Tag id
 */
export const deleteTag = (id) => {
  const _deleteTagRequest = () => ({
    "type": tagTypes.DELETE_TAG_REQUEST,
  });

  const _deleteTagSuccess = () => ({
    "type": tagTypes.DELETE_TAG_SUCCESS,
  });

  const _deleteTagFailure = (err) => ({
    "type": tagTypes.DELETE_TAG_FAILURE,
    "error": err,
  });

  return (dispatch, getState) => {
    if (_.isUndefined(id)) {
      return dispatch(AlertActions.alertFailure("Code is missing"));
    }

    dispatch(_deleteTagRequest());

    return getToken()
      .then(token => {
        return tagOperationFetch("DELETE", token, {"_id": id});
      })
      .then(response => {
        dispatch(_deleteTagSuccess());
        dispatch(AlertActions.alertSuccess("Deleted tag successfully"));

        return response;
      })
      .catch(err => {
        dispatch(_deleteTagFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}
