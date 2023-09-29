import * as history from '@admin-pc-v2/actions/history';

export const ADD_SUB_ROLE_EMPLOYEE = 'ADD_SUB_ROLE_EMPLOYEE';
export const ADD_SUB_ROLE_EMPLOYEE_ERROR = 'ADD_SUB_ROLE_EMPLOYEE_ERROR';

const FUNC_NAME = 'employee';

export const addSubRoleEmployee = (param) => {
  return history.addSubRole(
    FUNC_NAME,
    param,
    ADD_SUB_ROLE_EMPLOYEE,
    ADD_SUB_ROLE_EMPLOYEE_ERROR
  );
};
