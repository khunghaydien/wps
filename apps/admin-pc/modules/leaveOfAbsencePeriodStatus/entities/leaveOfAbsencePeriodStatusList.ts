import { Dispatch, Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../commons/actions/tab';

import {
  fetchByEmployeeId,
  LeaveOfAbsencePeriodStatus,
} from '../../../models/leave-of-absence/LeaveOfAbsencePeriodStatus';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../base/menu-pane/ui';

type State = LeaveOfAbsencePeriodStatus[];

const KEY =
  'MODULES/LEAVE_OF_ABSENCE_PERIOD_STATUS/ENTITIES/LEAVE_OF_ABSENCE_PERIOD_STATUS_LIST';
const ACTIONS = {
  SET: `${KEY}/SET`,
};

const setLeaveOfAbsenceList = (
  periodStatusList: LeaveOfAbsencePeriodStatus[]
) => ({
  type: ACTIONS.SET,
  payload: periodStatusList,
});

export const actions = {
  fetch: (employeeId: string) => (dispatch: Dispatch<any>) => {
    dispatch(loadingStart());
    return fetchByEmployeeId(employeeId)
      .then((periodStatusList) =>
        dispatch(setLeaveOfAbsenceList(periodStatusList))
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
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
