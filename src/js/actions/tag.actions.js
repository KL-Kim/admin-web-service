/**
 * Business Tag Actions
 */
import _ from 'lodash';

import tagTypes from '../constants/tag.types';
import * as AlertActions from './alert.actions';
import { getToken } from '../api/auth.service';
import { fetchCategoriesOrTags, tagOperationFetch } from '../api/business.service';

const getTagsSuccess = (reponse) => ({
  "type": tagTypes.GET_TAGS_SUCCESS,
  "meta": {},
  "error": null,
  "payload": {
    list: reponse,
  }
});

const getTagsFailure = (error) => ({
  "type": tagTypes.GET_TAGS_FAILURE,
  "meta": {},
  "error": error,
  "payload": {}
});

/**
 * Get business tags list
 */
export const getTagsList = (search) => {
  const _getTagsRequest = () => ({
    "type": tagTypes.GET_TAGS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  return (dispatch, getState) => {
    dispatch(_getTagsRequest());

    return fetchCategoriesOrTags("TAG", search)
      .then(response => {
        return dispatch(getTagsSuccess(response));
      })
      .catch(err => {
        dispatch(getTagsFailure(err));
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
  const _addTagRequest = () => ({
    "type": tagTypes.ADD_TAG_REQUEST,
  })

  return (dispatch, getState) => {
    if (_.isEmpty(data)
      || _.isUndefined(data.code)
      || _.isUndefined(data.krName)
      || _.isUndefined(data.cnName)
      || _.isUndefined(data.enName)) {
        return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_addTagRequest());

    return getToken()
      .then(token => {
        return tagOperationFetch("ADD", token, data);
      })
      .then(response => {
        dispatch(AlertActions.alertSuccess("Added tag successfully"));
        dispatch(getTagsSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(getTagsFailure(err));
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
  })

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
        dispatch(AlertActions.alertSuccess("Updated tag successfully"));
        dispatch(getTagsSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(getTagsFailure(err));
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
        dispatch(AlertActions.alertSuccess("Deleted tag successfully"));
        dispatch(getTagsSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(getTagsFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}
