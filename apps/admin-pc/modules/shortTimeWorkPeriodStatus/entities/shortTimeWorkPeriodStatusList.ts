import { Dispatch, Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../commons/actions/tab';

import {
  fetchByEmployeeId,
  ShortTimeWorkPeriodStatus,
} from '../../../models/short-time-work/ShortTimeWorkPeriodStatus';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../base/menu-pane/ui';

type State = ShortTimeWorkPeriodStatus[];

const KEY =
  'MODULES/SHORT_TIME_WORK_PERIOD_STATUS/ENTITIES/SHORT_TIME_WORK_PERIOD_STATUS_LIST';
const ACTIONS = {
  SET: `${KEY}/SET`,
};

const setShortTimeWorkSettingList = (
  periodStatusList: ShortTimeWorkPeriodStatus[]
) => ({
  type: ACTIONS.SET,
  payload: periodStatusList,
});

export const actions = {
  fetch: (employeeId: string) => (dispatch: Dispatch<any>) => {
    dispatch(loadingStart());
    return fetchByEmployeeId(employeeId)
      .then((periodStatusList) =>
        dispatch(setShortTimeWorkSettingList(periodStatusList))
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
