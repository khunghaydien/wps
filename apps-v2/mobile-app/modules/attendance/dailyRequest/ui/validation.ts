import schema from '../../../../schema/attendance/form/AttDailyRequestPage';

import { AttDailyRequest } from '@attendance/domain/models/AttDailyRequest';

import { AppDispatch } from '../../AppThunk';

// Types

export type ValidationError = {
  name: 'ValidationError';
  path: string;
  errors: string | string[];
  inner: ValidationError[];
};

// State

export type State = {
  [key: string]: string;
};

const initialState: State = {};

// Action

type Set = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/VALIDATION/SET';
  payload: ValidationError;
};

type Clear = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/VALIDATION/CLEAR';
};

type Action = Set | Clear;

const SET: Set['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/VALIDATION/SET';

const CLEAR: Clear['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/VALIDATION/CLEAR';

export const actions = {
  set: (err: ValidationError): Set => ({
    type: SET,
    payload: err,
  }),

  clear: (): Clear => ({
    type: CLEAR,
  }),

  validate:
    (target: AttDailyRequest) =>
    (dispatch: AppDispatch): Promise<boolean> => {
      return schema
        .validate(target, { abortEarly: false })
        .then(() => {
          dispatch(actions.clear());
          return true;
        })
        .catch((err: ValidationError) => {
          dispatch(actions.set(err));
          return false;
        });
    },
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SET: {
      const err = action.payload;
      if (!Array.isArray(err.inner)) {
        return {};
      }

      const validationError = err.inner.reduce(
        (acc, e: ValidationError) => ({
          ...acc,
          [e.path]: e.errors,
        }),
        {}
      );

      return {
        ...validationError,
      };
    }

    case CLEAR: {
      return initialState;
    }

    default:
      return state;
  }
};
