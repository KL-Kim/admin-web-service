/**
 * Posts actions
 */
import _ from 'lodash';

import * as AlertActions from './alert.actions';
import { getToken } from '../api/auth.service';
import blogTypes from '../constants/blog.types';
import { fetchPostsList, addNewPostFetch, updatePostFetch, fetchSinglePost, deletePostFetch, updatePostStateFetch } from '../api/blog.service';

/**
 * Get posts list
 * @param {Object} params - Params
 */
export const getPostsList = (params) => {
  const _getPostsListRequest = () => ({
    "type": blogTypes.GET_POSTS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getPostsListSuccess = (response) => ({
    "type": blogTypes.GET_POSTS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      list: response.list,
      totalCount: response.totalCount,
    }
  });

  const _getPostsListFailure = (err) => ({
    "type": blogTypes.GET_POSTS_FAILURE,
    "meta": {},
    "error": err,
    "payload": {}
  });

  return (dispatch, getState) => {
    dispatch(_getPostsListRequest());

    return fetchPostsList(params)
      .then(response => {
        dispatch(_getPostsListSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(_getPostsListFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
};

/**
 * Get single post
 */
export const getSinglePost = (id) => {
  const _getSinglePostRequest = () => ({
    "type": blogTypes.GET_SINGLE_POST_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getSinglePostSuccess = () => ({
    "type": blogTypes.GET_SINGLE_POST_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getSinglePostFailure = (err) => ({
    "type": blogTypes.GET_SINGLE_POST_FAILURE,
    "meta": {},
    "error": err,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_getSinglePostRequest());


    return fetchSinglePost(id)
      .then(response => {
        dispatch(_getSinglePostSuccess());

        return response;
      })
      .catch(err => {
        dispatch(_getSinglePostFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}

/**
 * Add new post
 * @param {Object} params - Params
 */
export const addNewPost = (params) => {
  const _addNewPostRequset = () => ({
    "type": blogTypes.ADD_NEW_POST_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _addNewPostSuccess = () => ({
    "type": blogTypes.ADD_NEW_POST_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _addNewPostFailure = (err) => ({
    "type": blogTypes.ADD_NEW_POST_FAILURE,
    "meta": {},
    "error": err,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(params)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_addNewPostRequset());

    return getToken()
      .then(token => {
        return addNewPostFetch(token, params);
      })
      .then(response => {
        dispatch(_addNewPostSuccess());
        dispatch(AlertActions.alertSuccess("Post saved"));

        return response;
      })
      .catch(err => {
        dispatch(_addNewPostFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}


/**
 * Update post
 * @param {String} id - Post id
 * @param {Object} params - Post params
 */
export const updatePost = (id, params) => {
  const _updatePostRequset = () => ({
    "type": blogTypes.UPDATE_POST_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _updatePostSuccess = () => ({
    "type": blogTypes.UPDATE_POST_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _updatePostFailure = (err) => ({
    "type": blogTypes.UPDATE_POST_FAILURE,
    "meta": {},
    "error": err,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(params) || _.isEmpty(id)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_updatePostRequset());

    return getToken()
      .then(token => {
        return updatePostFetch(token, id, params);
      })
      .then(response => {
        dispatch(_updatePostSuccess());
        dispatch(AlertActions.alertSuccess("Post updated"));

        return response;
      })
      .catch(err => {
        dispatch(_updatePostFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}


/**
 * Delete post
 * @param {String} id - Post id
 * @param {Object} params - Post params
 */
export const deletePost = (id, params) => {
  const _deletePostRequset = () => ({
    "type": blogTypes.DELETE_POST_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _deletePostSuccess = () => ({
    "type": blogTypes.DELETE_POST_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _deletePostFailure = (err) => ({
    "type": blogTypes.DELETE_POST_FAILURE,
    "meta": {},
    "error": err,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(params) || _.isEmpty(id)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_deletePostRequset());

    return getToken()
      .then(token => {
        return deletePostFetch(token, id, params);
      })
      .then(response => {
        dispatch(_deletePostSuccess());
        dispatch(AlertActions.alertSuccess("Post deleted"));

        return response;
      })
      .catch(err => {
        dispatch(_deletePostFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}

export const updatePostState = (id, state) => {
  const _updatePostStateRequest = () => ({
    "type": blogTypes.UPDATE_POST_STATE_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _updatePostStateSuccess = () => ({
    "type": blogTypes.UPDATE_POST_STATE_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _updatePostStateFailure = (error) => ({
    "type": blogTypes.UPDATE_POST_STATE_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id) || _.isEmpty(state)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_updatePostStateRequest());

    return getToken()
      .then(token => {
        return updatePostStateFetch(token, id, state);
      })
      .then(response => {
        dispatch(_updatePostStateSuccess());
        dispatch(AlertActions.alertSuccess("Updated successfully!"));

        return response;
      })
      .catch(err => {
        dispatch(_updatePostStateFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}
