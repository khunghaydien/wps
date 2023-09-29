import * as React from 'react';

import AccessControl from '../../../../../commons/containers/AccessControlContainer';
import msg from '../../../../../commons/languages';
import { Button, LinkButton } from '../../../../../core';

import { ApproverEmployee } from '../../../../../domain/models/approval/ApproverEmployee';
import { DynamicTestConditions } from '@apps/domain/models/access-control/Permission';
import {
  DISABLE_ACTION,
  DisableAction,
  EDIT_ACTION,
  EditAction,
} from '@attendance/domain/models/AttDailyRequest';

import FormRow from './FormRow';
import preventDoubleFiring from '@attendance/ui/helpers/events/preventDoubleFiring';

import './FormFrame.scss';

const ROOT = 'timesheet-pc-dialogs-daily-att-request-dialog-form-frame';

type Props = {
  // State
  isLoading: boolean;
  isEditing: boolean;
  editAction: EditAction;
  disableAction: DisableAction;
  isAvailableToModify: boolean;
  children: React.ReactNode;
  approverEmployee: ApproverEmployee | null;

  // Actions
  onSubmit: Function;
  onDisable: () => void;
  onStartEditing: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCancelEditing: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickOpenApprovalHistoryDialog: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  onClickOpenApproverEmployeeSettingDialog: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
};

export default class FormFrame extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (e.currentTarget.form && e.currentTarget.form.reportValidity()) {
      this.props.onSubmit();
    }
  }

  renderApprovalHistoryButton() {
    return (
      <LinkButton
        key="to-show-approval-history"
        size="large"
        onClick={this.props.onClickOpenApprovalHistoryDialog}
      >
        {msg().Com_Btn_ApprovalHistory}
      </LinkButton>
    );
  }

  renderDisableButton() {
    const { isEditing, disableAction, isLoading } = this.props;

    if (disableAction === DISABLE_ACTION.None) {
      return null;
    }

    const label = {
      [DISABLE_ACTION.CancelRequest]: msg().Att_Btn_CancelRequest,
      [DISABLE_ACTION.CancelApproval]: msg().Att_Btn_CancelApproval,
      [DISABLE_ACTION.Remove]: msg().Att_Btn_RemoveRequest,
    }[disableAction];

    const buttonType =
      disableAction === DISABLE_ACTION.Remove ? 'danger' : 'default';

    const disabled = isEditing || isLoading;

    const permissionTestConditions = {
      [DISABLE_ACTION.CancelRequest]: {
        allowIfByEmployee: true,
        requireIfByDelegate: ['cancelAttDailyRequestByDelegate'],
      } as DynamicTestConditions,
      [DISABLE_ACTION.CancelApproval]: {
        requireIfByEmployee: ['cancelAttDailyApprovalByEmployee'],
        requireIfByDelegate: ['cancelAttDailyApprovalByDelegate'],
      } as DynamicTestConditions,
      [DISABLE_ACTION.Remove]: {
        allowIfByEmployee: true,
        requireIfByDelegate: ['submitAttDailyRequestByDelegate'],
      } as DynamicTestConditions,
    }[disableAction];

    return (
      <AccessControl
        conditions={permissionTestConditions}
        key="to-disable-request"
      >
        <Button
          color={buttonType}
          disabled={disabled}
          className={`${ROOT}__button`}
          onClick={preventDoubleFiring(this.props.onDisable)}
        >
          {label}
        </Button>
      </AccessControl>
    );
  }

  renderStartEditingButton() {
    const { editAction, onStartEditing } = this.props;

    // 実行できる編集系操作が無い場合は、非表示
    if (editAction === EDIT_ACTION.None) {
      return null;
    }

    const label = {
      [EDIT_ACTION.Modify]: msg().Att_Btn_ModifyRequest,
      [EDIT_ACTION.Reapply]: msg().Att_Btn_ChangeRequest,
    }[editAction];

    return (
      <AccessControl
        allowIfByEmployee
        requireIfByDelegate={['submitAttDailyRequestByDelegate']}
        key="to-start-editing"
      >
        <Button className={`${ROOT}__button`} onClick={onStartEditing}>
          {label}
        </Button>
      </AccessControl>
    );
  }

  renderCancelEditingButton() {
    return (
      <Button
        key="to-cancel-editing"
        className={`${ROOT}__button`}
        onClick={this.props.onCancelEditing}
      >
        {msg().Com_Btn_Cancel}
      </Button>
    );
  }

  renderModifierButtons() {
    const { isEditing, editAction, isAvailableToModify } = this.props;

    // 新規申請の場合は、非表示
    if (editAction === EDIT_ACTION.Create) {
      return null;
    }

    // 「申請履歴」ボタンは全ての状態で表示する
    const buttons = [this.renderApprovalHistoryButton()];

    // 操作・操作開始トリガー系のボタンは、勤務確定後は表示しない
    if (isAvailableToModify) {
      buttons.push(this.renderDisableButton());

      // 実行できる編集系操作があれば、表示する
      if (editAction !== EDIT_ACTION.None) {
        // 表示モード／編集モードによる出し分け
        if (isEditing) {
          buttons.push(this.renderCancelEditingButton());
        } else {
          buttons.push(this.renderStartEditingButton());
        }
      }
    }

    return buttons;
  }

  renderSubmitButton() {
    const { isLoading, isEditing, editAction } = this.props;

    // 表示モードの場合は、または実行できる編集系操作が無い場合は、非表示
    if (!isEditing || editAction === EDIT_ACTION.None) {
      return null;
    }

    const label = {
      [EDIT_ACTION.Create]: msg().Att_Btn_Request,
      [EDIT_ACTION.Modify]: msg().Att_Btn_RequestAgain,
      [EDIT_ACTION.Reapply]: msg().Att_Btn_Reapply,
    }[editAction];

    return (
      <Button
        type="button"
        color="primary"
        className={`${ROOT}__button`}
        disabled={isLoading}
        onClick={
          preventDoubleFiring(this.onSubmit) as unknown as React.ComponentProps<
            typeof Button
          >['onClick']
        }
      >
        {label}
      </Button>
    );
  }

  render() {
    return (
      <div className={ROOT}>
        <form
          className={`${ROOT}__form`}
          onSubmit={this.onSubmit}
          noValidate
          action="/#"
        >
          <div className={`${ROOT}__content`}>
            {this.props.children}
            <AccessControl
              requireIfByEmployee={['viewNextApproverByEmployee']}
              requireIfByDelegate={['viewNextApproverByDelegate']}
            >
              <FormRow
                labelText={msg().Att_Lbl_NextApproverEmployee}
                height="thin"
              >
                <div className={`${ROOT}__approver-employee`}>
                  <div className={`${ROOT}__approver-employee-name`}>
                    {(this.props.approverEmployee &&
                      this.props.approverEmployee.employeeName) ||
                      msg().Com_Lbl_Unspecified}
                  </div>
                  <div className={`${ROOT}__approver-step`}>
                    <LinkButton
                      onClick={
                        this.props.onClickOpenApproverEmployeeSettingDialog
                      }
                      size="large"
                    >
                      {msg().Att_Lbl_DisplayApprovalSteps}
                    </LinkButton>
                  </div>
                </div>
              </FormRow>
            </AccessControl>
          </div>
          <div className={`${ROOT}__operators`}>
            <div className={`${ROOT}__modify`}>
              {this.renderModifierButtons()}
            </div>

            <div className={`${ROOT}__submit`}>{this.renderSubmitButton()}</div>
          </div>
        </form>
      </div>
    );
  }
}
