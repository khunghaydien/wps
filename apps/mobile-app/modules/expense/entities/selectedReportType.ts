import { Reducer } from 'redux';

import {
  ExpenseReportType,
  getReportTypeList,
} from '@apps/domain/models/exp/expense-report-type/list';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  GET_SELECTED_REPORT_TYPE_SUCCESS:
    'MODULES/ENTITIES/EXP/REPORT_TYPE/GET_SELECTED_SUCCESS',
};

const getSelectedReportTypeSuccess = (
  selectedReportType: ExpenseReportType
) => ({
  type: ACTIONS.GET_SELECTED_REPORT_TYPE_SUCCESS,
  payload: selectedReportType,
});

export const actions = {
  get:
    (
      companyId: string,
      reportTypeId: string,
      includeLinkedExpenseTypeIds?: boolean
    ) =>
    (dispatch: AppDispatch): Promise<ExpenseReportType> => {
      return getReportTypeList(
        companyId,
        'REPORT',
        true,
        null,
        false,
        '',
        '',
        includeLinkedExpenseTypeIds,
        reportTypeId
      ).then(({ records: reportTypeList }) => {
        dispatch(getSelectedReportTypeSuccess(reportTypeList[0]));
        return reportTypeList[0];
      });
    },
};

const initialState = {} as ExpenseReportType;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SELECTED_REPORT_TYPE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<ExpenseReportType, any>;
