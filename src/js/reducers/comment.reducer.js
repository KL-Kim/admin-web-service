/**
 * Comment Reducer
 */
import commentTypes from '../constants/comment.types';

const initialState = {
  comments: [],
  totalCount: 0,
  isFetching: false,
  error: null,
};

const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    // Clear comment reducer
    case commentTypes.CLEAR_COMMENTS_LIST:
      return initialState;

    case commentTypes.GET_COMMENTS_REQUEST:
    case commentTypes.EDIT_COMMENT_REQUESET:
      return {
        ...state,
        isFetching: true,
        error: null,
      };

    case commentTypes.GET_COMMENTS_FAILURE:
    case commentTypes.EDIT_COMMENT_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    case commentTypes.GET_COMMENTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        comments: action.payload.comments,
        totalCount: action.payload.totalCount,
      };

    case commentTypes.EDIT_COMMENT_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };

    default:
      return state;
  }
};

export default commentReducer;
