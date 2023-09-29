import Api from '../../commons/api';

export type EmployeeShowObj = {
  id: string;
  code: string;
  name: string;
  depCode: string;
  depName: string;
  photoUrl: string;
  title: string;
  isActiveSFUserAcc?: boolean;
};

export type DelegatedApprover = {
  settingId: string | null;
  delegatedApproverId: string;
  canApproveExpenseRequestByDelegate: boolean;
  canApproveExpenseReportByDelegate: boolean;
  delegatedApproverCode?: string;
  delegatedApproverName?: string;
  departmentCode?: string;
  departmentName?: string;
  delegatedApproverPhotoUrl?: string;
  isActiveSFUserAcc?: boolean;
};

export const getDelegatedApproverList = (
  empId: string
): Promise<DelegatedApprover[]> => {
  return Api.invoke({
    path: '/delegated-approver-setting/list',
    param: {
      empId,
    },
  }).then((result: { settingList: Array<DelegatedApprover> }) => {
    return result.settingList;
  });
};

export const saveDelegatedApprovers = (
  empId: string,
  settings: Array<DelegatedApprover>
): Promise<any> => {
  return Api.invoke({
    path: '/delegated-approver-setting/save',
    param: {
      empId,
      settings,
    },
  }).then((response) => response);
};
