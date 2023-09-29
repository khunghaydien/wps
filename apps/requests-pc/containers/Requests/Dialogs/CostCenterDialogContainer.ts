import { connect } from 'react-redux';

import CostCenterSelect, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/CostCenterSelect';

import { State } from '../../../modules';
import { actions as latestCostCenterActions } from '@apps/domain/modules/exp/cost-center/latestCostCenter';

import {
  getCostCenterList,
  getCostCenterSearchResult,
  getNextCostCenterList,
} from '../../../action-dispatchers/CostCenter';
import { isNotDefaultCostCenter } from '../../../action-dispatchers/Requests';

import { Props as OwnProps } from '../../../components/Requests/Dialog';

const mapStateToProps = (state: State, ownProps: OwnProps) => ({
  companyId: state.userSetting.companyId,
  employeeId: state.userSetting.employeeId,
  hintMsg:
    ownProps.recordIdx === -1
      ? state.entities.exp.customHint.reportHeaderCostCenter
      : state.entities.exp.customHint.recordCostCenter,
  costCenterList: state.ui.expenses.dialog.costCenterSelect.list.selectionList,
  costCenterSearchList:
    state.ui.expenses.dialog.costCenterSelect.list.searchList,
  costCenterRecentItems: state.common.costCenterDialog.ui.list.recentItems,
  defaultCostCenter: state.entities.exp.costCenter.defaultCostCenter,
  selectedDelegator: state.ui.expenses.delegateApplicant.selectedEmployee,
  hasMore: state.ui.expenses.dialog.costCenterSelect.list.hasMore,
  isLoading: !!state.ui.expenses.dialog.isLoading,
  isRecordOpen: state.ui.expenses.overlap.record,
});

const mapDispatchToProps = {
  getCostCenterList,
  getNextCostCenterList,
  getCostCenterSearchResult,
  isNotDefaultCostCenter,
  clearLatestCostCenter: latestCostCenterActions.clear,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onClickCostCenterSelectByCategory: () => {
    const { expReport, recordIdx } = ownProps;
    const date = stateProps.isRecordOpen
      ? expReport.records[recordIdx].recordDate
      : expReport.scheduledDate || '';
    dispatchProps.getCostCenterList(null, date);
  },
  onClickCostCenterSearch: (keyword) => {
    const { expReport, recordIdx } = ownProps;
    const date = stateProps.isRecordOpen
      ? expReport.records[recordIdx].recordDate
      : expReport.scheduledDate || '';
    dispatchProps.getCostCenterSearchResult(
      stateProps.companyId,
      keyword,
      date
    );
  },
  onClickCostCenterListItem: async (item, items) => {
    const { expReport, recordIdx } = ownProps;
    if (item.hasChildren && items !== undefined) {
      const date = stateProps.isRecordOpen
        ? expReport.records[recordIdx].recordDate
        : expReport.scheduledDate || '';
      dispatchProps.getNextCostCenterList(item, items, item.baseId, date);
    } else {
      const recordIdx = ownProps.recordIdx;
      // if no record be selected, set cost center info to report header, otherwise set to selected record
      if (recordIdx === -1) {
        ownProps.onChangeEditingExpReport(
          `report.costCenterHistoryId`,
          item.id,
          true,
          false
        );
        ownProps.onChangeEditingExpReport(
          `report.costCenterName`,
          item.name,
          true
        );
        ownProps.onChangeEditingExpReport(
          `report.costCenterCode`,
          item.code,
          true,
          false
        );
        dispatchProps.clearLatestCostCenter();
        const isNotDefaultCostCenter =
          await dispatchProps.isNotDefaultCostCenter(
            item.code,
            expReport.scheduledDate,
            stateProps.defaultCostCenter,
            stateProps.employeeId
          );
        ownProps.onChangeEditingExpReport(
          `report.isCostCenterChangedManually`,
          isNotDefaultCostCenter,
          null,
          false
        );
      } else {
        ownProps.onChangeEditingExpReport(
          `report.records[${recordIdx}].items[0].costCenterHistoryId`,
          item.id,
          true,
          false
        );
        ownProps.onChangeEditingExpReport(
          `report.records[${recordIdx}].items[0].costCenterName`,
          item.name,
          true
        );
        ownProps.onChangeEditingExpReport(
          `report.records[${recordIdx}].items[0].costCenterCode`,
          item.code,
          true,
          false
        );
      }
      ownProps.hideDialog();
      ownProps.clearDialog();
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CostCenterSelect) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
