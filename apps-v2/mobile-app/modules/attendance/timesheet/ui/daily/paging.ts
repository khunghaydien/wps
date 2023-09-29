import moment from 'moment';

import { getPeriod, Timesheet } from '@attendance/domain/models/Timesheet';

import ROOT from './actionType';

type State = {
  current: string;
  next: string;
  prev: string;
};

const ACTION_TYPE_ROOT = `${ROOT}/PAGING` as const;

const ACTIONS = {
  FETCH_SUCCESS: `${ACTION_TYPE_ROOT}/FETCH_SUCCESS`,
  SET_CURRENT: `${ACTION_TYPE_ROOT}/SET_CURRENT`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
};

const FORMAT = 'YYYY-MM-DD';

export const actions = {
  fetchSuccess: (targetDate: string, timesheet: Timesheet) => ({
    type: ACTIONS.FETCH_SUCCESS,
    payload: {
      targetDate,
      timesheet,
    },
  }),
  setCurrent: (targetDate: string) => ({
    type: ACTIONS.SET_CURRENT,
    payload: targetDate,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState: State = {
  current: '',
  prev: '',
  next: '',
};

export default (state: State = initialState, action: any): State => {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.FETCH_SUCCESS: {
      const { targetDate, timesheet } = payload;
      const currentPeriod = getPeriod(targetDate, timesheet);

      if (!currentPeriod) {
        return initialState;
      }

      const mDate = moment(targetDate);

      if (!mDate.isValid()) {
        return initialState;
      }

      const current = mDate.format(FORMAT);
      let prev = mDate.clone().subtract(1, 'day').format(FORMAT);
      let next = mDate.clone().add(1, 'day').format(FORMAT);

      if (!getPeriod(prev, timesheet)) {
        prev = '';
      }

      if (!getPeriod(next, timesheet)) {
        next = '';
      }

      return {
        current,
        prev,
        next,
      };
    }
    case ACTIONS.SET_CURRENT: {
      const mDate = moment(payload);

      if (!mDate.isValid()) {
        return initialState;
      }
      const current = mDate.format(FORMAT);
      return {
        current,
        prev: '',
        next: '',
      };
    }
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
};
