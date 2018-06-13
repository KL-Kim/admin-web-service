import Promise from 'bluebird';
import fetch from 'cross-fetch';
import _ from 'lodash';

import config from '../config/config';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * Pca serivce uri
 */
const pcaSerivceUri = {
  apiUrl: config.API_GATEWAY_ROOT + '/api/v1/pca',
};

/**
 * Get cities
 * @param {String} type - Province, City, Areas
 * @param {Number} code - Province code
 */
export const getPcaFetch = (type, code) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let url = pcaSerivceUri.apiUrl;

  if (_.isEqual('city', type)) {
    url = url + '/cities/' + code;
  } else if (_.isEqual('area', type)) {
    url = url + '/areas/' + code;
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
};
