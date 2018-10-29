/**
 * Search Reducer
 */
import searchTypes from '../constants/search.types';

const initialState = {
    list: [],
    totalCount: 0,
    error: false,
    isFetching: false,
};

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case searchTypes.GET_SEARCHES_LIST_REQUEST:
          return {
            ...state,
            isFetching: true,
          };
    
        case searchTypes.GET_SEARCHES_LIST_FAILURE:
          return {
            ...state,
            isFetching: false,
            error: action.error,
          };
    
        case searchTypes.GET_SEARCHES_LIST_SUCCESS:
          return {
              ...state,
              isFetching: false,
              list: [...action.payload.list],
              totalCount: action.payload.totalCount,
          };
    
        default:
          return state;
      }
};

export default searchReducer;