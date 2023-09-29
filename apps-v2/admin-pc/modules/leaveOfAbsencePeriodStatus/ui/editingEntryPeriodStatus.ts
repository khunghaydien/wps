import { Dispatch, Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../commons/actions/tab';

import {
  LeaveOfAbsencePeriodStatus,
  save,
} from '../../../models/leave-of-absence/LeaveOfAbsencePeriodStatus';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../base/menu-pane/ui';
import { actions as leaveOfAbsencePeriodStatusListActions } from '../entities/leaveOfAbsencePeriodStatusList';

type State = LeaveOfAbsencePeriodStatus;

const KEY =
  'MODULES/LEAVE_OF_ABSENCE_PERIOD_STATUS/UI/EDITING_ENTRY_PERIOD_STATUS';
const ACTIONS = {
  UPDATE_VALUE: `${KEY}/UPDATE_VALUE`,
  CLEAR: `${KEY}/CLEAR`,
};

export const actions = {
  update: (key: string, value: string) => ({
    type: ACTIONS.UPDATE_VALUE,
    payload: { key, value },
  }),

  initialize: (employeeId: string) => (dispatch: Dispatch<any>) => {
    dispatch(actions.clear());
    return dispatch(leaveOfAbsencePeriodStatusListActions.fetch(employeeId));
  },

  save:
    (employeeId: string, param: LeaveOfAbsencePeriodStatus) =>
    (dispatch: Dispatch<any>) => {
      dispatch(loadingStart());
      return save(employeeId, param)
        .then(() => dispatch(actions.initialize(employeeId)))
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .then(() => dispatch(loadingEnd()));
    },

  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState: State = {
  validDateFrom: '',
  validDateThrough: '',
  leaveOfAbsenceId: '',
  comment: '',
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_VALUE:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    case SELECT_TAB:
    case CHANGE_COMPANY:
    case SELECT_MENU_ITEM:
    case ACTIONS.CLEAR:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
