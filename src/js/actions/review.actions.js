/**
 * Reviews actions
 */
import _ from 'lodash';

import * as AlertActions from './alert.actions';
import { getToken } from '../api/auth.service';
import reviewTypes from '../constants/review.types';
import { fetchReviewsList, editReviewFetch, fetchSingleReview } from '../api/review.service';

/**
 * Clear review reducer
 */
export const clearReviewsList = () => {
  return (dispatch) => dispatch({
    "type": reviewTypes.CLEAR_REVIEWS_LIST,
  });
};

/**
 * Get reviews
 * @param {Number} skip - Number of reviews to skip
 * @param {Number} limit - Number of reviews to limit
 * @param {Object} filter - Reviews list filter
 * @param {search} search - Search reviews
 */
export const getReviews = ({ skip, limit, search, bid, uid, orderBy } = {}) => {
  const _getReviewsRequest = () => ({
    "type": reviewTypes.GET_REVIEWS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getReviewsSuccess = (response) => ({
    "type": reviewTypes.GET_REVIEWS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      reviews: response.list,
      totalCount: response.totalCount
    }
  });

  const _getReviewsFailure = (error) => ({
    "type": reviewTypes.GET_REVIEWS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    dispatch(_getReviewsRequest());

    return getToken()
      .then(token => {
        return fetchReviewsList(token, { skip, limit, search, bid, uid, orderBy });
      })
      .then(response => {
        dispatch(_getReviewsSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(_getReviewsFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}

/**
 * Edit review
 * @param {String} id - Review Id
 * @param {Object} data - Review data
 */
export const editReview = (id, data) => {
  const _editReviewRequest = () => ({
    "type": reviewTypes.EDIT_REVIEW_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _editReviewSuccess = (response) => ({
    "type": reviewTypes.EDIT_REVIEW_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _editReviewFailure = (error) => ({
    "type": reviewTypes.EDIT_REVIEW_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id) || _.isEmpty(data)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_editReviewRequest());

    return getToken()
      .then(token => {
        return editReviewFetch(token, id, data)
      })
      .then(response => {
        dispatch(_editReviewSuccess());
        dispatch(AlertActions.alertSuccess("Update review successfully"));

        return response;
      })
      .catch(err => {
        dispatch(_editReviewFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}
