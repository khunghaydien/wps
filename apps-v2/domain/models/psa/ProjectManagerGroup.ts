/**
 * ProjectManagerGroup represent PM List or RM List
 */
export type ProjectManagerGroup = {
  id: string;
  name: string;
  code: string;
  companyId: string;
  parentName: string | null;
};

export type ProjectManagerGroupArray = Array<ProjectManagerGroup>;

export type ProjectManagerGroupSearchQuery = {
  companyId: string | null;
  types: Array<string> | null;
};
