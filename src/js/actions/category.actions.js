/**
 * Business Category Actions
 */
import _ from 'lodash';

import categoryTypes from '../constants/category.types';
import * as AlertActions from './alert.actions';
import { getToken } from '../api/auth.service';
import { fetchCategoriesOrTags, categoryOperationFetch } from '../api/business.service';

/**
 * Get categories list successfully
 */
const getCategoriesSuccess = (reponse) => ({
  "type": categoryTypes.GET_CATEGORY_SUCCESS,
  "meta": {},
  "error": null,
  "payload": {
    list: reponse
  }
});

/**
 * Get categories list failed
 */
const getCategoriesFailure = (error) => ({
  "type": categoryTypes.GET_CATEGORY_FAILURE,
  "meta": {},
  "error": error,
  "payload": {}
});

/**
 * Get business categories list
 * @param {String} search - Search term
 */
export const getCategoriesList = (search) => {
  const _getCategoriesRequest = () => ({
    "type": categoryTypes.GET_CATEGORY_REQUEST,
  });

  return (dispatch, getState) => {
    dispatch(_getCategoriesRequest());

    return fetchCategoriesOrTags("CATAGORY", search)
      .then(response => {
        return dispatch(getCategoriesSuccess(response));
      })
      .catch(err => {
        dispatch(getCategoriesFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}

/**
 * Add new category
 * @param {Object} data - Category object
 * @property {Number} data.code - Category code
 * @property {String} data.krName - Category korean name
 * @property {String} data.cnName - Category chinese name
 * @property {String} data.enName - Category enligsh name
 */
export const addNewCategory = (data) => {
  const _addNewCategoryRequest = () => ({
    "type": categoryTypes.ADD_CATEGORY_REQUEST,
  });

  return (dispatch, getState) => {
    if (_.isEmpty(data)
      || _.isUndefined(data.code)
      || _.isUndefined(data.krName)
      || _.isUndefined(data.cnName)
      || _.isUndefined(data.enName)) {
        return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_addNewCategoryRequest());

    return getToken()
      .then(token => {
        return categoryOperationFetch("ADD", token, data);
      })
      .then(response => {
        dispatch(AlertActions.alertSuccess("Added new category successfully"));
        dispatch(getCategoriesSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(getCategoriesFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}

/**
 * Update category
 * @param {Object} data - Category object
 * @param {string} data._id - Category id
 * @property {Number} data.code - Category code
 * @property {String} data.krName - Category korean name
 * @property {String} data.cnName - Category chinese name
 * @property {String} data.enName - Category enligsh name
 * @property {String} data.parent - Category parent code
 */
export const updateCategory = (data) => {
  const _updateCategoryRequest = () => ({
    "type": categoryTypes.UPDATE_CATEGORY_REQUEST,
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

    dispatch(_updateCategoryRequest());

    return getToken()
      .then(token => {
        return categoryOperationFetch("UPDATE", token, data);
      })
      .then(response => {
        dispatch(AlertActions.alertSuccess("Update category successfully"));
        dispatch(getCategoriesSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(getCategoriesFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}

/**
 * Delete category
 * @property {String} id - Category id
 */
export const deleteCategory = (id) => {
  const _deleteCategoryRequest = () => ({
    "type": categoryTypes.DELETE_CATEGORY_REQUEST,
  });

  return (dispatch, getState) => {
    if (_.isUndefined(id)) {
      return dispatch(AlertActions.alertFailure("Code is missing"));
    }

    dispatch(_deleteCategoryRequest());

    return getToken()
      .then(token => {
        return categoryOperationFetch("DELETE", token, {"_id": id});
      })
      .then(response => {
        dispatch(AlertActions.alertSuccess("Delete category successfully"));
        dispatch(getCategoriesSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(getCategoriesFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}
