/**
 * Search actions
 */
import _ from 'lodash';

import * as AlertActions from './alert.actions';
import searchTypes from '../constants/search.types';
import { getToken } from '../api/auth.service';
import { fetchPopularSearches } from '../api/search.service';

/**
 * Get errors list
 * @param {Number} skip
 * @param {Number} limit
 * @param {String} search
 */
export const getSearchesList = ({ skip, limit, search, isEmptyResult } = {}) => {
    const _getSearchesListRequest = () => ({
        "type": searchTypes.GET_SEARCHES_LIST_REQUEST,
        "meta": {},
        "error": null,
        "payload": {}
    });

    const _getSearchesListSuccess = (res) => ({
        "type": searchTypes.GET_SEARCHES_LIST_SUCCESS,
        "meta": {},
        "error": null,
        "payload": {
            list: res.list,
            totalCount: res.totalCount,
        }
    });

    const _getSearchesListFailure = (err) => ({
        "type": searchTypes.GET_SEARCHES_LIST_FAILURE,
        "meta": {},
        "error": err,
        "payload": {}
    });

    return (dispatch, getState) => {
        dispatch(_getSearchesListRequest());

        return getToken()
            .then(token => {
                return fetchPopularSearches(token, { skip, limit, search, isEmptyResult });
            })
            .then(response => {
                dispatch(_getSearchesListSuccess(response));

                return response;
            })
            .catch(err => {
                dispatch(AlertActions.alertFailure(err.message));
                dispatch(_getSearchesListFailure(err));

                return ;
            });
    }
}