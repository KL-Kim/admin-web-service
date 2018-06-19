/**
 * Comment actions
 */
import _ from 'lodash';

import * as AlertActions from './alert.actions';
import { getToken } from '../api/auth.service';
import commentTypes from '../constants/comment.types';
import { fetchCommentsList,
  editCommentFetch,
} from '../api/comment.service';

/**
 * Clear comment reducer
 */
export const clearCommentsList = () => {
  return (dispatch) => dispatch({
    "type": commentTypes.CLEAR_COMMENTS_LIST,
  });
};

/**
 * Get comments
 * @param {Number} skip - Number of comments to skip
 * @param {Number} limit - Number of comments to limit
 * @param {String} search - Search term
 * @param {String} uid - Comment user id
 * @param {String} pid - Post id
 * @param {String} status - Comment status
 * @param {String} parentId - Parent comment id
 */
export const getComments = ({ skip, limit, search, uid, pid, status, parentId, orderBy } = {}) => {
  const _getCommentsListRequest = () => ({
    "type": commentTypes.GET_COMMENTS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getCommentsListSuccess = (response) => ({
    "type": commentTypes.GET_COMMENTS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      comments: response.list,
      totalCount: response.totalCount
    },
  });

  const _getCommentsListFailure = (error) => ({
    "type": commentTypes.GET_COMMENTS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    dispatch(_getCommentsListRequest());

    return fetchCommentsList({ skip, limit, search, uid, pid, status, parentId, orderBy })
      .then(response => {
        dispatch(_getCommentsListSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(_getCommentsListFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
};

/**
 * Edit Comment by admin
 * @param {String} token - Verification token
 * @param {String} id - Comment id
 * @param {String} status - Comment status
 */
export const editComment = (id, status) => {
  const _editCommentRequest = () => ({
    "type": commentTypes.EDIT_COMMENT_REQUESET,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _editCommentSuccess = () => ({
    "type": commentTypes.EDIT_COMMENT_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _editCommentFailure = (error) => ({
    "type": commentTypes.EDIT_COMMENT_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isUndefined(id)) return dispatch(AlertActions.alertFailure("Bad request"));

    dispatch(_editCommentRequest());

    return getToken()
      .then(token => {
        return editCommentFetch(token, id, status);
      })
      .then(response => {
        dispatch(_editCommentSuccess());
        dispatch(AlertActions.alertSuccess("Updated comment successfully"));

        return response;
      })
      .catch(err => {
        dispatch(_editCommentFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
};
