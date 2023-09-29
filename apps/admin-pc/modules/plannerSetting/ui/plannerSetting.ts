import { Dispatch, Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../commons/actions/tab';
import UrlUtil from '../../../../commons/utils/UrlUtil';

import {
  fetchAuthURL as fetchPlannerSettingAuthURL,
  PlannerSetting,
  save as savePlannerSetting,
} from '../../../models/planner-setting/PlannerSetting';

import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../base/menu-pane/ui';

type State = PlannerSetting | null | undefined;

const initialState: State = null;

export const ACTIONS = {
  START_EDITING: 'ADMIN/PLANNER_SETTING/UI/PLANNER_SETTING/START_EDITING',
  CANCEL_EDITING: 'ADMIN/PLANNER_SETTING/UI/PLANNER_SETTING/CANCEL_EDITING',
  UNSET: 'ADMIN/PLANNER_SETTING/UI/PLANNER_SETTING/UNSET',
  UPDATE: 'ADMIN/PLANNER_SETTING/UI/PLANNER_SETTING/UPDATE',
};

const openAndWatchWindow = (url: string, interval = 500): Promise<void> => {
  const newWindow = window.open(url);
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (newWindow.closed) {
        clearInterval(timer);
        resolve();
      }
    }, interval);
  });
};

export const actions = {
  unset: () => {
    return {
      type: ACTIONS.UNSET,
    };
  },
  startEditing: (plannerSetting: PlannerSetting) => {
    return {
      type: ACTIONS.START_EDITING,
      payload: plannerSetting,
    };
  },
  cancelEditing: () => {
    return {
      type: ACTIONS.CANCEL_EDITING,
    };
  },
  update: (key: string, value: any) => ({
    type: ACTIONS.UPDATE,
    payload: {
      key,
      value,
    },
  }),
  save:
    (companyId: string, plannerSetting: PlannerSetting, onSuccess: () => any) =>
    (dispatch: Dispatch<any>) => {
      dispatch(loadingStart());
      return savePlannerSetting(companyId, plannerSetting)
        .then(onSuccess)
        .then(() => dispatch(actions.unset()))
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .then(() => dispatch(loadingEnd()));
    },
  openAuthWindow:
    (companyId: string, onClose: () => any) => (dispatch: Dispatch<any>) => {
      dispatch(loadingStart());
      return fetchPlannerSettingAuthURL(companyId)
        .then((url) => {
          dispatch(loadingEnd());
          return openAndWatchWindow(url);
        })
        .then(onClose)
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .then(() => dispatch(loadingEnd()));
    },
  openRemoteSiteSettingWindow: (onClose: () => any) => (): Promise<void> => {
    const url = UrlUtil.isLex()
      ? '/lightning/setup/SecurityRemoteProxy/home'
      : '/0rp?setupid=SecurityRemoteProxy';
    return openAndWatchWindow(url).then(onClose);
  },
};

export default ((state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.START_EDITING:
      return action.payload;
    case ACTIONS.UPDATE:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case ACTIONS.UNSET:
    case ACTIONS.CANCEL_EDITING:
    case SELECT_MENU_ITEM:
    case CHANGE_COMPANY:
    case SELECT_TAB:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
