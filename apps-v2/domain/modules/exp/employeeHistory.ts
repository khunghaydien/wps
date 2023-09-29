import { Reducer } from 'redux';

import { EmpHistory } from '@apps/domain/models/common/Employee';

type EmpHistoryInfo = EmpHistory & {
  // data pass to subsequence action triggered by employee history set action
  // following report type search api needs data from user-setting api
  companyId?: string;
  employeeId?: string;
};

export const ACTIONS = {
  SET: 'MODULES/EXP/EMPLOYEE_HISTORY/SET',
};

export const actions = {
  set: (item: EmpHistoryInfo) => ({
    type: ACTIONS.SET,
    payload: item,
  }),
};

const initialState = {} as EmpHistory;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      const { empGroupId, validFrom, validTo } = action.payload;
      return { empGroupId, validFrom, validTo };
    default:
      return state;
  }
}) as Reducer<EmpHistory, any>;
