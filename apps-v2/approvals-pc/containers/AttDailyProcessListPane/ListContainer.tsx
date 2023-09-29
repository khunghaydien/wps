import * as React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { State } from '../../modules';
import * as detailActions from '../../modules/entities/att/detail/actions';
import {
  actions as activeDialogActions,
  ACTIVE_DIALOG_TYPES,
} from '../../modules/ui/activeDialog';
import {
  actions as filterTermsUIActions,
  selectors as filterTermsSelector,
} from '../../modules/ui/att/list/filterTerms';
import { actions as maxSelectionActions } from '../../modules/ui/att/list/maxSelection';
import { actions as selectedIdsActions } from '../../modules/ui/att/list/selectedIds';

import * as AttDailyActions from '../../action-dispatchers/AttDaily';

import List from '../../components/attendance/AttDailyProcessListPane/List';

import useCheckAll from '@attendance/ui/pc/approval-pc/hooks/useCheckAll';

const mapStateToProps = (state: State) => ({
  totalCount: state.entities.att.list.allIds.length,
  requestList: filterTermsSelector.extractRecordsByFilter(state),
  filterTerms: state.ui.att.list.filterTerms,
  existingRequestTypes: filterTermsSelector.buildRequestTypesOptions(state),
  selectedIds: state.ui.att.list.selectedIds,
  browseId: state.entities.att.detail.request.id,
  approvalType: state.ui.approvalType,
  activeDialog: state.ui.activeDialog,
  listedIds: filterTermsSelector.extractIdsByFilter(state),
  canBulkApproveAttDailyRequest:
    state.common.accessControl.permission.canBulkApproveAttDailyRequest,
  maxSelection: state.ui.att.list.maxSelection,
  overLimit: state.entities.att.list.overLimit,
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
          initialize: AttDailyActions.initialize,
          switchApprovalType: AttDailyActions.switchApprovalType,
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
      existingRequestTypes={props.existingRequestTypes}
      selectedIds={props.selectedIds}
      approvalType={props.approvalType}
      browseId={props.browseId}
      onClickRow={actions.browseDetail}
      onChangeRowSelection={onChangeRowSelection}
      onChangeMaxSelection={actions.setMaxSelection}
      onSwitchApprovalType={actions.switchApprovalType}
      onUpdateFilterTerm={actions.updateFilterTerm}
      activeDialog={props.activeDialog}
      onClickApproveAllButton={onClickApproveAllButton}
      listedIds={props.listedIds}
      maxSelection={props.maxSelection}
      canBulkApprove={props.canBulkApproveAttDailyRequest}
      overLimit={props.overLimit}
    />
  );
};

export default ListContainer;
