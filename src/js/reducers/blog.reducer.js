/**
 * Review Reducer
 */
import blogTypes from '../constants/blog.types';

const initialState = {
  list: [],
  totalCount: 0,
  isFetching: false,
  error: null,
};

const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    // Clear blog list
    case blogTypes.CLEAR_REVIEWS_LIST:
      return initialState;

    case blogTypes.GET_POSTS_REQUEST:
    case blogTypes.ADD_NEW_POST_REQUEST:
    case blogTypes.GET_SINGLE_POST_REQUEST:
    case blogTypes.UPDATE_POST_REQUEST:
    case blogTypes.DELETE_POST_REQUEST:
    case blogTypes.UPDATE_POST_STATE_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: null,
      };

    case blogTypes.GET_POSTS_FAILURE:
    case blogTypes.ADD_NEW_POST_FAILURE:
    case blogTypes.GET_SINGLE_POST_FAILURE:
    case blogTypes.UPDATE_POST_FAILURE:
    case blogTypes.DELETE_POST_FAILURE:
    case blogTypes.UPDATE_POST_STATE_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    case blogTypes.GET_POSTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        list: action.payload.list,
        totalCount: action.payload.totalCount,
      };

    case blogTypes.ADD_NEW_POST_SUCCESS:
    case blogTypes.GET_SINGLE_POST_SUCCESS:
    case blogTypes.UPDATE_POST_SUCCESS:
    case blogTypes.DELETE_POST_SUCCESS:
    case blogTypes.UPDATE_POST_STATE_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };

    default:
      return state;
  }
}

export default blogReducer;
