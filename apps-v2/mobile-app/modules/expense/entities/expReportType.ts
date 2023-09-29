import { Reducer } from 'redux';

import {
  ExpenseReportTypeList,
  getReportTypeList,
} from '../../../../domain/models/exp/expense-report-type/list';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  SEARCH_REPORT_TYPE_SUCCESS:
    'MODULES/ENTITIES/EXP/REPORT_TYPE/SEARCH_REPORT_TYPE_SUCCESS',
  RESET: 'MODULES/ENTITIES/EXP/REPORT_TYPE/RESET',
};

const searchExpReportTypeSuccess = (
  groupId: string,
  list: ExpenseReportTypeList
) => ({
  type: ACTIONS.SEARCH_REPORT_TYPE_SUCCESS,
  payload: { groupId, list },
});

export const actions = {
  list:
    (
      empGroupId: string,
      companyId: string,
      active?: boolean,
      employeeId?: string,
      withExpTypeName?: boolean,
      startDate?: string,
      endDate?: string,
      includeLinkedExpenseTypeIds?: boolean,
      reportTypeId?: string,
      isRequest?: boolean
    ) =>
    (dispatch: AppDispatch): Promise<ExpenseReportTypeList> => {
      return getReportTypeList(
        companyId,
        isRequest ? 'REQUEST' : 'REPORT',
        active,
        employeeId,
        withExpTypeName,
        startDate,
        endDate,
        includeLinkedExpenseTypeIds || withExpTypeName,
        reportTypeId
      ).then(({ records: reportTypeList }) => {
        dispatch(searchExpReportTypeSuccess(empGroupId, reportTypeList));
        return reportTypeList;
      });
    },
  reset: () => ({
    type: ACTIONS.RESET,
  }),
};

type EmpGroupReportTypeList = { string: ExpenseReportTypeList };
const initialState = null;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_REPORT_TYPE_SUCCESS:
      const { groupId, list } = action.payload;
      return { ...state, [groupId]: list };
    case ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
}) as Reducer<EmpGroupReportTypeList | null, any>;
