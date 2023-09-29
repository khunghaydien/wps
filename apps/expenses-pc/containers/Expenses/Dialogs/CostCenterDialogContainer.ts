import { connect } from 'react-redux';

import {
  getCostCenterList,
  getCostCenterSearchResult,
  getNextCostCenterList,
} from '../../../../commons/action-dispatchers/CostCenter';
import CostCenterSelect, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/CostCenterSelect';

import { State } from '../../../modules';
import { actions as latestCostCenterActions } from '@apps/domain/modules/exp/cost-center/latestCostCenter';

import { withSkeletonLoading } from '../../../action-dispatchers/Dialog';
import { isNotDefaultCostCenter } from '../../../action-dispatchers/Expenses';

import { Props as OwnProps } from '../../../components/Expenses/Dialog';

const mapStateToProps = (state: State, ownProps: OwnProps) => ({
  companyId: state.userSetting.companyId,
  employeeId: state.userSetting.employeeId,
  hintMsg:
    ownProps.recordIdx === -1
      ? state.entities.exp.customHint.reportHeaderCostCenter
      : state.entities.exp.customHint.recordCostCenter,
  costCenterList: state.common.costCenterDialog.ui.list.selectionList,
  costCenterSearchList: state.common.costCenterDialog.ui.list.searchList,
  costCenterRecentItems: state.common.costCenterDialog.ui.list.recentItems,
  defaultCostCenter: state.entities.exp.costCenter.defaultCostCenter,
  selectedDelegator: state.ui.expenses.delegateApplicant.selectedEmployee,
  isRecordOpen: state.ui.expenses.overlap.record,
  isLoading: !!state.ui.expenses.dialog.isLoading,
  // selectedCompanyId from FA cross Company
  selectedCompanyId: ownProps.selectedCompanyId || state.userSetting.companyId,
  hasMore: state.common.costCenterDialog.ui.list.hasMore,
});

const mapDispatchToProps = {
  getCostCenterList,
  getNextCostCenterList,
  getCostCenterSearchResult,
  withSkeletonLoading,
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
      : expReport.accountingDate;
    dispatchProps.withSkeletonLoading(() =>
      dispatchProps.getCostCenterList(
        null,
        date,
        stateProps.selectedCompanyId,
        ownProps.expReport.employeeBaseId,
        true
      )
    );
  },
  onClickCostCenterSearch: (keyword) => {
    const { expReport, recordIdx } = ownProps;
    const date = stateProps.isRecordOpen
      ? expReport.records[recordIdx].recordDate
      : expReport.accountingDate;
    dispatchProps.withSkeletonLoading(() =>
      dispatchProps.getCostCenterSearchResult(
        stateProps.selectedCompanyId,
        keyword,
        date,
        true
      )
    );
  },
  onClickCostCenterListItem: async (item, items) => {
    const { expReport, recordIdx } = ownProps;
    if (item.hasChildren && items !== undefined) {
      const date = stateProps.isRecordOpen
        ? expReport.records[recordIdx].recordDate
        : expReport.accountingDate;
      dispatchProps.withSkeletonLoading(() =>
        dispatchProps.getNextCostCenterList(
          item,
          items,
          item.baseId,
          date,
          stateProps.selectedCompanyId,
          ownProps.expReport.employeeBaseId,
          true
        )
      );
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
            expReport.accountingDate,
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
