import { connect } from 'react-redux';

import cloneDeep from 'lodash/cloneDeep';

import ExtendedItem, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/ExtendedItem';

import { State } from '../../../modules';
import { actions as eiRecentlyUsedAction } from '../../../modules/ui/expenses/dialog/extendedItem/recentlyUsed';
import { actions as eiSearchAction } from '../../../modules/ui/expenses/dialog/extendedItem/search';

import { searchEILookup } from '../../../action-dispatchers/Requests';

import { Props as OwnProps } from '../../../components/Requests/Dialog';

const mapStateToProps = (state: State) => ({
  eiRecentlyUsed: state.ui.expenses.dialog.extendedItem.recentlyUsed,
  extendedItemLookup: state.ui.expenses.dialog.extendedItem.search,
  selectedDelegator: state.ui.expenses.delegateApplicant.selectedEmployee,
  isLoading: !!state.ui.expenses.dialog.isLoading,
});

const mapDispatchToProps = {
  searchEILookup,
  clearEIRecentlyUsedDialog: eiRecentlyUsedAction.clear,
  clearEISearchDialog: eiSearchAction.clear,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  // @ts-ignore
  onClickSearchLookup: (id, query) => dispatchProps.searchEILookup(id, query),
  onClickCustomObjectOption: (item) => {
    const idx = stateProps.extendedItemLookup.idx;
    const target = stateProps.extendedItemLookup.target;
    const expReport = cloneDeep(ownProps.expReport);
    const touched = cloneDeep(ownProps.touched);
    const recordItemIdx = ownProps.recordItemIdx || 0;

    if (target === 'REPORT') {
      expReport[`extendedItemLookup${idx}SelectedOptionName`] = item.name;
      expReport[`extendedItemLookup${idx}Value`] = item.code;
    } else {
      const targetRecord = expReport.records[ownProps.recordIdx];
      targetRecord.items[recordItemIdx][
        `extendedItemLookup${idx}SelectedOptionName`
      ] = item.name;
      targetRecord.items[recordItemIdx][`extendedItemLookup${idx}Value`] =
        item.code;
    }
    touched[`extendedItemLookup${idx}Value`] = true;
    ownProps.onChangeEditingExpReport('report', expReport, touched);
    dispatchProps.clearEISearchDialog();
    dispatchProps.clearEIRecentlyUsedDialog();
    ownProps.hideDialog();
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ExtendedItem) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
