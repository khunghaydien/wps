import { $PropertyType } from 'utility-types';

import { AppDispatch } from './AppThunk';

// State

type State = {
  message: string | React.ReactNode;
  callback: () => void;
};

const initialState: State = {
  message: '',
  callback: () => {},
};

// Action

type SetAlert = {
  type: 'MOBILE_APP/MODULES/COMMONS/ALERT/SET_ALERT';
  payload: {
    message: string | React.ReactNode;
    callback: () => void;
  };
};

type ClearAlert = {
  type: 'MOBILE_APP/MODULES/COMMONS/ALERT/CLEAR_ALERT';
};

type Action = SetAlert | ClearAlert;

const SET_ALERT: $PropertyType<SetAlert, 'type'> =
  'MOBILE_APP/MODULES/COMMONS/ALERT/SET_ALERT';

const CLEAR_ALERT: $PropertyType<ClearAlert, 'type'> =
  'MOBILE_APP/MODULES/COMMONS/ALERT/CLEAR_ALERT';

const setAlert = (message: string | React.ReactNode, callback: () => void): SetAlert => ({
  type: SET_ALERT,
  payload: { message, callback },
});

const clearAlert = (): ClearAlert => ({
  type: CLEAR_ALERT,
});

export const showAlert =
  (message : string | React.ReactNode = '') =>
  (dispatch: AppDispatch): Promise<void> =>
    new Promise((resolve) => {
      dispatch(
        setAlert(message, () => {
          dispatch(clearAlert());
          resolve();
        })
      );
    });

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SET_ALERT:
      return {
        ...action.payload,
      };
    case CLEAR_ALERT:
      return initialState;
    default:
      return state;
  }
};
