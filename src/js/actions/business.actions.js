/**
 * Business Actions
 */
import _ from 'lodash';

import businessTypes from '../constants/business.types';
import * as AlertActions from './alert.actions';
import { getToken } from '../api/auth.service';
import {
  fetchBusinessList,
  fetchSingleBusiness,
  addBusinessFetch,
  updateBusinessFetch,
  deleteBusinessFetch,
  uploadImagesFetch,
  deleteImageFetch,
} from '../api/business.service';

/**
 * Clear business reduer
 */
export const clearBusinessList = () => {
  return (dispatch) => dispatch({
    "type": businessTypes.CLEAR_BUSINESS_LIST,
  });
};

/**
 * Get business list by category
 * @param {Number} skip - Number of business to skip
 * @param {Number} limit - Number of business to limit
 * @param {Object} filter - Business list filter
 * @param {search} search - Search business
 * @param {String} orderBy - List order
 */
export const getBusinessList = ({ skip, limit, filter, search, orderBy } = {}) => {
  const getBusinessListRequest = () => ({
    "type": businessTypes.GET_BUSINESS_LIST_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const getBusinessListSuccess = (response) => ({
    "type": businessTypes.GET_BUSINESS_LIST_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      list: response.list,
      totalCount: response.totalCount
    }
  });

  const getBusinessListFailure = (error) => ({
    "type": businessTypes.GET_BUSINESS_LIST_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    dispatch(getBusinessListRequest());

    return getToken()
      .then(token => {
        return fetchBusinessList(token, { skip, limit, filter, search, orderBy });
      })
      .then(response => {
        dispatch(getBusinessListSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(getBusinessListFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      })
  }
}

/**
 * Get single business
 * @param {String} slug - Business english name
 */
export const getSingleBusiness = (slug) => {
  const _getSingleBusinessRequest = () => ({
    "type": businessTypes.GET_SINGLE_BUSINESS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getSignleBusinessSuccess = (response) => ({
    "type": businessTypes.GET_SINGLE_BUSINESS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      business: response
    },
  });

  const _getSingleBusinessFailure = (error) => ({
    "type": businessTypes.GET_SINGLE_BUSINESS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(slug)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_getSingleBusinessRequest());

    return fetchSingleBusiness(slug)
      .then(business => {
        dispatch(_getSignleBusinessSuccess(business));

        return business;
      })
      .catch(err => {
        dispatch(_getSingleBusinessFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      })
  }
}

/**
 * Add business
 * @param {Object} data - New business data
 */
export const addBusiness = (data) => {
  const _addBusinessRequest = () => ({
    "type": businessTypes.ADD_BUSINESS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _addBusinessSuccess = () => ({
    "type": businessTypes.ADD_BUSINESS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _addBusinessFailure = (error) => ({
    "type": businessTypes.ADD_BUSINESS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(data)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_addBusinessRequest());
    return getToken()
      .then(token => {
        return addBusinessFetch(token, data)
      })
      .then(json => {
        dispatch(_addBusinessSuccess());
        dispatch(AlertActions.alertSuccess("Add business successfully"));

        return ;
      })
      .catch(err => {
        dispatch(_addBusinessFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}

/**
 * Update business
 * @param {String} id - Business Id
 * @param {Object} data - Business data
 */
export const updateBusiness = (id, data) => {
  const _updateBusinessRequest = () => ({
    "type": businessTypes.UPDATE_BUSINESS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _updateBusinessSuccess = () => ({
    "type": businessTypes.UPDATE_BUSINESS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _updateBusinessFailure = (error) => ({
    "type": businessTypes.UPDATE_BUSINESS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id) || _.isEmpty(data)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_updateBusinessRequest());
    return getToken()
      .then(token => {
        return updateBusinessFetch(token, id, data)
      })

      .then(response => {
        dispatch(_updateBusinessSuccess());
        dispatch(AlertActions.alertSuccess("Update business successfully"));

        return ;
      })
      .catch(err => {
        dispatch(_updateBusinessFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}

/**
 * Delete business
 * @param {String} id - Business id
 */
export const deleteBusiness = (id) => {
  const _deleteBusinessRequest = () => ({
    "type": businessTypes.DELETE_BUSINESS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _deleteBusinessSuccess = () => ({
    "type": businessTypes.DELETE_BUSINESS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": ""
  });

  const _deleteBusinessFailure = (error) => ({
    "type": businessTypes.DELETE_BUSINESS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_deleteBusinessRequest());
    return getToken()
      .then(token => {
        return deleteBusinessFetch(token, id);
      })

      .then(response => {
        dispatch(_deleteBusinessSuccess());
        dispatch(AlertActions.alertSuccess("Delete business successfully"));

        return response;
      })
      .catch(err => {
        dispatch(_deleteBusinessFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}

/**
 * Upload business images
 * @param {String} id - Business id
 * @param {FormData} formData - Business data
 */
export const uploadImages = (id, formData) => {
  const _uploadImagesRequest = () => ({
    "type": businessTypes.UPLOAD_IMAGES_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _uploadImagesSuccess = () => ({
    "type": businessTypes.UPLOAD_IMAGES_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _uploadImagesFailure = (error) => ({
    "type": businessTypes.UPLOAD_IMAGES_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }
    dispatch(_uploadImagesRequest());

    return getToken()
      .then(token => {
        return uploadImagesFetch(token, id, formData)
      })
      .then(response => {
        dispatch(_uploadImagesSuccess());
        dispatch(AlertActions.alertSuccess("Upload images successfully"));

        return response;
      })
      .catch(err => {
        dispatch(_uploadImagesFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}

/**
 * Delete business image
 * @param {String} id - Business id
 * @param {Object} data - Business image uri
 */
export const deleteImage = (id, data) => {
  const _deleteImageRequest = () => ({
    "type": businessTypes.DELETE_IMAGE_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _deleteImageSuccess = () => ({
    "type": businessTypes.DELETE_IMAGE_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _deleteImageFailure = (error) => ({
    "type": businessTypes.DELETE_IMAGE_FAILURE,
    "meta": {},
    "error": error,
    "payload": null
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id) || _.isEmpty(data)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_deleteImageRequest());

    return getToken()
      .then(token => {
        return deleteImageFetch(token, id, data)
      })
      .then(response => {
        dispatch(_deleteImageSuccess());
        dispatch(AlertActions.alertSuccess("Delete image successfully"));

        return response;
      })
      .catch(err => {
        dispatch(_deleteImageFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}
