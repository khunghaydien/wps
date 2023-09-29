import { Reducer } from 'redux';

import { DefaultCostCenter } from '../../../../domain/models/exp/CostCenter';
import {
  ExpenseReportType,
  ExpenseReportTypeList,
} from '../../../../domain/models/exp/expense-report-type/list';
import { getEIsOnly } from '../../../../domain/models/exp/ExtendedItem';
import {
  initialStatePreRequest,
  Report,
} from '../../../../domain/models/exp/Report';

type DefaultData = {
  defaultCostCenter?: DefaultCostCenter;
  reportType?: ExpenseReportType;
};

export const ACTIONS = {
  NEW_REPORT: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/NEW_REPORT',
  SELECT: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/SELECT',
  CLEAR: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/CLEAR',
};

export const actions = {
  newReport: (defaultData: DefaultData) => ({
    type: ACTIONS.NEW_REPORT,
    payload: defaultData,
  }),
  select: (target: Report, reportTypeList?: ExpenseReportTypeList) => ({
    type: ACTIONS.SELECT,
    payload: { target, reportTypeList },
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const getExtendedItemInfo = (reportType: ExpenseReportType) => {
  const extendedItemData = getEIsOnly(reportType);
  extendedItemData.expReportTypeId = reportType.id;
  return extendedItemData;
};

export default ((state = initialStatePreRequest, action) => {
  switch (action.type) {
    case ACTIONS.SELECT:
      return action.payload.target;
    case ACTIONS.CLEAR:
      return initialStatePreRequest;
    case ACTIONS.NEW_REPORT:
      if (action.payload.reportType) {
        const reportType = action.payload.reportType;
        return {
          ...initialStatePreRequest,
          ...getExtendedItemInfo(reportType),
          ...action.payload.defaultCostCenter,
          useFileAttachment: reportType.useFileAttachment,
        };
      } else {
        return {
          ...initialStatePreRequest,
          ...action.payload.defaultCostCenter,
        };
      }

    default:
      return state;
  }
}) as Reducer<Report, any>;
