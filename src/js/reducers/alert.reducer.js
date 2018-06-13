/**
 * Alert Reducer
 */
import alertTypes from '../constants/alert.types';

const initialState = {
  message: '',
  error: false
};

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case alertTypes.ALERT_SUCCESS:
      return {
        ...state,
        id: action.payload.id,
        message: action.payload.message,
        error: false
      };

    case alertTypes.ALERT_FAILURE:
      return {
        ...state,
        id: action.payload.id,
        message: action.payload.message,
        error: true,
      };

    case alertTypes.ALERT_CLEAR:
      return {};

    default:
      return state;
  }
}

export default alertReducer;
