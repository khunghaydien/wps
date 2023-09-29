import { Dispatch, Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../commons/actions/tab';

import {
  fetch,
  FetchQuery,
  LeaveOfAbsence,
} from '../../../models/leave-of-absence/LeaveOfAbsence';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../base/menu-pane/ui';

type State = LeaveOfAbsence[];

const KEY =
  'MODULES/LEAVE_OF_ABSENCE_PERIOD_STATUS/ENTITIES/LEAVE_OF_ABSENCE_LIST';
const ACTIONS = {
  SET: `${KEY}/SET`,
  UNSET: `${KEY}/UNSET`,
};

const setLeaveOfAbsenceList = (leaveOfAbsenceList: LeaveOfAbsence[]) => ({
  type: ACTIONS.SET,
  payload: leaveOfAbsenceList,
});

export const actions = {
  clear: () => ({
    type: ACTIONS.UNSET,
  }),

  fetch: (param: FetchQuery) => (dispatch: Dispatch<any>) => {
    dispatch(loadingStart());
    return fetch(param)
      .then((leaveOfAbsenceList) =>
        dispatch(setLeaveOfAbsenceList(leaveOfAbsenceList))
      )
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  },
};

const initialState: State = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;

    case SELECT_TAB:
    case CHANGE_COMPANY:
    case SELECT_MENU_ITEM:
    case ACTIONS.UNSET:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
