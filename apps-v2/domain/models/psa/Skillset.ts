/* eslint-disable camelcase */
import Api from '../../../commons/api';

export type Skillset = {
  categoryName: string;
  code: string;
  companyId: string;
  grades: string;
  id: string;
  name_L0: string;
  name_L1: string;
  name_L2: string;
  name: string;
  rating: string;
  ratingType: string;
  deleted: boolean;
};

export type SkillsetList = Array<Skillset>;

export type SkillsetSearchQuery = {
  categoryName: string | null;
  code: string | null;
  companyId: string | null;
  name: string | null;
};

export const RATING_TYPE = {
  None: 'None',
  Score: 'Score',
  Grade: 'Grade',
};

export const SELF_EDITING_TYPE = {
  Allowed: 'Allowed',
  NotAllowed: 'NotAllowed',
  ApprovalRequired: 'ApprovalRequired',
};

export const searchSkillsetByEmployeeId = (
  empId: string | null
): Promise<SkillsetList> => {
  return Api.invoke({
    path: '/psa/skillset/list',
    param: {
      empId,
    },
  }).then((response: { skillsets: SkillsetList }) => response.skillsets);
};

export const searchSkillset = (
  query: SkillsetSearchQuery
): Promise<SkillsetList> => {
  return Api.invoke({
    path: '/psa/skillset/search',
    param: { ...query },
  }).then((response: { skillsets: SkillsetList }) => response.skillsets);
};
