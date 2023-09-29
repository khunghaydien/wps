import * as React from 'react';

import styled from 'styled-components';

import Button from '../../../../commons/components/buttons/Button';
import DialogFrame from '../../../../commons/components/dialogs/DialogFrame';
import CommentNarrowField from '../../../../commons/components/fields/CommentNarrowField';
import msg from '../../../../commons/languages';
import { IAccessControlContainer } from '@apps/commons/components/IAccessControlContainer';
import LinkButton from '@apps/core/blocks/buttons/LinkButton';

import { ApproverEmployee } from '../../../../domain/models/approval/ApproverEmployee';
import {
  ACTIONS_FOR_FIX,
  AttFixSummaryRequest as AttFixSummaryRequestModel,
} from '@attendance/domain/models/AttFixSummaryRequest';

import './FixRequestDialog.scss';

const ROOT = 'timesheet-pc-fix-request-dialog';

const ApproverEmployeeLinkButton = styled(LinkButton)`
  margin-top: 20px;
`;

type Props = Readonly<{
  userPhotoUrl: string;
  onUpdateValue: Function;
  onSubmit: () => void;
  onCancel: () => void;
  fixSummaryRequest?: AttFixSummaryRequestModel;
  onClickOpenApproverEmployeeSettingDialog: () => void;
  approverEmployee: ApproverEmployee | null;
  AccessControlContainer: IAccessControlContainer;
}>;

export default class FixRequestDialog extends React.Component<Props> {
  static defaultProps = {
    fixSummaryRequest: null,
  };

  constructor(props: Props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    this.props.onSubmit();
  }

  render(): React.ReactElement {
    const {
      fixSummaryRequest,
      userPhotoUrl,
      onUpdateValue,
      onCancel,
      AccessControlContainer,
    } = this.props;

    if (!fixSummaryRequest) {
      return null;
    }

    let titleLabel;
    let submitLabel;

    switch (fixSummaryRequest.performableActionForFix) {
      case ACTIONS_FOR_FIX.Submit:
        titleLabel = msg().Att_Lbl_RequestForApproval;
        submitLabel = msg().Att_Btn_Submit;
        break;

      case ACTIONS_FOR_FIX.CancelRequest:
        titleLabel = msg().Att_Lbl_ReqStatRecalled;
        submitLabel = msg().Com_Btn_RequestCancel;
        break;

      case ACTIONS_FOR_FIX.CancelApproval:
        titleLabel = msg().Att_Lbl_ReqStatCanceled;
        submitLabel = msg().Com_Btn_ApprovalCancel;
        break;

      default:
    }

    return (
      <div className={`${ROOT}`}>
        <form onSubmit={this.onSubmit} action="/#">
          <DialogFrame
            className={`${ROOT}__dialog-frame`}
            title={titleLabel}
            hide={this.props.onCancel}
            footer={
              <DialogFrame.Footer>
                <Button type="default" onClick={onCancel}>
                  {msg().Com_Btn_Cancel}
                </Button>
                <Button type="primary" submit>
                  {submitLabel}
                </Button>
              </DialogFrame.Footer>
            }
          >
            <div className={`${ROOT}__inner`}>
              <CommentNarrowField
                onChange={(value: string): void =>
                  onUpdateValue('comment', value)
                }
                value={fixSummaryRequest.comment}
                maxLength={1000}
                icon={userPhotoUrl}
              />
              <AccessControlContainer
                requireIfByEmployee={['viewNextApproverByEmployee']}
                requireIfByDelegate={['viewNextApproverByDelegate']}
              >
                <div>
                  <ApproverEmployeeLinkButton
                    onClick={
                      this.props.onClickOpenApproverEmployeeSettingDialog
                    }
                  >
                    {msg().Att_Lbl_NextApproverEmployee}:{' '}
                    {(this.props.approverEmployee &&
                      this.props.approverEmployee.employeeName) ||
                      msg().Com_Lbl_Unspecified}
                  </ApproverEmployeeLinkButton>
                </div>
              </AccessControlContainer>
            </div>
          </DialogFrame>
        </form>
      </div>
    );
  }
}
