import isEmpty from 'lodash/isEmpty';

import { actions as employeeDetailActions } from '@commons/modules/exp/entities/employeeDetail';

import EmployeeRepository from '@apps/repositories/organization/employee/EmployeeDetailRepository';

import { MasterEmployeeHistory } from '@apps/domain/models/organization/MasterEmployeeHistory';

import { AppDispatch } from '../AppThunk';

export const fetchHistories =
  (empId: string) =>
  (dispatch: AppDispatch): Promise<MasterEmployeeHistory[]> => {
    return EmployeeRepository.fetchHistories(empId).then((result) => {
      if (!isEmpty(result)) {
        dispatch(employeeDetailActions.setDetails(result));
      }
      return result;
    });
  };
