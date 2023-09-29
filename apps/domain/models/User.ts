import { Employee } from './organization/Employee';

export type User = {
  id: string;
  employeeCode: string;
  employeeName: string;
  employeePhotoUrl: string | null | undefined;
  departmentCode: string; // Not used?
  departmentName: string;
  title: string;
  managerName: string;
  isDelegated: boolean;
};

export const create = (employee: Employee): User => {
  return {
    id: employee.id,
    employeeCode: employee.code,
    employeeName: employee.name,
    employeePhotoUrl: employee.user ? employee.user.photoUrl : undefined,
    departmentCode: '', // Not used?
    departmentName: employee.department ? employee.department.name : '',
    title: employee.title,
    managerName: employee.manager ? employee.manager.name : '',
    isDelegated: false,
  };
};

export const delegate = (employee: Employee): User => {
  return {
    id: employee.id,
    employeeCode: employee.code,
    employeeName: employee.name,
    employeePhotoUrl: employee.user ? employee.user.photoUrl : undefined,
    departmentCode: '', // Not used?
    departmentName: employee.department ? employee.department.name : '',
    title: employee.title,
    managerName: employee.manager ? employee.manager.name : '',
    isDelegated: true,
  };
};

export const defaultValue = {
  id: '',
  employeeCode: '',
  employeeName: '',
  employeePhotoUrl: '',
  departmentCode: '', // Not used?
  departmentName: '',
  title: '',
  managerName: '',
  isDelegated: false,
};
