/**
 * Category Reducer
 */
import tagTypes from '../constants/tag.types';

const initialState = {
  tagsList: [],
  totalCount: 0,
  isFetching: false,
  error: null,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {

    // Get business categories
    case tagTypes.GET_TAGS_REQUEST:
    case tagTypes.ADD_TAG_REQUEST:
    case tagTypes.UPDATE_TAG_REQUEST:
    case tagTypes.DELETE_TAG_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: null,
      };

    case tagTypes.GET_TAGS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        tagsList: action.payload.list,
        totalCount: action.payload.list.length,
      };

    case tagTypes.GET_TAGS_FAILURE:
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
