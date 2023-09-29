/**
 * ManagerList represent PM List or RM List
 */
export type ManagerList = {
  id: string;
  name: string;
  code: string;
  companyId: string;
  parentName: string | null;
};

export type ManagerListArray = Array<ManagerList>;

export type ManagerListSearchQuery = {
  companyId: string | null;
  types: Array<string> | null;
};
