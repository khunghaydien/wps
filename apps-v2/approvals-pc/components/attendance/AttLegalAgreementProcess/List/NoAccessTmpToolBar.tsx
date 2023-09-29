import * as React from 'react';

import styled from 'styled-components';

import Button from '@apps/commons/components/buttons/Button';
import { IAccessControlContainer } from '@apps/commons/components/IAccessControlContainer';
import msg from '@apps/commons/languages';

import { Permission } from '@apps/domain/models/access-control/Permission';
import { ApprovalTypeValue } from '@apps/domain/models/approval/ApprovalType';

import { ACTIVE_DIALOG_TYPES } from '../../../../modules/ui/activeDialog';

import ApprovalTypeSwitch from '../../../listParts/ApprovalTypeSwitch';

import '../../../listParts/ToolBar.scss';

const ROOT = 'approvals-pc-list-parts-tool-bar';
const Div = styled.div`
  display: flex; ;
`;
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
  onClickApproveAllButton: () => void;
  requiredPermissionForBulkApprove: (keyof Permission)[];
  listedIds: Array<string>;
  ApprovalDialogContainer: React.FC<{ allIds: Array<string> }>;
  AccessControlContainer: IAccessControlContainer;
};

export default class ToolBar extends React.Component<Props> {
  renderApprovalTypeSwitch() {
    if (this.props.useApprovalTypeSwitch !== true) {
      return null;
    }

    const { AccessControlContainer } = this.props;
    return (
      <Div>
        <AccessControlContainer
          requireIfByEmployee={this.props.requiredPermissionForDelegate}
        >
          <ApprovalTypeSwitch
            approvalType={this.props.approvalType}
            onSwitch={this.props.onSwitchApprovalType}
          />
        </AccessControlContainer>
      </Div>
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
    const { selectedCount, AccessControlContainer } = this.props;
    const count = selectedCount ? ` (${selectedCount})` : '';
    return (
      <AccessControlContainer
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
      </AccessControlContainer>
    );
  }

  renderBulkApprovalDialog() {
    const { ApprovalDialogContainer } = this.props;
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
