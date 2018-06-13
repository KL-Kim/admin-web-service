import Promise from 'bluebird';
import fetch from 'cross-fetch';
import _ from 'lodash';

import config from '../config/config';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * Review serivce uri
 */
const reviewSerivceUri = {
  commonUrl: config.API_GATEWAY_ROOT + '/api/v1/review',
  getSingleUrl: config.API_GATEWAY_ROOT + '/api/v1/review/single/',
  voteReviewUrl: config.API_GATEWAY_ROOT + '/api/v1/review/vote/',
};

/**
 * Get reviews by business id
 * @param {Number} skip - Number of reviews to skip
 * @param {Number} limit - Number of reviews to limit
 * @param {Object} filter - Reviews list filter
 * @param {search} search - Search reviews
 */
export const fetchReviews = (skip, limit, filter = {}, search) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let url = reviewSerivceUri.commonUrl + '?';

  if (skip) {
    url = url + '&skip=' + skip;
  }

  if (limit) {
    url = url + '&limit=' + limit;
  }

  if (search) {
    url = url + '&search=' + search;
  }

  if (!_.isEmpty(filter)) {
    if (filter.bid) {
      url = url + '&bid=' + filter.bid;
    }

    if (filter.uid) {
      url = url + '&uid=' + filter.uid;
    }

    if (filter.orderBy) {
      url = url + '&orderBy=' + filter.orderBy;
    }
  }

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
 * Fetch single review
 * @param {String} id - Review id
 */
export const fetchSingleReview = id => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(reviewSerivceUri.getSingleUrl + id, options)
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
 * Add, update, delete review
 * @param {String} type - UPDATE OR DELETE
 * @param {String} token - Verification token
 * @param {Object} data - Review data
 */
export const reviewOperationFetch = (type, token, data) => {
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
      options.method = 'POST';
      break;

    case "UPDATE":
      options.method = 'PUT';
      break;

    case "DELETE":
      options.method = 'DELETE';
      break;

    default:
      options.method = 'GET';
  }

  return fetch(reviewSerivceUri.commonUrl, options)
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
 * Vote review
 * @param {String} token - Verification Token
 * @param {String} id - Review id
 * @property {String} uid - User id
 * @property {String} vote - Vote
 * @property {String} businessName - Business name
 * @property {String} businessSlug - Business slug
 */
export const voteReviewFetch = (token, id, { uid, vote, businessName, businessSlug } = {}) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify({
      uid,
      vote,
      businessName,
      businessSlug,
    }),
  };

  return fetch(reviewSerivceUri.voteReviewUrl + id, options)
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
