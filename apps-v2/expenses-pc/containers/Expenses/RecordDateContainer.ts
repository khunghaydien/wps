import { connect } from 'react-redux';

import get from 'lodash/get';

import RecordDate from '../../../commons/components/exp/Form/ReportSummary/Form/DateSelector/RecordDate';
import { getCostCenterData } from '@commons/action-dispatchers/CostCenter';

import { changeReportonCostCenter } from './AccountingPeriodAndrecordDateContainer';

const mapStateToProps = (state, ownProps) => {
  const subroleId = get(state, 'ui.expenses.subrole.selectedRole');
  return {
    employeeId: state.userSetting.employeeId,
    reportTypeListActive: state.entities.exp.expenseReportType.list.active,
    reportTypeListInactive: state.entities.exp.expenseReportType.list.inactive,
    defaultCostCenter: state.entities.exp.costCenter.defaultCostCenter,
    latestCostCenter: state.entities.exp.costCenter.latestCostCenter,
    subroleId,
    ...ownProps,
  };
};

const mapDispatchToProps = {
  getCostCenterData,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  onChangeRecordDate: async (date: string) => {
    const reportDate = get(ownProps.expReport, 'accountingDate');
    if (date === reportDate) return;
    ownProps.onChangeEditingExpReport('report.accountingDate', date, true);
    const reportTypeList = [
      ...stateProps.reportTypeListActive,
      ...stateProps.reportTypeListInactive,
    ];
    const costCenterData = await dispatchProps.getCostCenterData(
      date,
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RecordDate) as React.ComponentType<Record<string, any>>;
