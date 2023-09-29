import { Reducer } from 'redux';

type EmployeeMember = {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  employeePhotoUrl: string;
  departmentName: string;
  employeeTitle: string;
  isSelected: boolean;
};

type EmployeeMemberList = Array<EmployeeMember>;

const initialState: EmployeeMemberList = [];

export default ((state = initialState) => {
  return state;
}) as Reducer<EmployeeMemberList, any>;
