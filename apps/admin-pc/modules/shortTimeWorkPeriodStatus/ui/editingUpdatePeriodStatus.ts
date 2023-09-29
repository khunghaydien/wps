import { Dispatch, Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../commons/actions/tab';

import {
  del as deleteShortTimeWorkPeriodStatus,
  EditingShortTimeWorkPeriodStatus,
  ShortTimeWorkPeriodStatus,
  update as updateShortTimeWorkPeriodStatus,
} from '../../../models/short-time-work/ShortTimeWorkPeriodStatus';
import {
  fetch as fetchShortTimeWorkSettingList,
  FetchQuery as FetchShortTimeWorkSettingQuery,
  ShortTimeWorkSetting,
} from '../../../models/short-time-work/ShortTimeWorkSetting';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../base/menu-pane/ui';

type State = EditingShortTimeWorkPeriodStatus | null | undefined;

const KEY =
  'MODULES/SHORT_TIME_WORK_PERIOD_STATUS/UI/EDITING_UPDATE_PERIOD_STATUS';
const ACTIONS = {
  SET_SHORT_TIME_WORK_SETTING_LIST: `${KEY}/SET_SHORT_TIME_WORK_SETTING_LIST`,
  CLEAR_SHORT_TIME_WORK_SETTING_LIST: `${KEY}/CLEAR_SHORT_TIME_WORK_SETTING_LIST`,
  SET: `${KEY}/SET`,
  UPDATE_VALUE: `${KEY}/UPDATE_VALUE`,
  UNSET: `${KEY}/UNSET`,
};

const setShortTimeWorkSettingList = (settingList: ShortTimeWorkSetting[]) => ({
  type: ACTIONS.SET_SHORT_TIME_WORK_SETTING_LIST,
  payload: settingList,
});

export const actions = {
  fetchShortTimeWorkSettingList:
    (param: FetchShortTimeWorkSettingQuery) => (dispatch: Dispatch<any>) => {
      dispatch(loadingStart());
      return fetchShortTimeWorkSettingList(param)
        .then((settingList) =>
          dispatch(setShortTimeWorkSettingList(settingList))
        )
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .then(() => dispatch(loadingEnd()));
    },

  clearShortTimeWorkSettingList: () => ({
    type: ACTIONS.CLEAR_SHORT_TIME_WORK_SETTING_LIST,
  }),

  set: (periodStatus: ShortTimeWorkPeriodStatus) => ({
    type: ACTIONS.SET,
    payload: periodStatus,
  }),

  update: (key: string, value: string) => ({
    type: ACTIONS.UPDATE_VALUE,
    payload: { key, value },
  }),

  initialize:
    (
      periodStatus: ShortTimeWorkPeriodStatus,
      companyId: string,
      employeeId: string
    ) =>
    (dispatch: Dispatch<any>) => {
      dispatch(actions.set(periodStatus));
      return dispatch(
        actions.fetchShortTimeWorkSettingList({
          companyId,
          employeeId,
          targetDate: periodStatus.validDateFrom,
        })
      );
    },

  save:
    (
      employeeId: string,
      param: EditingShortTimeWorkPeriodStatus,
      onSuccess: () => void = () => {}
    ) =>
    (dispatch: Dispatch<any>) => {
      dispatch(loadingStart());
      return updateShortTimeWorkPeriodStatus(employeeId, param)
        .then(() => dispatch(actions.unset()))
        .then(onSuccess)
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .then(() => dispatch(loadingEnd()));
    },

  delete:
    (
      param: EditingShortTimeWorkPeriodStatus,
      onSuccess: () => void = () => {}
    ) =>
    (dispatch: Dispatch<any>) => {
      dispatch(loadingStart());
      return deleteShortTimeWorkPeriodStatus(param)
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
        shortTimeWorkSettingList: [],
      };

    case ACTIONS.UPDATE_VALUE:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    case ACTIONS.SET_SHORT_TIME_WORK_SETTING_LIST:
      return {
        ...state,
        shortTimeWorkSettingList: action.payload,
      };

    case ACTIONS.CLEAR_SHORT_TIME_WORK_SETTING_LIST:
      return {
        ...state,
        shortTimeWorkSettingId: '',
        shortTimeWorkSettingList: [],
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
