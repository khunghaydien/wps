import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ApprovalTypeValue } from '../../../domain/models/approval/ApprovalType';

import * as detailActions from '../../modules/entities/att/detail/actions';
import { AttDailyRequest } from '../../modules/entities/att/list/actions';
import {
  actions as activeDialogActions,
  ACTIVE_DIALOG_TYPES,
} from '../../modules/ui/activeDialog';
import {
  actions as filterTermsUIActions,
  selectors as filterTermsSelector,
  State as FilterTermsType,
} from '../../modules/ui/att/list/filterTerms';
import { actions as selectedIdsActions } from '../../modules/ui/att/list/selectedIds';

import * as AttDailyActions from '../../action-dispatchers/AttDaily';

import List from '../../components/AttDailyProcessListPane/List';

const MAX_SELECTION = 100;
type Props = {
  totalCount: number;
  requestList: Array<AttDailyRequest>;
  filterTerms: FilterTermsType;
  existingRequestTypes: Array<string | { text: string; value: any }>;
  selectedIds: Array<string>;
  approvalType: ApprovalTypeValue;
  browseId: string;
  initialize: () => void;
  browseDetail: (arg0: string) => void;
  updateFilterTerm: (arg0: keyof FilterTermsType, arg1: string) => void;
  switchApprovalType: (arg0: ApprovalTypeValue) => void;
  onChangeRowSelection: (arg0: { id: string; checked: boolean }) => void;
  activeDialog: string;
  listedIds: Array<string>;
  onClickApproveAllButton: () => void;
  canBulkApproveAttDailyRequest: boolean;
};

class ListContainer extends React.Component<Props> {
  componentDidMount() {
    this.props.initialize();
  }

  render() {
    // TODO Implement selection change event
    return (
      <List
        totalCount={this.props.totalCount}
        requestList={this.props.requestList}
        filterTerms={this.props.filterTerms}
        existingRequestTypes={this.props.existingRequestTypes}
        selectedIds={this.props.selectedIds}
        approvalType={this.props.approvalType}
        browseId={this.props.browseId}
        onClickRow={this.props.browseDetail}
        onChangeRowSelection={this.props.onChangeRowSelection}
        onSwitchApprovalType={this.props.switchApprovalType}
        onUpdateFilterTerm={this.props.updateFilterTerm}
        activeDialog={this.props.activeDialog}
        onClickApproveAllButton={this.props.onClickApproveAllButton}
        listedIds={this.props.listedIds}
        maxSelection={MAX_SELECTION}
        canBulkApprove={this.props.canBulkApproveAttDailyRequest}
      />
    );
  }
}

const mapStateToProps = (state) => ({
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
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      initialize: AttDailyActions.initialize,
      switchApprovalType: AttDailyActions.switchApprovalType,
      updateFilterTerm: filterTermsUIActions.update,
      browseDetail: detailActions.browse,
      setSelectedIds: selectedIdsActions.set,
      setActiveDialog: activeDialogActions.set,
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  browseDetail: (id: string) => dispatchProps.browseDetail(id),
  onChangeRowSelection: ({ id, checked }) => {
    const { selectedIds, requestList } = stateProps;
    if (id) {
      const newSelectedIds = checked
        ? [...selectedIds, id]
        : selectedIds.filter((x) => x !== id);
      dispatchProps.setSelectedIds(newSelectedIds);
    } else {
      // SELECT/DESELECT ALL
      const numRequestsToSelect = MAX_SELECTION - selectedIds.length;
      const newSelectedIds = requestList
        .filter((x) => !selectedIds.includes(x.id))
        .map(({ id }) => id)
        .slice(0, numRequestsToSelect);
      const result = checked ? selectedIds.concat(newSelectedIds) : [];
      dispatchProps.setSelectedIds(result);
    }
  },
  onClickApproveAllButton: () => {
    dispatchProps.setActiveDialog(ACTIVE_DIALOG_TYPES.BULK_APPROVAL_CONFIRM);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ListContainer) as React.ComponentType<Record<string, any>>;
