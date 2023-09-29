export type MasterEmployeeBase = {
  id: string;
  code: string;
  name: string;
  userId: string;
  userName: string;
  lastName_L0: string;
  lastName_L1: string;
  lastName_L2: string;
  firstName_L0: string;
  firstName_L1: string;
  firstName_L2: string;
  middleName_L0: string;
  middleName_L1: string;
  middleName_L2: string;
  displayName_L0: string;
  displayName_L1: string;
  displayName_L2: string;
  validFrom: string;
  validTo: string;
  hiredDate: string;
  resignationDate: string;
};

// eslint-disable-next-line import/prefer-default-export
export const defaultValue = {
  id: '',
  code: '',
  name: '',
  userId: '',
  userName: '',
  lastName_L0: '',
  lastName_L1: '',
  lastName_L2: '',
  firstName_L0: '',
  firstName_L1: '',
  firstName_L2: '',
  middleName_L0: '',
  middleName_L1: '',
  middleName_L2: '',
  displayName_L0: '',
  displayName_L1: '',
  displayName_L2: '',
  validFrom: '',
  validTo: '',
  hiredDate: '',
  resignationDate: '',
};
