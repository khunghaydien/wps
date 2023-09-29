import moment from 'moment';

import { UserSetting } from '../../domain/models/UserSetting';

import { AppDispatch } from '../modules/AppThunk';

import Api from '../api';

export const GET_USER_SETTING = 'GET_USER_SETTING';
export const GET_USER_SETTING_ERROR = 'GET_USER_SETTING_ERROR';

export const EmployeeDetailSelector = {
  COST_CENTER: 'COST_CENTER',
  DEPARTMENT: 'DEPARTMENT',
  WORKING_TYPE: 'WORKING_TYPE',
  TIME_SETTING: 'TIME_SETTING',
  JOB_GRADE: 'JOB_GRADE',
  EMPLOYEE_GROUP: 'EMPLOYEE_GROUP',
  EXP_APPR_DIFF_COM_PERMISSION: 'EXP_APPR_DIFF_COM_PERMISSION',
};

export type GetUserSettingRequestParameter = {
  detailSelectors?: Array<string>;
  empId?: string;
  empHistoryId?: string;
  currentLanguage?: string;
  returnSfDefaultCurrencyCode?: boolean;
  skipApproverInfo?: boolean;
  skipPsa?: boolean;
  skipExpense?: boolean;
};
export type GetUserSettingSuccessAction = {
  type: 'GET_USER_SETTING';
  payload: UserSetting;
};

export type GetUserSettingErrorAction = {
  type: 'GET_USER_SETTING_ERROR';
};

export function getUserSettingSuccess(
  result: UserSetting
): GetUserSettingSuccessAction {
  return {
    type: GET_USER_SETTING,
    payload: result,
  };
}

export function getUserSettingError(): GetUserSettingErrorAction {
  return {
    type: GET_USER_SETTING_ERROR,
  };
}

export type Action = GetUserSettingSuccessAction | GetUserSettingErrorAction;

export function fetchUserSetting(
  param: GetUserSettingRequestParameter = {}
): Promise<UserSetting> {
  return Api.invoke({
    path: '/user-setting/get',
    param,
  });
}

export function getUserSetting(param: GetUserSettingRequestParameter = {}) {
  return (dispatch: AppDispatch) => {
    return fetchUserSetting(param)
      .then((result) => {
        // for delegate applications, take operator's language setting for display
        const { currentLanguage } = param;
        const language = currentLanguage || result.language;
        const locale = result.locale;
        const timeZone = result.timeZone;
        result.currencySymbol = result.currencySymbol || '';

        if (
          document.documentElement !== null &&
          document.documentElement !== undefined
        ) {
          document.documentElement.lang = language;
        }

        moment.locale(locale);
        window.empInfo = {
          userId: result.id,
          language,
          locale,
          timeZone,
        } as EmpInfo; // FIXME: for msg()
        window.organization = { ...result.organization };

        if (currentLanguage) {
          result.language = language;
        }
        dispatch(getUserSettingSuccess(result));

        return result;
      })
      .catch(() => {
        dispatch(getUserSettingError());
      });
  };
}
