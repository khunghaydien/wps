import { Dispatch, Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../commons/actions/tab';

import {
  fetch as fetchPlannerSetting,
  PlannerSetting,
} from '../../../models/planner-setting/PlannerSetting';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../base/menu-pane/ui';

type State = PlannerSetting;

const initialState: State = {
  useCalendarAccess: false,
};

export const ACTIONS = {
  UNSET: 'ADMIN/PLANNER_SETTING/ENTITIES/PLANNER_SETTING/UNSET',
  SET: 'ADMIN/PLANNER_SETTING/ENTITIES/PLANNER_SETTING/SET',
};

const setPlannerSetting = (plannerSetting: PlannerSetting) => ({
  type: ACTIONS.SET,
  payload: plannerSetting,
});

export const actions = {
  clear: () => ({
    type: ACTIONS.UNSET,
  }),

  fetch: (companyId: string) => (dispatch: Dispatch<any>) => {
    dispatch(loadingStart());
    return fetchPlannerSetting({ companyId })
      .then((res: PlannerSetting) => dispatch(setPlannerSetting(res)))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  },
};

export default ((state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;

    case ACTIONS.UNSET:
    case SELECT_MENU_ITEM:
    case CHANGE_COMPANY:
    case SELECT_TAB:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
