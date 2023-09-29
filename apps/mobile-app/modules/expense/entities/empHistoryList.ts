import { Reducer } from 'redux';

import { catchApiError } from '@apps/commons/actions/app';
import DateUtil from '@apps/commons/utils/DateUtil';

import {
  EmpHistoryList,
  EmployeeHistoryList,
  getEmployeeHistoryList,
} from '@apps/domain/models/common/Employee';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/ENTITIES/EMPLOYEE_HISTORY_LIST/SET',
  CLEAR: 'MODULES/EXPENSE/ENTITIES/EMPLOYEE_HISTORY_LIST/CLEAR',
};

const actions = {
  set: (item: EmpHistoryList) => ({
    type: ACTIONS.SET,
    payload: item,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

export const getEmpHistoryList =
  (empId: string) =>
  (dispatch: AppDispatch): Promise<EmpHistoryList> => {
    return getEmployeeHistoryList(empId)
      .then((res: EmployeeHistoryList) => {
        const convertHistory = ({
          validDateFrom,
          validDateTo,
          expEmployeeGroupId,
        }) => ({
          validFrom: validDateFrom,
          validTo: DateUtil.addDays(validDateTo, -1),
          empGroupId: expEmployeeGroupId,
        });
        const historyList = res.map(convertHistory);
        dispatch(actions.set(historyList));
        return historyList;
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        throw err;
      });
  };

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return [];
    default:
      return state;
  }
}) as Reducer<EmpHistoryList, any>;
