import Api from '../../../commons/api';

export type EmployeePersonalInfo = {
  id: string;
  code: string;
  name: string;
  photoUrl: string;
  deptName: string;
  workingTypeName: string;
};

export type SearchCondition = {
  targetDateQuery: string;
  employeeCodeQuery: string;
  employeeNameQuery: string;
  departmentNameQuery: string;
  workingTypeNameQuery: string;
};

export type FetchQuery = {
  companyId: string;
  code: string;
  name: string;
  departmentName: string;
  workingTypeName: string;
  limitNumber: number;
};

export type RespondedRecord = {
  id: string;
  code: string;
  name: string;
  user: {
    photoUrl: string;
  };
  department: {
    name: string;
  };
  workingType: {
    name: string;
  };
};

const convertFromResponse = (
  record: RespondedRecord
): EmployeePersonalInfo => ({
  id: record.id,
  code: record.code,
  name: record.name,
  photoUrl: record.user.photoUrl,
  deptName: record.department.name,
  workingTypeName: record.workingType.name,
});

export const generateDefaultSearchCondition = (): SearchCondition => ({
  targetDateQuery: '',
  employeeNameQuery: '',
  employeeCodeQuery: '',
  departmentNameQuery: '',
  workingTypeNameQuery: '',
});

export const buildFetchQuery = (
  query: SearchCondition,
  companyId: string,
  limitNumber: number
): FetchQuery => ({
  companyId,
  limitNumber,
  // @ts-ignore
  targetDate: query.targetDateQuery || null,
  name: query.employeeNameQuery,
  code: query.employeeCodeQuery,
  departmentName: query.departmentNameQuery,
  workingTypeName: query.workingTypeNameQuery,
});

export const fetch = (param: FetchQuery): Promise<EmployeePersonalInfo[]> =>
  Api.invoke({
    path: '/employee/search',
    param,
  }).then((res) => res.records.map(convertFromResponse));
