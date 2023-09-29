import { Reducer } from 'redux';

import { ExpenseReportType } from '../../../domain/models/exp/expense-report-type/list';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/EXP/EXPENSES_REPORT_TYPE/LIST_SUCCESS',
};

export const listSuccess = (reportTypes: Array<ExpenseReportType>) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: reportTypes,
});

const initialState = [];

export default ((state: Array<ExpenseReportType> = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<Array<ExpenseReportType>, any>;
