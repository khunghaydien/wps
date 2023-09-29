import { connect } from 'react-redux';

import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import ScheduledDate from '../../../commons/components/exp/Form/ReportSummary/Form/DateSelector/ScheduledDate';
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
  employeeId: state.userSetting.employeeId,
  reportTypeList: state.entities.exp.expenseReportType.list.active,
  defaultCostCenter: state.entities.exp.costCenter.defaultCostCenter,
  latestCostCenter: state.entities.exp.costCenter.latestCostCenter,
  ...ownProps,
});

const mapDispatchToProps = {
  getDefaultCostCenter,
  getLatestHistoryCostCenter,
  updateRecordDate,
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
    dispatchProps.updateRecordDate(date);
    if (!date) {
      return;
    }
    const reportTypeWithCostCenterUsed = (stateProps.reportTypeList || []).find(
      (x) =>
        x.id === ownProps.expReport.expReportTypeId &&
        x.isCostCenterRequired !== 'UNUSED'
    );
    if (reportTypeWithCostCenterUsed) {
      const currentCC = get(ownProps.expReport, 'costCenterCode');
      const fetchedDefaultCC = find(stateProps.defaultCostCenter, {
        date,
      });
      const defaultCostCenter = !fetchedDefaultCC
        ? await dispatchProps.getDefaultCostCenter(stateProps.employeeId, date)
        : fetchedDefaultCC.costCenter;
      // check if selected is DCC as DCC can be selected on another date
      const isUpdateDefaultCC =
        !get(ownProps.expReport, 'isCostCenterChangedManually') ||
        isEmpty(currentCC);
      if (isUpdateDefaultCC || defaultCostCenter.costCenterCode === currentCC) {
        changeReportonCostCenter(ownProps.onChangeEditingExpReport, {
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
        changeReportonCostCenter(
          ownProps.onChangeEditingExpReport,
          costCenter,
          true
        );
      }
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ScheduledDate) as React.ComponentType<Record<string, any>>;
