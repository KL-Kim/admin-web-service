import Promise from 'bluebird';
import fetch from 'cross-fetch';
import _ from 'lodash';

import config from '../config/config';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * Business serivce uri
 */
const businessSerivceUri = {
  commonUrl: config.API_GATEWAY_ROOT + '/api/v1/business',
  adminUrl: config.API_GATEWAY_ROOT + '/api/v1/business/admin',
  singleUrl: config.API_GATEWAY_ROOT + '/api/v1/business/single/',
  businessImagesUrl: config.API_GATEWAY_ROOT + '/api/v1/business/images/',
  categoryUrl: config.API_GATEWAY_ROOT + '/api/v1/category',
  tagUrl: config.API_GATEWAY_ROOT + '/api/v1/tag',
};

/**
 * Fetch business list by admin
 * @property {Number} skip - Number of business to skip
 * @property {Number} limit - Number of business to limit
 * @property {Object} filter - Business list filter
 * @property {String} search - Search business
 * @property {String} orderBy - List order
 */
export const fetchBusinessList = (token, { skip, limit, filter, search, orderBy } = {}) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
  };

  let url = businessSerivceUri.adminUrl + '?';

  if (_.isNumber(skip)) url = url + '&skip=' + skip;
  if (_.isNumber(limit)) url = url + '&limit=' + limit;
  if (!_.isEmpty(filter)) {
    if (!!filter.category) url = url + '&category=' + filter.category;
    if (!!filter.area) url = url + '&area=' + filter.area;
    if (!!filter.event) url = url + '&event=1';
    if (!!filter.reports) url = url + '&reports=1';
    if (!!filter.list) url = url + '&list=' + filter.list;
    if (!!filter.status) url = url + '&status=' + filter.status;
    if (!!filter.businessState) url = url + '&businessState=' + filter.businessState;
  }

  if (orderBy) {
    url = url + '&orderBy=' + orderBy;
  }

  if (search) url = url+ '&search=' + search;

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

/**
 * Fetch single business
 * @param {String} slug - Type value
 */
export const fetchSingleBusiness = (slug) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(businessSerivceUri.singleUrl + slug, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

/**
 * Add new business
 * @param {String} token - Verification code
 * @param {Object} data - Business data
 */
export const addBusinessFetch = (token, data) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  };

  return fetch(businessSerivceUri.commonUrl, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

/**
 * Update  business
 * @param {String} token - Verification code
 * @param {String} id - Business Id
 * @param {Object} data - Business data
 */
export const updateBusinessFetch = (token, id, data) => {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  };

  return fetch(businessSerivceUri.singleUrl + id, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

/**
 * Update  business
 * @param {String} token - Verification code
 * @param {String} id - Business Id
 * @param {Object} data - Business data
 */
export const deleteBusinessFetch = (token, id) => {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
  };

  return fetch(businessSerivceUri.singleUrl + id, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

/**
 * Upload business images
 * @param {String} token - Verification code
 * @param {String} id - Business Id
 * @param {Formdata} data - Business image
 */
export const uploadImagesFetch = (token, id, data) => {
  const options = {
    "method": 'POST',
    "headers": {
      "Authorization": 'Bearer ' + token,
    },
    "body": data,
  };

  return fetch(businessSerivceUri.businessImagesUrl + id, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

/**
 * Delete business image
 * @param {String} token - Verification code
 * @param {String} id - Business Id
 * @param {Object} data - Business image
 */
export const deleteImageFetch = (token, id, data) => {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  };

  return fetch(businessSerivceUri.businessImagesUrl + id, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

/**
 * Fetch business categories or tags list
 * @param {String} type - category or tag
 * @param {Number} skip - Number to skip
 * @param {Number} limit - Number to limit
 * @param {String} search - Search term
 * @param {String} orderBy - List order
 */
export const fetchCategoriesOrTags = (type, { skip, limit, search, orderBy } = {}) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  let url;

  switch (type) {
    case "CATAGORY":
      url = businessSerivceUri.categoryUrl + '?';
      break;

    case "TAG":
      url = businessSerivceUri.tagUrl + '?';
      break;

    default:
      return Promise.reject(new Error("Type is missing"));
  }

  if (_.isNumber(skip)) url = url + '&skip=' + skip;
  if (_.isNumber(limit)) url = url + '&limit=' + limit;

  if (search)
    url = url + '&search=' + search;

  if (orderBy)
    url = url + '&orderBy=' + orderBy;

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
  });
}

/**
 * Add, update, delete category operation
 * @param {String} token - Verification Token
 * @param {Object} data - Category object
 */
export const categoryOperationFetch = (type, token, data) => {
  const options = {
    method: '',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  };

  switch (type) {
    case "ADD":
      options.method = "POST";
      break;

    case "UPDATE":
      options.method = "PUT";
      break;

    case "DELETE":
      options.method = "DELETE";
      break;

    default:
      return Promise.reject(new Error("Type is missing"));
  }

  return fetch(businessSerivceUri.categoryUrl, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
  });

}

/**
 * Add, update, delete tag operation
 * @param {String} token - Verification Token
 * @param {Object} data - Tag object
 */
export const tagOperationFetch = (type, token, data) => {
  const options = {
    method: '',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  };

  switch (type) {
    case "ADD":
      options.method = "POST";
      break;

    case "UPDATE":
      options.method = "PUT";
      break;

    case "DELETE":
      options.method = "DELETE";
      break;

    default:
      return Promise.reject(new Error("Type is missing"));
  }

  return fetch(businessSerivceUri.tagUrl, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
  });

}
