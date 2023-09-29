import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ApprovalTypeValue } from '../../../domain/models/approval/ApprovalType';

import { actions as detailActions } from '../../modules/entities/attMonthly/detail';
import {
  actions as activeDialogActions,
  ACTIVE_DIALOG_TYPES,
} from '../../modules/ui/activeDialog';
import {
  actions as filterTermsUIActions,
  selectors as filterTermsSelector,
  State as FilterTermsType,
} from '../../modules/ui/attMonthly/list/filterTerms';
import { actions as selectedIdsActions } from '../../modules/ui/attMonthly/list/selectedIds';

import * as AttMonthlyActions from '../../action-dispatchers/AttMonthly';

import List from '../../components/AttMonthlyProcessListPane/List';

const MAX_SELECTION = 100;

type Props = {
  totalCount: number;
  requestList: Array<any>;
  filterTerms: FilterTermsType;
  existingMonths: Array<string | { text: string; value: any }>;
  selectedIds: Array<string>;
  approvalType: ApprovalTypeValue;
  browseId: string;
  initialize: () => void;
  browseDetail: (arg0: string) => void;
  updateFilterTerm: (arg0: keyof FilterTermsType, arg1: string) => void;
  switchApprovalType: (arg0: ApprovalTypeValue) => void;
  onChangeRowSelection: any;
  activeDialog: string;
  listedIds: Array<string>;
  onClickApproveAllButton: () => void;
  canBulkApproveAttRequest: boolean;
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
        existingMonths={this.props.existingMonths}
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
        canBulkApprove={this.props.canBulkApproveAttRequest}
      />
    );
  }
}

const mapStateToProps = (state) => ({
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
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      initialize: AttMonthlyActions.initialize,
      switchApprovalType: AttMonthlyActions.switchApprovalType,
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
