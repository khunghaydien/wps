import { connect } from 'react-redux';

import { getTargetDate } from '../../domain/models/team/AttSummaryPeriodList';

import { State } from '../modules';
import {
  actions,
  Item,
  ItemList,
} from '../modules/ui/attRequestStatus/departmentSelectDialog';

import { changeDepartment } from '../action-dispatchers/AttRequestStatus';
import { searchDepartmentItemLists } from '../action-dispatchers/DepartmentSelectDialog';

import Component from '../components/AttRequestStatus/DepartmentSelectDialog';

const mapStateToProps = (state: State) => ({
  targetDate: getTargetDate(
    state.ui.attRequestStatus.periods.current,
    state.entities.attSummaryPeriodList
  ),
  companyId: state.common.userSetting.companyId,
  items: state.ui.attRequestStatus.departmentSelectDialog.itemLists,
  isOpened: state.ui.attRequestStatus.departmentSelectDialog.isOpenedDialog,
  targetPeriod: state.ui.attRequestStatus.periods.current,
  attSummaryPeriodList: state.entities.attSummaryPeriodList,
});

const mapDispatchToProps = {
  search: searchDepartmentItemLists,
  onClickCloseButton: actions.closeDialog,
  select: actions.select,
  changeDepartment,
};

const mergeProps = (
  stateProps,
  dispatchProps: typeof mapDispatchToProps,
  ownProps
) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onClickItem: (item: Item, items: ItemList[]) => {
    if (item.hasChildren && items !== undefined) {
      dispatchProps.search(
        // $FlowFixMe v0.85
        stateProps.targetDate,
        stateProps.companyId,
        item,
        items
      );
    } else {
      dispatchProps.select(item);
      dispatchProps.changeDepartment(
        item.id,
        stateProps.targetPeriod,
        stateProps.attSummaryPeriodList
      );
      dispatchProps.onClickCloseButton();
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Component);
