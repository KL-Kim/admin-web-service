/**
 * Auth Reducer
 */
import authTypes from '../constants/auth.types';

const initialState = {
  message: '',
  isFetching: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case authTypes.SEND_PHONE_VERIFICATION_CODE_REQUEST:
      return {
        ...state,
        "isFetching": true,
        "error": null,
      }
    case authTypes.SEND_PHONE_VERIFICATION_CODE_SUCCESS:
      return {
        ...state,
        "isFetching": false,
      };

    case authTypes.SEND_PHONE_VERIFICATION_CODE_FAILURE:
      return {
        ...state,
        "isFetching": false,
        error: action.error,
      };

    default:
      return state;
  }
}

export default authReducer;
