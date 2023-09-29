import { catchApiError, loadingEnd, loadingStart } from '@commons/actions/app';
import Api from '@commons/api';
import UrlUtil from '@commons/utils/UrlUtil';

import { AppDispatch } from '../action-dispatchers/AppThunk';

import * as base from './base';

const FUNC_NAME = 'company/planner-setting';
export const GET_PLANNER_SETTING = 'GET_PLANNER_SETTING';
export const SAVE_PLANNER_SETTING = 'SAVE_PLANNER_SETTING';
export const GET_PLANNER_SETTING_ERROR = 'GET_PLANNER_SETTING_ERROR';
export const SAVE_PLANNER_SETTING_ERROR = 'SAVE_PLANNER_SETTING_ERROR';

export const getPlannerSetting = (param) => {
  return base.get(
    FUNC_NAME,
    param,
    GET_PLANNER_SETTING,
    GET_PLANNER_SETTING_ERROR
  );
};

export const savePlannerSetting = (param) => {
  return base.save(
    FUNC_NAME,
    param,
    SAVE_PLANNER_SETTING,
    SAVE_PLANNER_SETTING_ERROR
  );
};

const fetchPlannerSettingAuthURL = (companyId: string): Promise<string> =>
  Api.invoke({
    path: '/company/planner-setting/auth-url/get',
    param: { companyId },
  }).then((res) => res.authUrl);

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

export const openAuthWindow =
  (companyId: string, onClose: () => unknown) =>
  async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    try {
      const url = await fetchPlannerSettingAuthURL(companyId);
      await openAndWatchWindow(url);
      return onClose();
    } catch (err) {
      dispatch(catchApiError(err));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const openRemoteSiteSettingWindow =
  (onClose: () => void) => (): Promise<void> => {
    const url = UrlUtil.isLex()
      ? '/lightning/setup/SecurityRemoteProxy/home'
      : '/0rp?setupid=SecurityRemoteProxy';
    return openAndWatchWindow(url).then(onClose);
  };
