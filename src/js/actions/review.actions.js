/**
 * Reviews actions
 */
import _ from 'lodash';

import * as AlertActions from './alert.actions';
import { getToken } from '../api/auth.service';
import reviewTypes from '../constants/review.types';
import { fetchReviews, reviewOperationFetch, voteReviewFetch, fetchSingleReview } from '../api/review.service';

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
export const getReviews = (skip, limit, filter, search) => {
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

    return fetchReviews(skip, limit, filter, search)
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
 * Get single review
 * @param {String} id - Review id
 */
export const getSingleReview = (id) => {
  return (dispatch, getState) => {
    return fetchSingleReview(id)
      .then(response => {
        return response.review;
      })
      .catch(err => {
        dispatch(AlertActions.alertFailure(err.message));
        return ;
      })
  }
}

/**
 * Add new review
 * @param {object} data - New review data
 */
export const addNewReview = (data) => {
  const _addNewReviewRequest = () => ({
    "type": reviewTypes.ADD_NEW_REVIEW_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _addNewReviewSuccess = (response) => ({
    "type": reviewTypes.ADD_NEW_REVIEW_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      reviews: response.list,
      totalCount: response.totalCount,
    },
  });

  const _addNewReviewFailure = (error) => ({
    "type": reviewTypes.ADD_NEW_REVIEW_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });


  return (dispatch, getState) => {
    if (_.isEmpty(data)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_addNewReviewRequest());

    return getToken()
      .then(token => {
        return reviewOperationFetch("ADD", token, data);
      })
      .then(response => {
        dispatch(_addNewReviewSuccess(response));
        dispatch(AlertActions.alertSuccess("Add review successfully"));

        return ;
      })
      .catch(err => {
        dispatch(_addNewReviewFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}


/**
 * Update review
 */
export const updateReview = (data) => {
  const _updateReviewRequest = () => ({
    "type": reviewTypes.UPDATE_REVIEW_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _updateReviewSuccess = (response) => ({
    "type": reviewTypes.UPDATE_REVIEW_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      reviews: response.list,
      totalCount: response.totalCount,
    },
  });

  const _updateReviewFailure = (error) => ({
    "type": reviewTypes.UPDATE_REVIEW_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(data)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_updateReviewRequest());

    return getToken()
      .then(token => {
        return reviewOperationFetch("UPDATE", token, data)
      })
      .then(response => {
        dispatch(_updateReviewSuccess(response));
        dispatch(AlertActions.alertSuccess("Update review successfully"));

        return response;
      })
      .catch(err => {
        dispatch(_updateReviewFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}

/**
 * Delete review
 */
export const deleteReview = (data) => {
  const _deleteReviewRequest = () => ({
    "type": reviewTypes.DELETE_REVIEW_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _deleteReviewSuccess = (response) => ({
    "type": reviewTypes.DELETE_REVIEW_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      reviews: response.list,
      totalCount: response.totalCount,
    },
  });

  const _deleteReviewFailure = (error) => ({
    "type": reviewTypes.DELETE_REVIEW_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(data)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_deleteReviewRequest());

    return getToken()
      .then(token => {
        return reviewOperationFetch("DELETE", token, data)
      })
      .then(response => {
        dispatch(_deleteReviewSuccess(response));
        dispatch(AlertActions.alertSuccess("Delete review successfully"));

        return response;
      })
      .catch(err => {
        dispatch(_deleteReviewFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}

/**
 * Vote review
 * @param {String} id - Review id
 * @property {String} uid - User id
 * @property {String} vote - Vote
 * @property {String} businessName - Business name
 * @property {String} businessSlug - Business slug
 */
export const voteReview = (id, { uid, vote, businessName, businessSlug } = {}) => {
  const _voteReviewRequest = () => ({
    "type": reviewTypes.VOTE_REVIEW_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _voteReviewSuccess = (response) => ({
    "type": reviewTypes.VOTE_REVIEW_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      review: response.review
    },
  });

  const _voteReviewFailure = (error) => ({
    "type": reviewTypes.VOTE_REVIEW_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id) || _.isEmpty(uid) || _.isEmpty(vote) || _.isEmpty(businessName) || _.isEmpty(businessSlug)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_voteReviewRequest());

    return getToken()
      .then(token => {
        return voteReviewFetch(token, id, { uid, vote, businessName, businessSlug });
      })
      .then(response => {
        dispatch(_voteReviewSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(_voteReviewFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}
