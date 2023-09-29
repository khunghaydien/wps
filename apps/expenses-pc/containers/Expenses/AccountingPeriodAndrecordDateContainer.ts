import { connect } from 'react-redux';

import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import AccountingPeriodAndRecordDate from '../../../commons/components/exp/Form/ReportSummary/Form/DateSelector/AccountingPeriodAndRecordDate';
import { getLatestHistoryCostCenter } from '@commons/action-dispatchers/CostCenter';
import DateUtil from '@commons/utils/DateUtil';

import {
  DefaultCostCenter,
  defaultCostCenter as defaultCC,
  LatestCostCenter,
} from '../../../domain/models/exp/CostCenter';

import { getDefaultCostCenter } from '../../../domain/modules/exp/cost-center/defaultCostCenter';
import { updateRecordDate } from '@apps/domain/modules/exp/recordDate';

const mapStateToProps = (state, ownProps) => ({
  accountingPeriodAll: state.ui.expenses.recordListPane.accountingPeriod,
  accountingPeriodActive:
    state.ui.expenses.recordListPane.accountingPeriod.filter((ap) => ap.active),
  accountingPeriodInactive:
    state.ui.expenses.recordListPane.accountingPeriod.filter(
      (ap) => !ap.active
    ),
  accountingPeriodIdOriginallySelected:
    state.ui.expenses.selectedExpReport.accountingPeriodId,
  employeeId: state.userSetting.employeeId,
  companyId: state.userSetting.companyId,
  reportTypeListActive: state.entities.exp.expenseReportType.list.active,
  reportTypeListInactive: state.entities.exp.expenseReportType.list.inactive,
  defaultCostCenter: state.entities.exp.costCenter.defaultCostCenter,
  latestCostCenter: state.entities.exp.costCenter.latestCostCenter,
  isActiveReport: !state.ui.expenses.tab,
  ...ownProps,
});

const mapDispatchToProps = {
  getDefaultCostCenter,
  getLatestHistoryCostCenter,
  updateRecordDate,
};

const changeReportonAccountingReport = (
  ownProps,
  selectedAccountingPeriod,
  makeSaveButtonActive
) => {
  ownProps.onChangeEditingExpReport(
    'report.accountingPeriodId',
    selectedAccountingPeriod.id,
    makeSaveButtonActive
  );
  ownProps.onChangeEditingExpReport(
    'ui.selectedAccountingPeriod',
    selectedAccountingPeriod,
    makeSaveButtonActive,
    false
  );
  // workaround as above are asynchronus update
  setTimeout(() => {
    ownProps.onChangeEditingExpReport(
      'report.accountingDate',
      selectedAccountingPeriod.recordingDate,
      makeSaveButtonActive
    );
  }, 1);
};

export const changeReportonCostCenter = (
  ownProps: any,
  defaultCostCenter: DefaultCostCenter = defaultCC,
  isCostCenterChangedManually?: boolean
) => {
  const { costCenterCode, costCenterName, costCenterHistoryId } =
    defaultCostCenter;
  ownProps.onChangeEditingExpReport(
    'report.costCenterCode',
    costCenterCode,
    true
  );
  ownProps.onChangeEditingExpReport(
    'report.costCenterName',
    costCenterName,
    true
  );
  ownProps.onChangeEditingExpReport(
    'report.costCenterHistoryId',
    costCenterHistoryId,
    true
  );
  ownProps.onChangeEditingExpReport(
    `report.isCostCenterChangedManually`,
    isCostCenterChangedManually || false
  );
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  onChangeAccountingPeriod: async (
    e: React.SyntheticEvent<HTMLSelectElement>
  ) => {
    const selectedAccountingPeriodId = e.currentTarget.value;
    const selectedAccountingPeriod = find(stateProps.accountingPeriodAll, {
      id: selectedAccountingPeriodId,
    });
    changeReportonAccountingReport(ownProps, selectedAccountingPeriod, true);
    dispatchProps.updateRecordDate(selectedAccountingPeriod.recordingDate);
    // if cost center is required and current one is not manually changed(except the empty value case),
    // fetch the default cost center and set

    const reportTypeList = [
      ...stateProps.reportTypeListActive,
      ...stateProps.reportTypeListInactive,
    ];
    const reportTypeWithCostCenterUsed = (reportTypeList || []).find(
      (x) =>
        x.id === ownProps.expReport.expReportTypeId &&
        x.isCostCenterRequired !== 'UNUSED'
    );
    if (reportTypeWithCostCenterUsed) {
      const currentCC = get(ownProps.expReport, 'costCenterCode');
      const fetchedDefaultCC = find(stateProps.defaultCostCenter, {
        date: selectedAccountingPeriod.recordingDate,
      });
      const empId = ownProps.isFinanceApproval
        ? get(ownProps.expReport, 'employeeBaseId', '')
        : stateProps.employeeId;
      const defaultCostCenter = !fetchedDefaultCC
        ? await dispatchProps.getDefaultCostCenter(
            empId,
            selectedAccountingPeriod.recordingDate
          )
        : fetchedDefaultCC.costCenter;
      // check if selected is DCC as DCC can be selected on another date
      const isUpdateDefaultCC =
        !get(ownProps.expReport, 'isCostCenterChangedManually') ||
        isEmpty(currentCC);
      if (isUpdateDefaultCC || defaultCostCenter.costCenterCode === currentCC) {
        changeReportonCostCenter(ownProps, {
          ...defaultCostCenter,
          isCostCenterChangedManually: false,
        });
      } else if (currentCC) {
        // get latest cc if there is cc selected that is not default cc
        const { validDateFrom, validDateTo } = stateProps.latestCostCenter;
        let latestCostCenter = stateProps.latestCostCenter;
        const isDateInRange = DateUtil.inRange(
          selectedAccountingPeriod.recordingDate,
          validDateFrom,
          validDateTo
        );
        const isDiffFromLatestCC =
          latestCostCenter.baseCode !== ownProps.expReport.costCenterCode;
        if (!isDateInRange || isDiffFromLatestCC) {
          const currentHistoryId = get(
            ownProps.expReport,
            'costCenterHistoryId'
          );
          latestCostCenter = await dispatchProps.getLatestHistoryCostCenter(
            currentHistoryId,
            selectedAccountingPeriod.recordingDate
          );
        }
        const { baseCode, id, name } = (latestCostCenter ||
          {}) as LatestCostCenter;
        const costCenter = {
          costCenterCode: baseCode,
          costCenterHistoryId: id,
          costCenterName: name,
        };
        changeReportonCostCenter(ownProps, costCenter, true);
      }
    }
  },
  resetAccountingPeriod: () => {
    ownProps.onChangeEditingExpReport('report.accountingDate', '', false);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(AccountingPeriodAndRecordDate) as React.ComponentType<Record<string, any>>;
