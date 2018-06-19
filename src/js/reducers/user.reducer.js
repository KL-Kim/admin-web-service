/**
 * User Reducer
 */
import userTypes from '../constants/user.types.js';
import emailTypes from '../constants/email.types.js';

const initialState = {
  "user": {},
  "isFetching": false,
  "isLoggedIn": false,
  "error": null,
  "updatedAt": null,
  "list": [],
  "totalCount": 0,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {

    case emailTypes.SEND_EMAIL_REQUEST:
    case userTypes.LOGIN_REQUEST:
    case userTypes.GET_MYSELF_REQUEST:
    case userTypes.LOGOUT_REQUEST:
    case userTypes.GET_USERS_LIST_REQUEST:
    case userTypes.GET_SINGLE_USER_REQUEST:
    case userTypes.EDIT_USER_REQUEST:
      return {
        ...state,
        "isFetching": true,
        "error": null,
      };

    case emailTypes.SEND_EMAIL_FAILURE:
    case userTypes.LOGIN_FAILURE:
    case userTypes.GET_MYSELF_FAILURE:
    case userTypes.LOGOUT_FAILURE:
    case userTypes.GET_USERS_LIST_FAILURE:
    case userTypes.GET_SINGLE_USER_FAILURE:
    case userTypes.EDIT_USER_FAILURE:
      return {
        ...state,
        "isFetching": false,
        "error": action.error,
      };

    case emailTypes.SEND_EMAIL_SUCCESS:
    case userTypes.GET_SINGLE_USER_SUCCESS:
    case userTypes.EDIT_USER_SUCCESS:
      return {
        ...state,
        "isFetching": false,
      };

    case userTypes.LOGIN_SUCCESS:
    case userTypes.GET_MYSELF_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "isLoggedIn": true,
        "user": action.payload.user,
        "updatedAt": Date.now(),
      };

    case userTypes.GET_USERS_LIST_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "list": action.payload.list,
        "totalCount": action.payload.totalCount,
      };

    case userTypes.LOGOUT_SUCCESS:
      return initialState;

    default:
      return state;
  }
}

export default userReducer;
