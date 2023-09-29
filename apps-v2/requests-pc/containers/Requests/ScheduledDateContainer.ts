import { connect } from 'react-redux';

import get from 'lodash/get';

import ScheduledDate from '../../../commons/components/exp/Form/ReportSummary/Form/DateSelector/ScheduledDate';
import { getCostCenterData } from '@commons/action-dispatchers/CostCenter';

import {
  DefaultCostCenter,
  defaultCostCenter as defaultCC,
} from '../../../domain/models/exp/CostCenter';

const mapStateToProps = (state, ownProps) => {
  const subroleId = get(state, 'ui.expenses.subrole.selectedRole');
  return {
    employeeId: state.userSetting.employeeId,
    reportTypeList: state.entities.exp.expenseReportType.list.active,
    defaultCostCenter: state.entities.exp.costCenter.defaultCostCenter,
    latestCostCenter: state.entities.exp.costCenter.latestCostCenter,
    subroleId,
    ...ownProps,
  };
};

const mapDispatchToProps = {
  getCostCenterData,
};

export const changeReportonCostCenter = (
  onChangeEditingExpReport: Function,
  defaultCostCenter: DefaultCostCenter = defaultCC,
  isCostCenterChangedManually?: boolean
) => {
  const { costCenterCode, costCenterName, costCenterHistoryId } =
    defaultCostCenter;
  onChangeEditingExpReport('report.costCenterCode', costCenterCode, true);
  onChangeEditingExpReport('report.costCenterName', costCenterName, true);
  onChangeEditingExpReport(
    'report.costCenterHistoryId',
    costCenterHistoryId,
    true
  );
  onChangeEditingExpReport(
    `report.isCostCenterChangedManually`,
    isCostCenterChangedManually || false
  );
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  onChangeScheduledDate: async (date: string) => {
    const reportDate = get(ownProps.expReport, 'scheduledDate');
    if (date === reportDate) return;
    ownProps.onChangeEditingExpReport('report.scheduledDate', date, true);
    const costCenterData = await dispatchProps.getCostCenterData(
      date,
      stateProps.defaultCostCenter,
      stateProps.employeeId,
      ownProps.expReport,
      ownProps.isFinanceApproval,
      stateProps.latestCostCenter,
      stateProps.reportTypeList,
      stateProps.subroleId
    );
    if (costCenterData)
      changeReportonCostCenter(
        ownProps.onChangeEditingExpReport,
        costCenterData.costCenter,
        costCenterData.isChangedManually
      );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ScheduledDate) as React.ComponentType<Record<string, any>>;
