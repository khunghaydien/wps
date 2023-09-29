import Api from '../../../commons/api';

export type AuthStatus =
  | 'AUTHORIZED'
  | 'UNAUTHORIZED'
  | 'API_CONNECTION_FAILED'
  | 'REMOTE_SITE_SETTINGS_INACTIVE';

export type PlannerSetting = {
  useCalendarAccess: boolean;
  calendarAccessService?: 'Office365'; // 現在は1種類のみ対応
  authStatus?: AuthStatus;
};

export type ToRemote = {
  useCalendarAccess: boolean;
  calendarAccessService?: 'Office365';
};

export const fetch = (param: { companyId: string }): Promise<PlannerSetting> =>
  Api.invoke({
    path: '/company/planner-setting/get',
    param,
  });

type SaveParam = {
  companyId?: string;
  useCalendarAccess?: boolean;
  calendarAccessService?: string;
};

export const save = (
  companyId: string,
  plannerSetting: PlannerSetting
): Promise<void> => {
  const param: SaveParam = {};
  param.companyId = companyId;
  param.useCalendarAccess = plannerSetting.useCalendarAccess;

  // if (param.useCalendarAccess && plannerSetting.calendarAccessService) {
  //   param.calendarAccessService = plannerSetting.calendarAccessService;
  // }
  if (param.useCalendarAccess) {
    param.calendarAccessService = 'Office365';
  }

  return Api.invoke({
    path: '/company/planner-setting/save',
    param,
  });
};

export const fetchAuthURL = (companyId: string): Promise<string> =>
  Api.invoke({
    path: '/company/planner-setting/auth-url/get',
    param: { companyId },
  }).then((res) => res.authUrl);
