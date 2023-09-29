import * as React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { State } from '../../modules';
import { actions as detailActions } from '../../modules/entities/attMonthly/detail';
import {
  actions as activeDialogActions,
  ACTIVE_DIALOG_TYPES,
} from '../../modules/ui/activeDialog';
import {
  actions as filterTermsUIActions,
  selectors as filterTermsSelector,
} from '../../modules/ui/attMonthly/list/filterTerms';
import { actions as maxSelectionActions } from '../../modules/ui/attMonthly/list/maxSelection';
import { actions as selectedIdsActions } from '../../modules/ui/attMonthly/list/selectedIds';

import * as AttMonthlyActions from '../../action-dispatchers/AttMonthly';

import List from '../../components/attendance/AttMonthlyFixProcessListPane/List';

import useCheckAll from '@attendance/ui/pc/approval-pc/hooks/useCheckAll';

const mapStateToProps = (state: State) => ({
  totalCount: state.entities.attMonthly.list.allIds.length,
  requestList: filterTermsSelector.extractRecordsByFilter(state),
  filterTerms: state.ui.attMonthly.list.filterTerms,
  existingMonths: filterTermsSelector.buildTargetMonthOptions(state),
  selectedIds: state.ui.attMonthly.list.selectedIds,
  browseId: state.entities.attMonthly.detail.id,
  approvalType: state.ui.approvalType,
  activeDialog: state.ui.activeDialog,
  listedIds: filterTermsSelector.extractIdsByFilter(state),
  canBulkApproveAttRequest:
    state.common.accessControl.permission.canBulkApproveAttRequest,
  maxSelection: state.ui.attMonthly.list.maxSelection,
  overLimit: state.entities.attMonthly.list.overLimit,
});

const ListContainer: React.FC = () => {
  const props = useSelector(mapStateToProps, shallowEqual) as ReturnType<
    typeof mapStateToProps
  >;
  const dispatch = useDispatch();

  const actions = React.useMemo(
    () =>
      bindActionCreators(
        {
          initialize: AttMonthlyActions.initialize,
          switchApprovalType: AttMonthlyActions.switchApprovalType,
          updateFilterTerm: filterTermsUIActions.update,
          browseDetail: detailActions.browse,
          setSelectedIds: selectedIdsActions.set,
          setActiveDialog: activeDialogActions.set,
          setMaxSelection: maxSelectionActions.set,
        },
        dispatch
      ),
    [dispatch]
  );

  const targetIds = React.useMemo(
    () => props.requestList.map(({ id }) => id),
    [props.requestList]
  );

  const checkActions = useCheckAll({
    targets: targetIds,
    checked: props.selectedIds,
    setChecked: actions.setSelectedIds,
    max: props.maxSelection,
  });

  const onChangeRowSelection = React.useCallback(
    ({ id }) => {
      if (id) {
        checkActions.check(id);
      } else {
        checkActions.checkAll();
      }
    },
    [checkActions]
  );

  const onClickApproveAllButton = React.useCallback(() => {
    actions.setActiveDialog(ACTIVE_DIALOG_TYPES.BULK_APPROVAL_CONFIRM);
  }, [actions]);

  React.useEffect(() => {
    actions.initialize();
  }, []);

  return (
    <List
      totalCount={props.totalCount}
      requestList={props.requestList}
      filterTerms={props.filterTerms}
      existingMonths={props.existingMonths}
      selectedIds={props.selectedIds}
      approvalType={props.approvalType}
      browseId={props.browseId}
      activeDialog={props.activeDialog}
      listedIds={props.listedIds}
      maxSelection={props.maxSelection}
      canBulkApprove={props.canBulkApproveAttRequest}
      overLimit={props.overLimit}
      onClickRow={actions.browseDetail}
      onChangeRowSelection={onChangeRowSelection}
      onChangeMaxSelection={actions.setMaxSelection}
      onSwitchApprovalType={actions.switchApprovalType}
      onUpdateFilterTerm={actions.updateFilterTerm}
      onClickApproveAllButton={onClickApproveAllButton}
    />
  );
};

export default ListContainer;
