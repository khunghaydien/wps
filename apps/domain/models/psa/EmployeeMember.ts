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
  parentId: string | null;
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
      companyId: param.companyId,
      startDate: param.startDate,
      endDate: param.endDate,
      code: param.employeeCode,
      name: param.employeeName,
      departmentName: param.departmentName,
      title: param.employeeTitle,
    },
  })
    .then((res) => res.recordIds)
    .then((res) =>
      Api.invoke({
        path: '/employee/list',
        param: {
          ids: res,
          startDate: param.startDate,
          endDate: param.endDate,
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
      parentId: param.parentId,
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
