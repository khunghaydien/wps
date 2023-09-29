/* eslint-disable camelcase */
import Api from '../../../commons/api';

export type Category = {
  id: string;
  name: string;
  name_L0: string;
  name_L1: string;
  name_L2: string;
  companyId: string;
};

export type CategoryList = Array<Category>;

// id = skillsetId
export type CategorySearchQuery = {
  id: string | null;
  companyId: string | null;
  code: string | null;
};

export const searchCategoryByEmployeeId = (
  empId: string | null
): Promise<CategoryList> => {
  return Api.invoke({
    path: '/psa/skillset/list',
    param: {
      empId,
    },
  }).then((response: { skillsets: CategoryList }) => response.skillsets);
};

export const searchCategory = (
  query: CategorySearchQuery
): Promise<CategoryList> => {
  return Api.invoke({
    path: '/psa/category/search',
    param: { ...query },
  }).then((response: { skillsets: CategoryList }) => response.skillsets);
};
