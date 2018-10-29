/**
 * Error Reducer
 */
import errorTypes from '../constants/error.types';

const initialState = {
  list: [],
  totalCount: 0,
  isFetching: false,
  error: null,
};

const errorReducer = (state = initialState, action) => {
    switch (action.type) {
      // Clear review reducer
      case errorTypes.CLEAR_REVIEWS_LIST:
        return initialState;
  
      // Request
      case errorTypes.GET_ERRORS_LIST_REQUEST:
      case errorTypes.EDIT_ERROR_REQUEST:
      case errorTypes.DELETE_ERROR_REQUEST:
        return {
          ...state,
          isFetching: true,
        };
  
      case errorTypes.GET_ERRORS_LIST_FAILURE:
      case errorTypes.EDIT_ERROR_FAILURE:
      case errorTypes.DELETE_ERROR_FAILURE:
        return {
          ...state,
          isFetching: false,
          error: action.error,
        };
      
      case errorTypes.EDIT_ERROR_SUCCESS:
      case errorTypes.DELETE_ERROR_SUCCESS:
        return {
          ...state,
          isFetching: false,
        };
  
      case errorTypes.GET_ERRORS_LIST_SUCCESS:
        return {
          ...state,
          isFetching: false,
          list: [...action.payload.list],
          totalCount: action.payload.totalCount,
        };
  
      default:
        return state;
    }
}
  
export default errorReducer;
