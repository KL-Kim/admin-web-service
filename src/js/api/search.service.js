import fetch from 'cross-fetch';

import config from '../config/config';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * Search serivce uri
 */
const searchSerivceUri = {
    commonUrl: config.API_GATEWAY_ROOT + '/api/v1/search-string/admin',
};

/**
 * Get search strings list
 * @param {Number} skip
 * @param {Number} limit
 * @param {String} search
 */
export const fetchPopularSearches = (token, { skip, limit, search, isEmptyResult } = {}) => {
    const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": 'Bearer ' + token,
        },
    };
    
    let url = searchSerivceUri.commonUrl + '?';

    if (skip) url = url + '&skip=' + skip;
    if (limit) url = url + '&limit=' + limit;
    if (search) url = url + '&search=' + search;
    if (isEmptyResult) url = url + '&isEmptyResult=1';

    return fetch(url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw responseErrorHandler(response);
            }
        })
        .catch(err => {
            return Promise.reject(err);
        });
}