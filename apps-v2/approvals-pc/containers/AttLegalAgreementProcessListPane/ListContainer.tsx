import * as React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import AccessControlContainer from '@apps/commons/containers/AccessControlContainer';

import { State } from '../../modules';
import {
  actions as activeDialogActions,
  ACTIVE_DIALOG_TYPES,
} from '../../modules/ui/activeDialog';
import {
  actions as filterTermsUIActions,
  selectors as filterTermsSelector,
} from '../../modules/ui/attLegalAgreement/list/filterTerms';
import { actions as maxSelectionActions } from '../../modules/ui/attLegalAgreement/list/maxSelection';
import { actions as selectedIdsActions } from '../../modules/ui/attLegalAgreement/list/selectedIds';

import * as AttLegalAgreementActions from '../../action-dispatchers/AttLegalAgreement';

import List from '../../components/attendance/AttLegalAgreementProcess/List';

import ApprovalDialogContainer from '../BulkApproval/ApprovalDialogContainer';
import useCheckAll from '@attendance/ui/pc/approval-pc/hooks/useCheckAll';

const mapStateToProps = (state: State) => ({
  totalCount: state.entities.attLegalAgreement.list.allIds.length,
  requestList: filterTermsSelector.extractRecordsByFilter(state),
  filterTerms: state.ui.attLegalAgreement.list.filterTerms,
  existingMonths: filterTermsSelector.buildTargetMonthOptions(state),
  existingRequestTypes: filterTermsSelector.buildRequestTypesOptions(state),
  selectedIds: state.ui.attLegalAgreement.list.selectedIds,
  browseId: state.entities.attLegalAgreement.detail?.request.id,
  approvalType: state.ui.approvalType,
  activeDialog: state.ui.activeDialog,
  listedIds: filterTermsSelector.extractIdsByFilter(state),
  bulkApprovalAttLegalAgreementRequest:
    state.common.accessControl.permission.bulkApprovalAttLegalAgreementRequest,
  maxSelection: state.ui.attLegalAgreement.list.maxSelection,
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
          initialize: AttLegalAgreementActions.initialize,
          switchApprovalType: AttLegalAgreementActions.switchApprovalType,
          updateFilterTerm: filterTermsUIActions.update,
          browseDetail: AttLegalAgreementActions.getDetailInfo,
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
      ApprovalDialogContainer={ApprovalDialogContainer}
      AccessControlContainer={AccessControlContainer}
      canBulkApprove={props.bulkApprovalAttLegalAgreementRequest}
    />
  );
};

export default ListContainer;
