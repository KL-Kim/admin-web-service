import Promise from 'bluebird';
import fetch from 'cross-fetch';

import config from '../config/config';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 *  Notification serivce uri
 */
const notificationServiceUri = {
  commonUrl: config.API_GATEWAY_ROOT + '/api/v1/notification/',
  getUnreadCountUrl: config.API_GATEWAY_ROOT + '/api/v1/notification/unread/',
  clearReadNotificationsUrl: config.API_GATEWAY_ROOT + '/api/v1/notification/clear/',
};

/**
 * Fetch notification list
 * @param {String} token - Verification token
 * @property {String} uid - User id
 * @property {Boolean} unRead - isRead or not
 * @property {Number} skip - Number to skip
 * @property {Number} limit - List limit
 */
export const fetchNotification = (token, { uid, unRead, skip, limit }) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
  };

  let url = notificationServiceUri.commonUrl + uid + '?';

  if (limit) {
    url = url + '&limit=' + limit;
  }

  if (skip) {
    url = url + '&skip=' + skip;
  }

  if (unRead) {
    url = url + '&unRead=1';
  }

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

/**
 * Fetch unread notification count
 * @param {String} token - Verification token
 * @property {String} uid - User id
 */
export const fetchUnreadCount = (token, uid) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
  };

  return fetch(notificationServiceUri.getUnreadCountUrl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

/**
 * Delete notification
 * @param {String} token - Verification token
 * @param {String} id - Notification id
 */
export const deleteNotificationFetch = (token, id) => {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
  };

  return fetch(notificationServiceUri.commonUrl + id, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

/**
 * Clear read notifications
 * @param {String} token - Verification token
 * @param {String} uid - Notification uid
 */
export const clearReadNotificationsFetch = (token, uid) => {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
  };

  return fetch(notificationServiceUri.clearReadNotificationsUrl + uid, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
}
