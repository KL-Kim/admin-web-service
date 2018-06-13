/**
 * Category Reducer
 */
import categoryTypes from '../constants/category.types';

const initialState = {
  categoriesList: [],
  totalCount: 0,
  isFetching: false,
  error: null,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {

    // Get business categories
    case categoryTypes.GET_CATEGORY_REQUEST:
    case categoryTypes.ADD_CATEGORY_REQUEST:
    case categoryTypes.UPDATE_CATEGORY_REQUEST:
    case categoryTypes.DELETE_CATEGORY_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: null,
      };

    case categoryTypes.GET_CATEGORY_SUCCESS:
      return {
        ...state,
        isFetching: false,
        categoriesList: action.payload.list,
        totalCount: action.payload.list.length,
      };

    case categoryTypes.GET_CATEGORY_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    default:
      return state;
  }
}

export default categoryReducer;
