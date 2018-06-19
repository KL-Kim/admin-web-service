/**
 * Auth Actions
 */
import _ from 'lodash';
import authTypes from '../constants/auth.types';

import * as AlertActions from './alert.actions';
import { requestSendPhoneVerificationCodeFetch } from '../api/auth.service';

/**
 * Send phone verification code
 * @param {string} phoneNumer - mobile phone number
 */
export const sendPhoneVerificationCode = (phoneNumber) => {
  const _sendPhoneVerificationCodeRequest = () => ({
    "type": authTypes.SEND_PHONE_VERIFICATION_CODE_REQUEST,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _sendPhoneVerificationCodeSuccess = () => ({
    "type": authTypes.SEND_PHONE_VERIFICATION_CODE_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _sendPhoneVerificationCodeFailure = (error) => ({
    "type": authTypes.SEND_PHONE_VERIFICATION_CODE_FAILURE,
    "meta": {},
    "error": error,
    "payload": {},
  });

  return (dispatch, getState) => {
    if (_.isEmpty(phoneNumber)) {
      const err = new Error("Phone number missing");
      dispatch(AlertActions.alertFailure(err.message));
      return Promise.reject(err);
    }

    dispatch(_sendPhoneVerificationCodeRequest());

    return requestSendPhoneVerificationCodeFetch(phoneNumber)
      .then(response => {
        dispatch(_sendPhoneVerificationCodeSuccess());
        dispatch(AlertActions.alertSuccess("Send verification code successfully"));

        return true;
      })
      .catch(err => {
        dispatch(_sendPhoneVerificationCodeFailure(err));

        if (err.message) {
          dispatch(AlertActions.alertFailure(err.message));
        }
        return false;
      });
  };
};
