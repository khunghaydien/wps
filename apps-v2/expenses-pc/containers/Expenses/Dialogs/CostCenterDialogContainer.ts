import { connect } from 'react-redux';

import get from 'lodash/get';

import {
  getCostCenterList,
  getCostCenterSearchResult,
  getNextCostCenterList,
} from '../../../../commons/action-dispatchers/CostCenter';
import CostCenterSelect, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/CostCenterSelect';
import { updateChildItemCC } from '@commons/utils/exp/ItemizationUtil';

import { isItemizedRecord } from '@apps/domain/models/exp/Record';

import { State } from '../../../modules';
import { actions as latestCostCenterActions } from '@apps/domain/modules/exp/cost-center/latestCostCenter';

import { withSkeletonLoading } from '../../../action-dispatchers/Dialog';
import { isNotDefaultCostCenter } from '../../../action-dispatchers/Expenses';

import { Props as OwnProps } from '../../../components/Expenses/Dialog';

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  let subroleId = get(state, 'ui.expenses.subrole.selectedRole');
  if (ownProps.isFinanceApproval)
    subroleId = get(ownProps, 'expReport.empHistoryId', subroleId);
  return {
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
    selectedCompanyId:
      ownProps.selectedCompanyId || state.userSetting.companyId,
    hasMore: state.common.costCenterDialog.ui.list.hasMore,
    subroleId,
  };
};

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
        true,
        stateProps.subroleId
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
          true,
          stateProps.subroleId
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
        const { defaultCostCenter, employeeId, subroleId } = stateProps;
        dispatchProps.clearLatestCostCenter();
        const isNotDefaultCostCenter =
          await dispatchProps.isNotDefaultCostCenter(
            item.code,
            expReport.accountingDate,
            defaultCostCenter,
            subroleId,
            employeeId
          );
        ownProps.onChangeEditingExpReport(
          `report.isCostCenterChangedManually`,
          isNotDefaultCostCenter,
          null,
          false
        );
      } else {
        const recordItemIdx = ownProps.recordItemIdx || 0;
        const itemList = get(expReport, `records.${recordIdx}.items`, []);
        const isItemizedParent =
          recordItemIdx === 0 && isItemizedRecord(itemList.length);

        if (isItemizedParent) {
          const newItemList = updateChildItemCC(
            itemList,
            expReport.costCenterHistoryId
          );
          ownProps.onChangeEditingExpReport(
            `report.records[${recordIdx}].items`,
            newItemList,
            false,
            false
          );
        }

        ownProps.onChangeEditingExpReport(
          `report.records[${recordIdx}].items[${recordItemIdx}].costCenterHistoryId`,
          item.id,
          true,
          false
        );
        ownProps.onChangeEditingExpReport(
          `report.records[${recordIdx}].items[${recordItemIdx}].costCenterName`,
          item.name,
          true
        );
        ownProps.onChangeEditingExpReport(
          `report.records[${recordIdx}].items[${recordItemIdx}].costCenterCode`,
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
