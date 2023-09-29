export enum RecordAccessPermissionEnum {
  STANDARD = 'STANDARD',
  PRIVILEGE = 'PRIVILEGE',
  INDIVIDUAL = 'INDIVIDUAL',
}

export interface DepartmentRecordAccessPatternRecord {
  id: string;
  recordAccessPtnId: string;
  deptBaseId?: string;
  departmentCode?: string;
  departmentName?: string;
  empBaseId?: string;
  employeeCode?: string;
  employeeName?: string;
}

export interface EmployeeRecordAccessPatternRecord {
  id: string;
  recordAccessPtnId: string;
  deptBaseId?: string;
  departmentCode?: string;
  departmentName?: string;
  empBaseId?: string;
  employeeCode?: string;
  employeeName?: string;
}

export interface RecordAccessHierarchyRecord {
  id: string;
  recordAccessPtnId: string;
  deptBaseId: string;
  departmentName: string;
  departmentCode: string;
  managerDisabled: boolean;
  parentDisabled: boolean;
  grantRAToDeptMgrOnly: boolean;
}
