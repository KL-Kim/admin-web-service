/**
 * Business Reducer
 */
import businessTypes from '../constants/business.types';

const initialState = {
  businessList: [],
  totalCount: 0,
  isFetching: false,
  error: null,
};

const businessReducer = (state = initialState, action) => {
  switch (action.type) {
    // Clear busines reduer
    case businessTypes.CLEAR_BUSINESS_LIST:
      return initialState;

    // Resquest
    case businessTypes.GET_BUSINESS_LIST_REQUEST:
    case businessTypes.GET_SINGLE_BUSINESS_REQUEST:
    case businessTypes.ADD_BUSINESS_REQUEST:
    case businessTypes.UPDATE_BUSINESS_REQUEST:
    case businessTypes.DELETE_BUSINESS_REQUEST:
    case businessTypes.UPLOAD_IMAGES_REQUEST:
    case businessTypes.DELETE_IMAGE_REQUEST:
    case businessTypes.REPORT_BUSINESS_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: null,
      };

    case businessTypes.GET_BUSINESS_LIST_FAILURE:
    case businessTypes.GET_SINGLE_BUSINESS_FAILURE:
    case businessTypes.ADD_BUSINESS_FAILURE:
    case businessTypes.UPDATE_BUSINESS_FAILURE:
    case businessTypes.DELETE_BUSINESS_FAILURE:
    case businessTypes.UPLOAD_IMAGES_FAILURE:
    case businessTypes.DELETE_IMAGE_FAILURE:
    case businessTypes.REPORT_BUSINESS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    case businessTypes.GET_BUSINESS_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        businessList: action.payload.list,
        totalCount: action.payload.totalCount,
      };

    case businessTypes.GET_SINGLE_BUSINESS_SUCCESS:
    case businessTypes.ADD_BUSINESS_SUCCESS:
    case businessTypes.UPDATE_BUSINESS_SUCCESS:
    case businessTypes.UPLOAD_IMAGES_SUCCESS:
    case businessTypes.DELETE_IMAGE_SUCCESS:
    case businessTypes.REPORT_BUSINESS_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };

    case businessTypes.DELETE_BUSINESS_SUCCESS:
      return {
        ...state,
        businessList: {},
        isFetching: false,
      };

    default:
      return state;
  }
}

export default businessReducer;
