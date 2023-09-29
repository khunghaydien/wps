import Api from '../../../commons/api';

// example: [true, false]
export type PsaAccessSetting = {
  hasAccess: Array<boolean>;
};

export type GetPsaAccessSettingResponse = {
  hasAccess: PsaAccessSetting;
};

export type PsaPermissionType =
  | 'CONFIRM_PROJECT_ROLES'
  | 'UPLOAD_PROJECT_ROLES'
  | 'ASSIGN_PROJECT_ROLES'
  | 'CANCEL_PROJECT_ROLES'
  | 'RESCHEDULE_PROJECT_ROLES'
  | 'WITHDRAW_PROJECT_ROLES';

export type PsaAccessType = {
  canConfirmProjectRoles: boolean;
  canUploadProjectRoles: boolean;
  canAssignProjectRoles: boolean;
  canWithdrawProjectRoles: boolean;
  canCancelProjectRoles: boolean;
  canRescheduleProjectRoles: boolean;
};

export const initialState = null;

export const getPsaAccessSetting = (
  empId: string,
  psaPermissions: Array<PsaPermissionType>
): Promise<PsaAccessSetting> => {
  return Api.invoke({
    path: '/psa/access/get',
    param: { empId, psaPermissions },
  }).then((response: GetPsaAccessSettingResponse) => response.hasAccess);
};
