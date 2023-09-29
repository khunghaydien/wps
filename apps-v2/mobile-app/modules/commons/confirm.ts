import { $PropertyType } from 'utility-types';

import { AppDispatch } from './AppThunk';

// State

type State = {
  message: string;
  callback: (arg0: boolean) => void;
};

const initialState: State = {
  message: '',
  callback: (_: boolean) => {},
};

// Action

type SetConfirm = {
  type: 'MOBILE_APP/MODULES/COMMONS/CONFIRM/SET_COMFIRM';
  payload: {
    message: string;
    callback: (arg0: boolean) => void;
  };
};

type ClearConfirm = {
  type: 'MOBILE_APP/MODULES/COMMONS/CONFIRM/CLEAR_COMFIRM';
};

type Action = SetConfirm | ClearConfirm;

const SET_COMFIRM: $PropertyType<SetConfirm, 'type'> =
  'MOBILE_APP/MODULES/COMMONS/CONFIRM/SET_COMFIRM';

const CLEAR_COMFIRM: $PropertyType<ClearConfirm, 'type'> =
  'MOBILE_APP/MODULES/COMMONS/CONFIRM/CLEAR_COMFIRM';

const setConfirm = (
  message: string,
  callback: (arg0: boolean) => void
): SetConfirm => ({
  type: SET_COMFIRM,
  payload: { message, callback },
});

const clearConfirm = (): ClearConfirm => ({
  type: CLEAR_COMFIRM,
});

export const showConfirm =
  (message = '') =>
  (dispatch: AppDispatch): Promise<boolean> =>
    new Promise((resolve) => {
      dispatch(
        setConfirm(message, (result: boolean) => {
          dispatch(clearConfirm());
          resolve(result);
        })
      );
    });

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SET_COMFIRM:
      return {
        ...action.payload,
      };
    case CLEAR_COMFIRM:
      return initialState;
    default:
      return state;
  }
};
