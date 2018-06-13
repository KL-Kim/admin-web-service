import Promise from 'bluebird';
import fetch from 'cross-fetch';
import _ from 'lodash';

import config from '../config/config';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * Comment serivce uri
 */
const commentSerivceUri = {
  commonUrl: config.API_GATEWAY_ROOT + '/api/v1/comment',
  getSingleUrl: config.API_GATEWAY_ROOT + '/api/v1/comment/single/',
  voteCommentUrl: config.API_GATEWAY_ROOT + '/api/v1/comment/vote/',
  adminCommonUrl: config.API_GATEWAY_ROOT + '/api/v1/comment/admin/'
};

/**
 * Fetch comments list
 * @param {Number} skip - Number of comments to skip
 * @param {Number} limit - Number of comments to limit
 * @param {String} search - Search term
 * @param {String} uid - Comment user id
 * @param {String} pid - Post id
 * @param {String} status - Comment status
 * @param {String} parentId - Parent comment id
 */
export const fetchCommentsList = ({ skip, limit, search, uid, pid, status, parentId, orderBy } = {}) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let url = commentSerivceUri.commonUrl + '?';

  if (skip) {
    url = url + '&skip=' + skip;
  }

  if (limit) {
    url = url + '&limit=' + limit;
  }

  if (search) {
    url = url + '&search=' + search;
  }

  if (uid) {
    url = url + '&uid=' + uid;
  }

  if (pid) {
    url = url + '&pid=' + pid;
  }

  if (status) {
    url = url + '&status=' + status;
  }

  if (parentId) {
    url = url + '&parentId=' + parentId
  }

  if (orderBy) {
    url = url + '&orderBy=' + orderBy
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

/**
 * Add new comment
 * @param {String} token - Verification Token
 * @property {String} Content - Comment content
 * @property {String} userId - User id
 * @property {String} postId - Post id
 * @property {String} parentId - Parent comment id
 * @property {String} replyToUser - Reply to user
 */
export const addNewCommentFetch = (token, { content, userId, postId, parentId, replyToUser } = {}) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify({
      content,
      uid: userId,
      pid: postId,
      parentId,
      replyToUser,
    }),
  };

  return fetch(commentSerivceUri.commonUrl, options)
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

/**
 * Delete comment
 * @param {String} token - Verification Token
 * @param {String} id - Comment id
 * @param {String} userId - User id
 */
export const deleteCommentFetch = (token, id, uid) => {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify({
      uid: uid
    }),
  };

  return fetch(commentSerivceUri.commonUrl + '/' + id, options)
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

/**
 * Vote comment
 * @param {String} token - Verification Token
 * @param {String} id - Comment id
 * @property {String} uid - user id
 * @property {String} postTitle - Post title
 */
export const voteCommentFetch = (token, id, { uid, vote, postTitle } = {}) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify({
      uid,
      vote,
      postTitle,
    }),
  };

  return fetch(commentSerivceUri.voteCommentUrl + id, options)
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
 * Update Comment Status by admin
 * @param {String} token - Verification token
 * @param {String} id - Comment id
 * @param {String} status - Comment status
 */
export const updateCommentStatusFetch = (token, id, status) => {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify({
      status,
    }),
  };

  return fetch(commentSerivceUri.adminCommonUrl + id, options)
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
