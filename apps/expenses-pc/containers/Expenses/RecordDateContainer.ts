import { connect } from 'react-redux';

import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import RecordDate from '../../../commons/components/exp/Form/ReportSummary/Form/DateSelector/RecordDate';
import { getLatestHistoryCostCenter } from '@commons/action-dispatchers/CostCenter';
import DateUtil from '@commons/utils/DateUtil';

import { LatestCostCenter } from '@apps/domain/models/exp/CostCenter';

import { getDefaultCostCenter } from '../../../domain/modules/exp/cost-center/defaultCostCenter';
import { updateRecordDate } from '@apps/domain/modules/exp/recordDate';

import { changeReportonCostCenter } from './AccountingPeriodAndrecordDateContainer';

const mapStateToProps = (state, ownProps) => ({
  employeeId: state.userSetting.employeeId,
  reportTypeListActive: state.entities.exp.expenseReportType.list.active,
  reportTypeListInactive: state.entities.exp.expenseReportType.list.inactive,
  defaultCostCenter: state.entities.exp.costCenter.defaultCostCenter,
  latestCostCenter: state.entities.exp.costCenter.latestCostCenter,
  ...ownProps,
});

const mapDispatchToProps = {
  getDefaultCostCenter,
  getLatestHistoryCostCenter,
  updateRecordDate,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  onChangeRecordDate: async (date: string) => {
    const reportDate = get(ownProps.expReport, 'accountingDate');
    if (date === reportDate) return;
    ownProps.onChangeEditingExpReport('report.accountingDate', date, true);
    dispatchProps.updateRecordDate(date);
    if (!date) {
      return;
    }
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
        date,
      });
      const empId = ownProps.isFinanceApproval
        ? get(ownProps.expReport, 'employeeBaseId', '')
        : stateProps.employeeId;
      const defaultCostCenter = !fetchedDefaultCC
        ? await dispatchProps.getDefaultCostCenter(empId, date)
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
        // get latest cc if there is an existing cc selected and not default cc
        const { validDateFrom, validDateTo } = stateProps.latestCostCenter;
        let latestCostCenter = stateProps.latestCostCenter;
        const isDateInRange = DateUtil.inRange(
          date,
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
            date
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RecordDate) as React.ComponentType<Record<string, any>>;
