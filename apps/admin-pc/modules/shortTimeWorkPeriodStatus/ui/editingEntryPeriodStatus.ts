import { Dispatch, Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../commons/actions/tab';

import {
  EditingShortTimeWorkPeriodStatus,
  save as saveShortTimeWorkPeriodStatus,
} from '../../../models/short-time-work/ShortTimeWorkPeriodStatus';
import {
  fetch as fetchShortTimeWorkSettingList,
  FetchQuery as FetchShortTimeWorkSettingQuery,
  ShortTimeWorkSetting,
} from '../../../models/short-time-work/ShortTimeWorkSetting';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../base/menu-pane/ui';
import { actions as shortTimeWorkPeriodStatusListActions } from '../entities/shortTimeWorkPeriodStatusList';

type State = EditingShortTimeWorkPeriodStatus;

const KEY =
  'MODULES/SHORT_TIME_WORK_PERIOD_STATUS/UI/EDITING_ENTRY_PERIOD_STATUS';
const ACTIONS = {
  SET_SHORT_TIME_WORK_SETTING_LIST: `${KEY}/SET_SHORT_TIME_WORK_SETTING_LIST`,
  CLEAR_SHORT_TIME_WORK_SETTING_LIST: `${KEY}/CLEAR_SHORT_TIME_WORK_SETTING_LIST`,
  UPDATE_VALUE: `${KEY}/UPDATE_VALUE`,
  CLEAR: `${KEY}/CLEAR`,
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

  update: (key: string, value: string) => ({
    type: ACTIONS.UPDATE_VALUE,
    payload: { key, value },
  }),

  initialize: (employeeId: string) => (dispatch: Dispatch<any>) => {
    dispatch(actions.clear());
    return dispatch(shortTimeWorkPeriodStatusListActions.fetch(employeeId));
  },

  save:
    (employeeId: string, param: EditingShortTimeWorkPeriodStatus) =>
    (dispatch: Dispatch<any>) => {
      dispatch(loadingStart());
      return saveShortTimeWorkPeriodStatus(employeeId, param)
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
  shortTimeWorkSettingId: '',
  comment: '',
  shortTimeWorkSettingList: [],
};

export default ((state = initialState, action) => {
  switch (action.type) {
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
    case ACTIONS.CLEAR:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
