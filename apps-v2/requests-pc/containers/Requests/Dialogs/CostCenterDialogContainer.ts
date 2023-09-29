import { connect } from 'react-redux';

import get from 'lodash/get';

import CostCenterSelect, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/CostCenterSelect';
import { updateChildItemCC } from '@commons/utils/exp/ItemizationUtil';

import { isItemizedRecord } from '@apps/domain/models/exp/Record';

import { State } from '../../../modules';
import { actions as latestCostCenterActions } from '@apps/domain/modules/exp/cost-center/latestCostCenter';

import {
  getCostCenterList,
  getCostCenterSearchResult,
  getNextCostCenterList,
} from '../../../action-dispatchers/CostCenter';
import { isNotDefaultCostCenter } from '../../../action-dispatchers/Requests';

import { Props as OwnProps } from '../../../components/Requests/Dialog';

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  let subroleId = get(state, 'ui.expenses.subrole.selectedRole');
  const { isFinanceApproval, recordIdx } = ownProps;
  const costCenterPath = isFinanceApproval ? 'requests' : 'expenses';
  if (isFinanceApproval)
    subroleId = get(ownProps, 'expReport.empHistoryId', subroleId);
  return {
    companyId: state.userSetting.companyId,
    employeeId: state.userSetting.employeeId,
    hintMsg:
      recordIdx === -1
        ? state.entities.exp.customHint.reportHeaderCostCenter
        : state.entities.exp.customHint.recordCostCenter,
    costCenterList:
      state.ui[costCenterPath].dialog.costCenterSelect.list.selectionList,
    costCenterSearchList:
      state.ui[costCenterPath].dialog.costCenterSelect.list.searchList,
    costCenterRecentItems: state.common.costCenterDialog.ui.list.recentItems,
    defaultCostCenter: state.entities.exp.costCenter.defaultCostCenter,
    selectedDelegator:
      state.ui[costCenterPath].delegateApplicant.selectedEmployee,
    hasMore: state.ui[costCenterPath].dialog.costCenterSelect.list.hasMore,
    isLoading: !!state.ui[costCenterPath].dialog.isLoading,
    selectedCompanyId:
      ownProps.selectedCompanyId || state.userSetting.companyId,
    isRecordOpen: state.ui[costCenterPath].overlap.record,
    subroleId,
  };
};

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
    dispatchProps.getCostCenterList(
      null,
      date,
      stateProps.subroleId,
      stateProps.selectedCompanyId
    );
  },
  onClickCostCenterSearch: (keyword) => {
    const { expReport, recordIdx } = ownProps;
    const date = stateProps.isRecordOpen
      ? expReport.records[recordIdx].recordDate
      : expReport.scheduledDate || '';
    dispatchProps.getCostCenterSearchResult(
      stateProps.selectedCompanyId,
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
      dispatchProps.getNextCostCenterList(
        item,
        items,
        item.baseId,
        date,
        stateProps.subroleId
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
            expReport.scheduledDate,
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
