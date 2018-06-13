/**
 * Alert Actions
 */
import uuidv4 from 'uuid/v4';
import alertTypes from '../constants/alert.types';

/**
 *  Alert success
 */
export const alertSuccess = response => ({
  "type": alertTypes.ALERT_SUCCESS,
  "meta": {},
  "error": null,
  "payload": {
    "id": uuidv4(),
    "message": response
  }
});

/**
 *  Alert failure
 */
export const alertFailure = errorMessage => ({
  "type": alertTypes.ALERT_FAILURE,
  "meta": {},
  "error": true,
  "payload": {
    "id": uuidv4(),
    "message": errorMessage || 'Unknown Error'
  }
});

/**
 * Clear alert
 */
export const alertClear = () => ({
  "type": alertTypes.ALERT_CLEAR,
});
