/**
 * Notification Actions
 */
import _ from 'lodash';

import notificationTypes from '../constants/notification.types';
import * as AlertActions from './alert.actions';
import { getToken } from '../api/auth.service';
import { fetchNotification,
  deleteNotificationFetch,
  clearReadNotificationsFetch,
  fetchUnreadCount,
} from '../api/notification.service';

/**
 * Get all notification
 * @property {String} data.uid - User id
 * @property {Boolean} data.unRead - isRead or not
 * @property {Number} data.limit - List limit
 * @property {Number} data.skip - Number to skip
 */
export const getNotification = (data) => {
  const _getNotificationRequest = () => ({
    "type": notificationTypes.GET_NOTIFICATION_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getNotificationSuccess = (response) => ({
    "type": notificationTypes.GET_NOTIFICATION_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      totalCount: response.totalCount,
      unreadCount: response.unreadCount,
    }
  });

  const _getNotificationFailure = (error) => ({
    "type": notificationTypes.GET_NOTIFICATION_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isUndefined(data.uid)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_getNotificationRequest());
    return getToken()
      .then(token => {
        return fetchNotification(token, data);
      })
      .then(response => {
        dispatch(_getNotificationSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(_getNotificationFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}

/**
 * Get new notification count
 * @property {String} uid - User id
 */
export const getUnreadCount = (uid) => {
  const _getUnreadCountRequest = () => ({
    "type": notificationTypes.GET_UNREAD_COUNT_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getUnreadCountSuccess = (response) => ({
    "type": notificationTypes.GET_UNREAD_COUNT_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      totalCount: response.totalCount
    }
  });

  const _getUnreadCountFailure = (error) => ({
    "type": notificationTypes.GET_UNREAD_COUNT_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isUndefined(uid)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_getUnreadCountRequest());
    return getToken()
      .then(token => {
        return fetchUnreadCount(token, uid);
      })
      .then(response => {
        dispatch(_getUnreadCountSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(_getUnreadCountFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}

/**
 * Delete notification
 * @param {String} id - Notification id
 */
export const deleteNotification = (id) => {
  const _deleteNotificationRequest = () => ({
    "type": notificationTypes.DELETE_NOTIFICATION_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _deleteNotificationSuccess = (response) => ({
    "type": notificationTypes.DELETE_NOTIFICATION_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      totalCount: response.totalCount,
      unreadCount: response.unreadCount,
    }
  });

  const _deleteNotificationFailure = (error) => ({
    "type": notificationTypes.DELETE_NOTIFICATION_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isUndefined(id)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_deleteNotificationRequest());
    return getToken()
      .then(token => {
        return deleteNotificationFetch(token, id);
      })
      .then(response => {
        dispatch(_deleteNotificationSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(_deleteNotificationFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}

/**
 * Clear read notifications
 * @param {String} uid - Notification uid
 */
export const clearReadNotifications = (uid) => {
  const _clearReadNotificationsRequest = () => ({
    "type": notificationTypes.CLEAR_READ_NOTIFICATION_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _clearReadNotificationsSuccess = (response) => ({
    "type": notificationTypes.CLEAR_READ_NOTIFICATION_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      totalCount: response.totalCount,
      unreadCount: response.unreadCount,
    }
  });

  const _clearReadNotificationsFailure = (error) => ({
    "type": notificationTypes.CLEAR_READ_NOTIFICATION_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isUndefined(uid)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_clearReadNotificationsRequest());
    return getToken()
      .then(token => {
        return clearReadNotificationsFetch(token, uid);
      })
      .then(response => {
        dispatch(_clearReadNotificationsSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(_clearReadNotificationsFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}
