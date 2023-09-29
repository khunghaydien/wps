import * as React from 'react';

import Button from '../../../commons/components/buttons/Button';
import AccessControl from '../../../commons/containers/AccessControlContainer';
import msg from '../../../commons/languages';

import { Permission } from '../../../domain/models/access-control/Permission';
import { ApprovalTypeValue } from '../../../domain/models/approval/ApprovalType';

import { ACTIVE_DIALOG_TYPES } from '../../modules/ui/activeDialog';

import ApprovalDialogContainer from '../../containers/BulkApproval/ApprovalDialogContainer';

import ApprovalTypeSwitch from './ApprovalTypeSwitch';

import './ToolBar.scss';

const ROOT = 'approvals-pc-list-parts-tool-bar';

type ApprovalTypeSwitchProps =
  | {
      useApprovalTypeSwitch: true;
      requiredPermissionForDelegate: (keyof Permission)[];
      approvalType: ApprovalTypeValue;
      onSwitchApprovalType: (arg0: ApprovalTypeValue) => void;
    }
  | {
      useApprovalTypeSwitch: false;
    };

type Props = ApprovalTypeSwitchProps & {
  totalCount: number;
  isFilterUsing: boolean;
  filterMatchedCount: number;
  selectedCount: number;
  activeDialog: string;
  requiredPermissionForBulkApprove: (keyof Permission)[];
  onClickApproveAllButton: () => void;
  listedIds: Array<string>;
};

export default class ToolBar extends React.Component<Props> {
  renderApprovalTypeSwitch() {
    if (this.props.useApprovalTypeSwitch !== true) {
      return null;
    }

    return (
      <AccessControl
        requireIfByEmployee={this.props.requiredPermissionForDelegate}
      >
        <ApprovalTypeSwitch
          approvalType={this.props.approvalType}
          onSwitch={this.props.onSwitchApprovalType}
        />
      </AccessControl>
    );
  }

  renderCount() {
    const filterMatchedCountStr = this.props.isFilterUsing
      ? `${this.props.filterMatchedCount} ${msg().Appr_Lbl_RecordCount} / `
      : null;

    return (
      <span className={`${ROOT}__count`}>
        {filterMatchedCountStr}
        {`${this.props.totalCount} ${msg().Appr_Lbl_RecordCount}`}
      </span>
    );
  }

  renderApproveAllButton() {
    const { selectedCount } = this.props;
    const count = selectedCount ? ` (${selectedCount})` : '';
    return (
      <AccessControl
        requireIfByDelegate={this.props.requiredPermissionForBulkApprove}
        requireIfByEmployee={this.props.requiredPermissionForBulkApprove}
      >
        <Button
          onClick={this.props.onClickApproveAllButton}
          className={`${ROOT}-bulk-approval-button`}
          disabled={!selectedCount}
          type="primary"
        >
          {`${msg().Appr_Btn_ApprovalAll}${count}`}
        </Button>
      </AccessControl>
    );
  }

  renderBulkApprovalDialog() {
    return (
      this.props.activeDialog === ACTIVE_DIALOG_TYPES.BULK_APPROVAL_CONFIRM && (
        <ApprovalDialogContainer allIds={this.props.listedIds} />
      )
    );
  }

  render() {
    return (
      <div className={ROOT}>
        {this.renderApprovalTypeSwitch()}
        {this.renderCount()}
        {this.renderApproveAllButton()}
        {this.renderBulkApprovalDialog()}
      </div>
    );
  }
}
