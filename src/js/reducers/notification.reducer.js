/**
 * Notification Reducer
 */
import notificationTypes from '../constants/notification.types';

const initialState = {
  unreadCount: 0,
  totalCount: 0,
  isFetching: false,
  error: null,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case notificationTypes.CLEAR_NOTIFICATION_LIST:
      return initialState;

    case notificationTypes.GET_NOTIFICATION_REQUEST:
    case notificationTypes.GET_UNREAD_COUNT_REQUEST:
    case notificationTypes.DELETE_NOTIFICATION_REQUEST:
    case notificationTypes.CLEAR_READ_NOTIFICATION_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: null,
      };

    case notificationTypes.GET_NOTIFICATION_FAILURE:
    case notificationTypes.GET_UNREAD_COUNT_FAILURE:
    case notificationTypes.DELETE_NOTIFICATION_FAILURE:
    case notificationTypes.CLEAR_READ_NOTIFICATION_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    case notificationTypes.GET_NOTIFICATION_SUCCESS:
    case notificationTypes.DELETE_NOTIFICATION_SUCCESS:
    case notificationTypes.CLEAR_READ_NOTIFICATION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        totalCount: action.payload.totalCount,
        unreadCount: action.payload.unreadCount,
      };

    case notificationTypes.GET_UNREAD_COUNT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        newCount: action.payload.totalCount,
      }

    default:
      return state;
  }
}

export default notificationReducer;
