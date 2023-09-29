/* eslint-disable camelcase */
import Api from '../../../commons/api';

export type link = {
  name: string;
  url: string;
};

export type employeeSkill = {
  categoryName?: string;
  rating?: string;
  skillId: string;
  skillName: string;
};

export type employeeAssignment = {
  assignmentName: string;
  clientName: string;
  endDate: string;
  pmName: string;
  projectName: string;
  startDate: string;
};

export type CapabilityInfo = {
  activitiesNum: number;
  assignments: Array<employeeAssignment>;
  empCode: string;
  empDeptName: string;
  empEmail: string;
  empGrade: string;
  empHiredDate: string;
  empId: string;
  empName_L0: string;
  empName_L1: string;
  empNameL: string;
  empPhotoUrl: string;
  empPosition: string;
  id: string;
  links: Array<link>;
  personalInfoId: string;
  personalInfoUrl: string;
  projectNum: number;
  remarks: string;
  skills: Array<employeeSkill>;
};

export const initialCapabilityInfo = {
  activitiesNum: 0,
  assignments: [],
  empCode: '',
  empDeptName: '',
  empEmail: '',
  empGrade: '',
  empHiredDate: '',
  empId: '',
  empName_L0: '',
  empName_L1: '',
  empNameL: '',
  empPhotoUrl: '',
  empPosition: '',
  id: '',
  links: [],
  personalInfoId: '',
  personalInfoUrl: '',
  projectNum: 0,
  remarks: '',
  skills: [],
};

export const getCapabilityInfo = (
  empId: string,
  psaGroupId: string
): Promise<CapabilityInfo> => {
  return Api.invoke({
    path: '/psa/talent-profile/get',
    param: {
      empId,
      psaGroupId,
    },
  }).then((response: CapabilityInfo) => response);
};
