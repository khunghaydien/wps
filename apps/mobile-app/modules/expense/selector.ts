import { filter } from 'lodash';
import { createSelector } from 'reselect';

import {
  AccountingPeriodList,
  AccountingPeriodOptionList,
  makeAPOptionList,
} from '../../../domain/models/exp/AccountingPeriod';
import { ExpenseReportTypeList } from '../../../domain/models/exp/expense-report-type/list';
import { Record } from '../../../domain/models/exp/Record';

import { State } from './index';

/**
 * Selectors depending on the expense state.
 *
 * Note that you should NOT put selectors depending on a module.
 * If you want to write selectors depending on a module, then you should
 * put the selectors into a module.
 */

/* Records  */
const selectedRecordIdMap = (
  state: State
): {
  [key: string]: boolean;
} => state.ui.record.list.select.flagsById;

const selectRecordList = (state: State): Record[] => state.entities.recordList;

export const selectedRecords: (arg0: State) => Record[] = createSelector(
  selectedRecordIdMap,
  selectRecordList,
  (
    recordIdMap: {
      [key: string]: boolean;
    },
    recordList: Record[] = []
  ): Record[] => {
    return (
      recordList &&
      recordList.filter(
        (record) => record.recordId && recordIdMap[record.recordId]
      )
    );
  }
);

// filter out inactive, vendor-used and request-required report type in mobile app.
export const filterMobileCompatibleRT = (
  reportTypeList: ExpenseReportTypeList,
  isRequest?: boolean
): ExpenseReportTypeList => {
  const filterRequestRequired = !isRequest ? { requestRequired: false } : {};
  return filter(reportTypeList, {
    ...filterRequestRequired,
    active: true,
  });
};

export const getReportTypeList: (state: State) => ExpenseReportTypeList =
  createSelector(
    (state) => state.entities.expReportType || {},
    (state) => state.ui.employeeHistory.empGroupId,
    (list, groupId) => list[groupId]
  );

export const getReportTypeOption: (
  state: State,
  isRequest?: boolean
) => ExpenseReportTypeList = createSelector(
  [getReportTypeList, (_: State, isRequest: boolean) => isRequest],
  (list, isRequest) => filterMobileCompatibleRT(list, isRequest)
);

export const getAPOptionList: (state: State) => AccountingPeriodOptionList =
  createSelector(
    (state: State) => state.entities.accountingPeriod,
    (state: State) => state.entities.report.accountingPeriodId,
    (apList: AccountingPeriodList, selectedAccountingPeriodId: string) =>
      apList && makeAPOptionList(apList, selectedAccountingPeriodId)
  );
