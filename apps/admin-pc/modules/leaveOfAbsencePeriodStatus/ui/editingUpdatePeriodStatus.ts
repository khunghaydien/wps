import { Dispatch, Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../commons/actions/tab';

import {
  del,
  LeaveOfAbsencePeriodStatus,
  update,
} from '../../../models/leave-of-absence/LeaveOfAbsencePeriodStatus';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../base/menu-pane/ui';

type State = LeaveOfAbsencePeriodStatus | null | undefined;

const KEY =
  'MODULES/LEAVE_OF_ABSENCE_PERIOD_STATUS/UI/EDITING_UPDATE_PERIOD_STATUS';
const ACTIONS = {
  SET: `${KEY}/SET`,
  UPDATE_VALUE: `${KEY}/UPDATE_VALUE`,
  UNSET: `${KEY}/UNSET`,
};

export const actions = {
  set: (periodStatus: LeaveOfAbsencePeriodStatus) => ({
    type: ACTIONS.SET,
    payload: periodStatus,
  }),

  update: (key: string, value: string) => ({
    type: ACTIONS.UPDATE_VALUE,
    payload: { key, value },
  }),

  save:
    (
      employeeId: string,
      param: LeaveOfAbsencePeriodStatus,
      onSuccess: () => void = () => {}
    ) =>
    (dispatch: Dispatch<any>) => {
      dispatch(loadingStart());
      return update(employeeId, param)
        .then(() => dispatch(actions.unset()))
        .then(onSuccess)
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .then(() => dispatch(loadingEnd()));
    },

  delete:
    (param: LeaveOfAbsencePeriodStatus, onSuccess: () => void = () => {}) =>
    (dispatch: Dispatch<any>) => {
      dispatch(loadingStart());
      return del(param)
        .then(() => dispatch(actions.unset()))
        .then(onSuccess)
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .then(() => dispatch(loadingEnd()));
    },

  unset: () => ({
    type: ACTIONS.UNSET,
  }),
};

const initialState: State = null;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return {
        ...action.payload,
      };

    case ACTIONS.UPDATE_VALUE:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    case SELECT_TAB:
    case CHANGE_COMPANY:
    case SELECT_MENU_ITEM:
    case ACTIONS.UNSET:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
