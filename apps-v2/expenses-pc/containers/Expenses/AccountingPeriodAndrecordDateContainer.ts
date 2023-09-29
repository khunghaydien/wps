import { connect } from 'react-redux';

import find from 'lodash/find';
import get from 'lodash/get';

import AccountingPeriodAndRecordDate from '../../../commons/components/exp/Form/ReportSummary/Form/DateSelector/AccountingPeriodAndRecordDate';
import { getCostCenterData } from '@commons/action-dispatchers/CostCenter';

import {
  DefaultCostCenter,
  defaultCostCenter as defaultCC,
} from '../../../domain/models/exp/CostCenter';

const mapStateToProps = (state, ownProps) => {
  const subroleId = get(state, 'ui.expenses.subrole.selectedRole');
  return {
    accountingPeriodAll: state.ui.expenses.recordListPane.accountingPeriod,
    accountingPeriodActive:
      state.ui.expenses.recordListPane.accountingPeriod.filter(
        (ap) => ap.active
      ),
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
    isActiveReport: !state.ui.expenses.tab.tabIdx,
    subroleId,
    ...ownProps,
  };
};

const mapDispatchToProps = {
  getCostCenterData,
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
    const reportDate = get(ownProps.expReport, 'accountingDate');
    if (selectedAccountingPeriod.recordingDate === reportDate) return;
    changeReportonAccountingReport(ownProps, selectedAccountingPeriod, true);
    const reportTypeList = [
      ...stateProps.reportTypeListActive,
      ...stateProps.reportTypeListInactive,
    ];
    const costCenterData = await dispatchProps.getCostCenterData(
      selectedAccountingPeriod.recordingDate,
      stateProps.defaultCostCenter,
      stateProps.employeeId,
      ownProps.expReport,
      ownProps.isFinanceApproval,
      stateProps.latestCostCenter,
      reportTypeList,
      stateProps.subroleId
    );
    if (costCenterData)
      changeReportonCostCenter(
        ownProps,
        costCenterData.costCenter,
        costCenterData.isChangedManually
      );
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
