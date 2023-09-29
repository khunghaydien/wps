import { Reducer } from 'redux';

import { DefaultCostCenter } from '../../../../domain/models/exp/CostCenter';
import {
  ExpenseReportType,
  ExpenseReportTypeList,
} from '../../../../domain/models/exp/expense-report-type/list';
import { getEIsOnly } from '../../../../domain/models/exp/ExtendedItem';
import {
  initialStateReport,
  Report,
} from '../../../../domain/models/exp/Report';

type DefaultData = {
  defaultCostCenter?: DefaultCostCenter;
  report?: Report;
  reportType?: ExpenseReportType;
};

type UpdateValues = {
  [key: string]: number | string;
};

export type SelectedReportUpdateValues = {
  payload: UpdateValues;
  type: string;
};

export const ACTIONS = {
  NEW_REPORT: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/NEW_REPORT',
  SELECT: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/SELECT',
  CLEAR: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/CLEAR',
  UPDATE_VALUES: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/UPDATE_VALUES',
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
  updateValues: (values: UpdateValues): SelectedReportUpdateValues => ({
    type: ACTIONS.UPDATE_VALUES,
    payload: values,
  }),
};

const getExtendedItemInfo = (reportType: ExpenseReportType) => {
  const extendedItemData = getEIsOnly(reportType);
  extendedItemData.expReportTypeId = reportType.id;
  return extendedItemData;
};

export default ((state = initialStateReport, action) => {
  switch (action.type) {
    case ACTIONS.SELECT:
      return action.payload.target;
    case ACTIONS.CLEAR:
      return initialStateReport;
    case ACTIONS.NEW_REPORT:
      if (action.payload.reportType) {
        const reportType = action.payload.reportType;
        return {
          ...initialStateReport,
          ...(action.payload.report ? action.payload.report : {}),
          ...getExtendedItemInfo(reportType),
          ...action.payload.defaultCostCenter,
          useFileAttachment: reportType.useFileAttachment,
          isNewReport: true,
        };
      } else {
        return {
          ...initialStateReport,
          ...action.payload.defaultCostCenter,
          isNewReport: true,
        };
      }
    case ACTIONS.UPDATE_VALUES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}) as Reducer<Report, any>;