/**
 * Review Reducer
 */
import reviewTypes from '../constants/review.types';

const initialState = {
  reviews: [],
  totalCount: 0,
  isFetching: false,
  error: null,
};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    // Clear review reducer
    case reviewTypes.CLEAR_REVIEWS_LIST:
      return initialState;

    // Request
    case reviewTypes.GET_REVIEWS_REQUEST:
    case reviewTypes.EDIT_REVIEW_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: null,
      };

    case reviewTypes.GET_REVIEWS_FAILURE:
    case reviewTypes.EDIT_REVIEW_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    case reviewTypes.GET_REVIEWS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        reviews: action.payload.reviews,
        totalCount: action.payload.totalCount,
      };

    case reviewTypes.EDIT_REVIEW_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };

    default:
      return state;
  }
}

export default reviewReducer;
