import Promise from 'bluebird';
import fetch from 'cross-fetch';
import _ from 'lodash';

import config from '../config/config';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * Error serivce uri
 */
const errorSerivceUri = {
    commenUrl: config.API_GATEWAY_ROOT + '/api/v1/error',
};

/**
 * Get errors list
 * @param {*} token 
 * @param {*} param1 
 */
export const getErrorsListFetch = (token, { skip, limit, search, orderby, unChecked } = {}) => {
    const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": 'Bearer ' + token,
        },
    };

    let url = errorSerivceUri.commenUrl + '?';

    if (skip) url = url + '&skip=' + skip;
    if (limit) url = url + '&limit=' + limit;
    if (search) url = url + '&search=' + search;
    if (orderby) url = url + '&orderby=' + orderby;
    if (unChecked) url = url + '&unChecked=1';

    return fetch(url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw responseErrorHandler(response);
            }
        }).catch(err => {
            return Promise.reject(err);
        });
}

/**
 * Update error
 * @param {String} token 
 * @param {String} id
 * @param {Boolean} unChecked
 */
export const editErrorFetch = (token, { id, isChecked } = {}) => {
    const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": 'Bearer ' + token,
        },
        body: JSON.stringify({
            isChecked,
        }),
    };

    return fetch(errorSerivceUri.commenUrl + '/' + id, options)
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                throw responseErrorHandler(response);
            }
        }).catch(err => {
            return Promise.reject(err);
        });
}

/**
 * Delete error
 * @param {String} token 
 * @param {String} id 
 */
export const deleteErrorFetch = (token, id) => {
    const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": 'Bearer ' + token,
        },
    };

    return fetch(errorSerivceUri.commenUrl + '/' + id, options)
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                throw responseErrorHandler(response);
            }
        }).catch(err => {
            return Promise.reject(err);
        });
}