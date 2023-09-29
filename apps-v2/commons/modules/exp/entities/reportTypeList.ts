import { Dispatch, Reducer } from 'redux';

import { catchApiError } from '@commons/actions/app';
import { Option, OptionList } from '@commons/components/fields/CustomDropdown';

import {
  ExpenseReportTypeList,
  getReportTypeList,
} from '@apps/domain/models/exp/expense-report-type/list';

export const ACTIONS = {
  LIST_SUCCESS: 'COMMONS/EXP/ENTITIES/REPORT_TYPE_LIST/LIST_SUCCESS',
};

const listSuccess = (reportTypeList: ExpenseReportTypeList) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: reportTypeList,
});

export const actions = {
  list:
    (
      companyId?: string,
      startDate?: string,
      endDate?: string,
      empId?: string,
      usedIn?: string,
      empHistoryIdList?: string[]
    ) =>
    (
      dispatch: Dispatch<any>
    ): Promise<{ payload: ExpenseReportTypeList; type: string } | void> => {
      const _ = undefined;
      return getReportTypeList(
        companyId,
        usedIn,
        _,
        empId,
        _,
        startDate,
        endDate,
        _,
        _,
        null,
        empHistoryIdList
      )
        .then(({ records }) => dispatch(listSuccess(records)))
        .catch((err) => {
          dispatch(listSuccess([]));
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
};

const convertStyle = (reportTypeList: ExpenseReportTypeList) => {
  const options = reportTypeList.map(({ name, id }) => {
    const reportTypeOption: Option = {
      label: name || '',
      value: id,
    };
    return reportTypeOption;
  });
  return options;
};

const initialState: OptionList = null;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return convertStyle(action.payload);
    default:
      return state;
  }
}) as Reducer<OptionList, any>;
