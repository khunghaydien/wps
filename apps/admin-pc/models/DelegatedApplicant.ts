import Api from '../../commons/api';

export type { EmployeeShowObj } from './DelegatedApprover';

export type DelegatedApplicant = {
  settingId: string | null;
  isActiveSFUserAcc?: boolean;
  delegateeId?: string;
  delegatee?: {
    id: string;
    name: string;
    photoUrl: string;
    department: {
      code: string;
      name: string;
    };
  };
  delegatedFor: {
    expense: boolean;
    request: boolean;
  };
};

export const getDelegatedApplicantList = (
  empBaseId: string
): Promise<DelegatedApplicant[]> => {
  return Api.invoke({
    path: '/delegated-application-setting/list',
    param: {
      empBaseId,
    },
  }).then((result: { settingList: Array<DelegatedApplicant> }) => {
    return result.settingList;
  });
};

export const saveDelegatedApplicants = (
  empId: string,
  settings: Array<DelegatedApplicant>
): Promise<void> => {
  return Api.invoke({
    path: '/delegated-application-setting/save',
    param: {
      empId,
      settings,
    },
  }).then((response) => response);
};
