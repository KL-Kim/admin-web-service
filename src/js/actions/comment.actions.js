/**
 * Comment actions
 */
import _ from 'lodash';

import * as AlertActions from './alert.actions';
import { getToken } from '../api/auth.service';
import commentTypes from '../constants/comment.types';
import { fetchCommentsList,
  updateCommentStatusFetch,
  addNewCommentFetch,
  voteCommentFetch,
  deleteCommentFetch,
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
 * Add new comment
 * @property {String} Content - Comment content
 * @property {String} userId - User id
 * @property {String} postId - Post id
 * @property {String} parentId - Parent comment id
 * @property {String} replyToUser - Reply to user
 */
export const addNewComment = ({ content, userId, postId, parentId, replyToUser } = {}) => {
  const _addNewCommentRequest = () => ({
    "type": commentTypes.ADD_NEW_COMMENT_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _addNewCommentSuccess = () => ({
    "type": commentTypes.ADD_NEW_COMMENT_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _addNewCommentFailure = (error) => ({
    "type": commentTypes.ADD_NEW_COMMENT_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if(_.isUndefined(userId) || _.isUndefined(postId) || _.isUndefined(content)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_addNewCommentRequest());

    return getToken()
      .then(token => {
        return addNewCommentFetch(token, { content, userId, postId, parentId, replyToUser });
      })
      .then(response => {
        dispatch(_addNewCommentSuccess());
        dispatch(AlertActions.alertSuccess("Add comment successfully"));

        return response;
      })
      .catch(err => {
        dispatch(_addNewCommentFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      })
  }
}

/**
 * Delete comment
 * @param {String} id - Comment id
 * @param {String} userId - User id
 */
export const deleteComment = (id, uid) => {
  const _deleteCommentRequest = () => ({
    "type": commentTypes.DELETE_COMMENT_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _deleteCommentSuccess = (response) => ({
    "type": commentTypes.DELETE_COMMENT_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _deleteCommentFailure = (error) => ({
    "type": commentTypes.DELETE_COMMENT_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isUndefined(id) || _.isUndefined(uid)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_deleteCommentRequest());
    return getToken()
      .then(token => {
        return deleteCommentFetch(token, id, uid);
      })
      .then(response => {
        dispatch(_deleteCommentSuccess(response));
        dispatch(AlertActions.alertSuccess("Delete successfully!"));

        return response;
      })
      .catch(err => {
        dispatch(_deleteCommentFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}

/**
 * Vote comment
 */
export const voteComment = (id, { uid, vote, postTitle } = {}) => {
  const _voteCommentRequest = () => ({
    "type": commentTypes.VOTE_COMMENT_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _voteCommentSuccess = (response) => ({
    "type": commentTypes.VOTE_COMMENT_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _voteCommentFailure = (error) => ({
    "type": commentTypes.VOTE_COMMENT_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isUndefined(id) || _.isUndefined(uid) || _.isUndefined(vote) || _.isUndefined(postTitle))
      return dispatch(AlertActions.alertFailure("Bad request"));

    return getToken()
      .then(token => {
        return voteCommentFetch(token, id, { uid, vote, postTitle });
      })
      .then(response => {
        dispatch(_voteCommentSuccess());
        dispatch(AlertActions.alertSuccess("Vote successfully!"));

        return response;
      })
      .catch(err => {
        dispatch(_voteCommentFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}

/**
 * Update Comment Status by admin
 * @param {String} token - Verification token
 * @param {String} id - Comment id
 * @param {String} status - Comment status
 */
export const updateCommentStatus = (id, status) => {
  const _updateCommentStatusRequest = () => ({
    "type": commentTypes.UPDATE_COMMENT_STATUS_REQUESET,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _updateCommentStatusSuccess = () => ({
    "type": commentTypes.UPDATE_COMMENT_STATUS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _updateCommentStatusFailure = (error) => ({
    "type": commentTypes.UPDATE_COMMENT_STATUS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isUndefined(id)) return dispatch(AlertActions.alertFailure("Bad request"));

    dispatch(_updateCommentStatusRequest());

    return getToken()
      .then(token => {
        return updateCommentStatusFetch(token, id, status);
      })
      .then(response => {
        dispatch(_updateCommentStatusSuccess());
        dispatch(AlertActions.alertSuccess("Updated comment successfully"));

        return response;
      })
      .catch(err => {
        dispatch(_updateCommentStatusFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
};
