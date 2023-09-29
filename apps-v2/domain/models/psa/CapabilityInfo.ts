/* eslint-disable camelcase */
import Api from '@apps/commons/api';

export type Link = {
  name: string;
  url: string;
};

export type EmployeeAssignment = {
  assignmentName: string;
  clientName: string;
  endDate: string;
  pmName: string;
  projectName: string;
  startDate: string;
};

export type SkillItem = {
  skillId?: string;
  id: string;
  name: string;
  rating?: string | number;
  allowSelfEditing?: string;
  ratingType?: string;
  grades?: Array<string>;
  categoryName?: string;
  skillName?: string;
  deleted?: boolean;
};

export type SkillCategory = {
  id: string;
  name: string;
  skillItems: Array<SkillItem>;
};

export type CapabilityInfo = {
  activitiesNum: number;
  assignments: Array<EmployeeAssignment>;
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
  links: Array<Link>;
  personalInfoId: string;
  personalInfoUrl: string;
  projectNum: number;
  remarks: string;
  skills: Array<SkillItem>;
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

export const getCapabilityInfo = (empId: string): Promise<CapabilityInfo> => {
  return Api.invoke({
    path: '/psa/talent-profile/get',
    param: {
      empId,
    },
  }).then((response: CapabilityInfo) => response);
};
