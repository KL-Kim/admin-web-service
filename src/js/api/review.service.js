import Promise from 'bluebird';
import fetch from 'cross-fetch';
import _ from 'lodash';

import config from '../config/config';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * Review serivce uri
 */
const reviewSerivceUri = {
  adminUrl: config.API_GATEWAY_ROOT + '/api/v1/review/admin',
};

/**
 * Get reviews by business id
 * @param {String} token - Verification token
 * @param {Number} skip - Number of reviews to skip
 * @param {Number} limit - Number of reviews to limit
 * @param {String} search - Search reviews
 * @param {String} bid - Business Id
 * @param {String} uid - User Id
 * @param {String} orderBy - List order
 */
export const fetchReviewsList = (token, { skip, limit, search, bid, uid, status, orderBy } = {}) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
  };

  let url = reviewSerivceUri.adminUrl + '?';

  if (skip) {
    url = url + '&skip=' + skip;
  }

  if (limit) {
    url = url + '&limit=' + limit;
  }

  if (search) {
    url = url + '&search=' + search;
  }

  if (bid) {
    url = url + '&bid=' + bid;
  }

  if (uid) {
    url = url + '&uid=' + uid;
  }

  if (status) {
    url = url + '&status=' + status;
  }

  if (orderBy) {
    url = url + '&orderBy=' + orderBy;
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
 * Edit review
 * @param {String} token - Verification token
 * @param {String} id - Review Id
 * @property {String} quality - Review quality
 * @property {String} status - Review status
 */
export const editReviewFetch = (token, id, { quality, status }) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify({
      quality,
      status,
    }),
  };

  return fetch(reviewSerivceUri.adminUrl + '/' + id, options)
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
