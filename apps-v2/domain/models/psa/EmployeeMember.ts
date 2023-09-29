import get from 'lodash/get';

import Api from '../../../commons/api';

export type EmployeeMember = {
  departmentName?: string;
  employeeCode?: string;
  employeeId: string;
  employeeName: string;
  employeePhotoUrl: string;
  employeeTitle?: string;
  type?: string;
};

export type EmployeeMemberList = Array<EmployeeMember>;

export type EmployeeMemberSearchQuery = {
  companyId: string | null;
  departmentName: string | null;
  employeeCode: string | null;
  employeeName: string | null;
  employeeTitle: string | null;
  endDate: string | null;
  startDate: string | null;
};

export type RespondedRecord = {
  code: string;
  departmentName: string;
  id: string;
  name: string;
  photoUrl: string;
  title?: string;
};

const convertFromResponse = (record: RespondedRecord): EmployeeMember => ({
  employeeId: record.id,
  employeeCode: record.code,
  employeeName: record.name,
  employeePhotoUrl: record.photoUrl,
  departmentName: record.departmentName,
  employeeTitle: record.title,
});

const convertFromGroupResponse = (record) => ({
  employeeId: record.employeeId,
  employeeCode: record.employeeCode,
  employeeName: record.employeeName,
  employeePhotoUrl: record.employeePhotoUrl,
  departmentName: record.departmentName,
  employeeTitle: record.employeeTitle,
});

export const getEmployeeMemberListByManagerListId = (
  id: string | null
): Promise<EmployeeMemberList> => {
  return Api.invoke({
    path: '/psa/group/get',
    param: {
      id,
    },
  }).then((response) => response.members);
};

// Get result
export const getResponseByGroupId = (
  id: string | null
): Promise<EmployeeMemberList> => {
  return Api.invoke({
    path: '/psa/group/get',
    param: {
      id,
    },
  }).then((response) => response);
};

export const getEmployeeMemberListByProjectManagerId = (
  id: string | null
): Promise<EmployeeMemberList> => {
  return Api.invoke({
    path: '/psa/group/get',
    param: {
      id,
    },
  }).then((response) => response.members.map(convertFromGroupResponse));
};

export const searchEmployeeMember = async (
  param: EmployeeMemberSearchQuery
): Promise<EmployeeMemberList> =>
  Api.invoke({
    path: '/employee/id/search',
    param: {
      searchCondition: {
        companyId: param.companyId,
        targetDate: param.startDate,
        code: param.employeeCode,
        name: param.employeeName,
        departmentName: param.departmentName,
        positionName: param.employeeTitle,
        includeInactiveEmployee: false,
        primary: true,
      },
      sortCondition: {
        field: 'code',
        order: 'ASC NULLS FIRST',
      },
    },
  })
    .then((res) => res.idList)
    .then((res) =>
      Api.invoke({
        path: '/employee/list',
        param: {
          ids: res,
          targetDate: param.startDate,
          primary: true,
        },
      }).then((res) => res.empDataList.map(convertFromResponse))
    );

// Resource Group Search
export const searchResourceGroupMember = async (
  param: EmployeeMemberSearchQuery
): Promise<EmployeeMemberList> =>
  Api.invoke({
    path: '/psa/group/list',
    param: {
      companyId: param.companyId,
      types: ['RM'],
    },
  })
    .then((res) => get(res, 'groups.0.id', ''))
    .then((id) =>
      Api.invoke({
        path: '/psa/group/get',
        param: {
          id,
        },
      }).then((res) => res.members)
    );
