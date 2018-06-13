/**
 * Pca Actions
 */
import _ from 'lodash';
import Promise from 'bluebird';
import pcaTypes from '../constants/pca.types';
import { getPcaFetch } from '../api/pca.service';

/**
 * Get cities
 * @param {Number} code - Province code
 */
export const getCities = (code) => {
  const _requestGetCities = () => ({
    "type": pcaTypes.GET_CITIES_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getCitiesSuccess = (cities) => ({
    "type": pcaTypes.GET_CITIES_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "cities": cities
    },
  });

  const _getCitiesFailure = (error) => ({
    "type": pcaTypes.GET_CITIES_REQUEST,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(code)) {
      const error = new Error("Code missing");
      return Promise.reject(error);
    }

    dispatch(_requestGetCities());

    return getPcaFetch('city', code)
      .then(res => {
        return dispatch(_getCitiesSuccess(res));
      }).catch(err => {
        return dispatch(_getCitiesFailure(err));
      });
  };
}

/**
 * Get areas
 * @param {Number} code - City code
 */
export const getAreas = (code) => {
  const _requestGetAreas = () => ({
    "type": pcaTypes.GET_AREAS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getAreasSuccess = (areas) => ({
    "type": pcaTypes.GET_AREAS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "areas": areas
    },
  });

  const _getAreasFailure = (error) => ({
    "type": pcaTypes.GET_AREAS_REQUEST,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(code)) {
      const error = new Error("Code missing");
      return Promise.reject(error);
    }

    dispatch(_requestGetAreas());

    return getPcaFetch('area', code)
      .then(res => {
        return dispatch(_getAreasSuccess(res));
      }).catch(err => {
        return dispatch(_getAreasFailure(err));
      });
  };
}
