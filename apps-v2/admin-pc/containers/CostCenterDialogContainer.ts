import { connect } from 'react-redux';

import {
  getCostCenterList,
  getCostCenterSearchResult,
  getNextCostCenterList,
} from '../../commons/action-dispatchers/CostCenter';
import CostCenterSelect, {
  Props,
} from '../../commons/components/exp/Form/Dialog/CostCenterSelect';
import { $ExtractReturn } from '../../commons/utils/TypeUtil';

import { State } from '../reducers/index';

export type OwnProps = {
  onClickHideDialogButton: () => void;
  clearDialog: () => Record<string, any>;
  hideDialog: () => Record<string, any>;
  targetDate: string;
  select: (arg0: Record<string, any>) => void;
};

const mapStateToProps = (state: State) => ({
  costCenterList: state.costCenterDialog.ui.list.selectionList,
  costCenterSearchList: state.costCenterDialog.ui.list.searchList,
  hasMore: state.costCenterDialog.ui.list.hasMore,
  costCenterRecentItems: state.costCenterDialog.ui.list.recentItems,
  selectedCompanyId: state.base.menuPane.ui.targetCompanyId,
  employeeBaseId: state.common.userSetting.employeeId,
});

const mapDispatchToProps = {
  getCostCenterList,
  getNextCostCenterList,
  getCostCenterSearchResult,
};

const mergeProps = (
  stateProps: $ExtractReturn<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onClickCostCenterSelectByCategory: () => {
    dispatchProps.getCostCenterList(
      null,
      ownProps.targetDate,
      stateProps.selectedCompanyId
    );
  },
  onClickCostCenterSearch: (keyword) => {
    dispatchProps.getCostCenterSearchResult(
      stateProps.selectedCompanyId,
      keyword,
      ownProps.targetDate
    );
  },
  onClickCostCenterListItem: (item, items) => {
    if (item.hasChildren && items !== undefined) {
      dispatchProps.getNextCostCenterList(
        item,
        items,
        item.baseId,
        ownProps.targetDate,
        stateProps.selectedCompanyId
      );
    } else {
      ownProps.select(item);
    }
  },
  isFinanceApproval: false,
  isAdmin: true,
  selectedDelegator: null,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CostCenterSelect) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
