import { $Values } from 'utility-types';

export const ASSIGNMENT_TYPE = Object.freeze({
  EMPLOYEE: 'Employee',
  POSITION: 'Position',
});

type Assignment = $Values<typeof ASSIGNMENT_TYPE>;

export type DepartmentManager = {
  id: string;
  deptBaseId: string;
  companyId: string;
  hierarchyPatternId: string;
  assignmentType: Assignment;
  empBaseId: string;
  positionId: string;
  primary: boolean;
  active: boolean;
  position?: {
    name: string;
    code: string;
  };
  employee?: {
    name: string;
    code: string;
  };
};
