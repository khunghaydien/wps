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
  | 'UPLOAD_PROJECT_ROLES';

export type PsaAccessType = {
  canConfirmProjectRoles: boolean;
  canUploadProjectRoles: boolean;
};

export const initialState = null;

export const getPsaAccessSetting = (
  empId: string,
  psaPermissions: Array<PsaPermissionType>,
  psaGroupId: string
): Promise<PsaAccessSetting> => {
  return Api.invoke({
    path: '/psa/access/get',
    param: { empId, psaPermissions, psaGroupId },
  }).then((response: GetPsaAccessSettingResponse) => response.hasAccess);
};
