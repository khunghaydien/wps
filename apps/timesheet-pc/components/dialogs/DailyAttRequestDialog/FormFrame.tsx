import * as React from 'react';

import debounce from 'lodash/debounce';

import AccessControl from '../../../../commons/containers/AccessControlContainer';
import msg from '../../../../commons/languages';
import { Button, LinkButton } from '../../../../core';

import { ApproverEmployee } from '../../../../domain/models/approval/ApproverEmployee';
import {
  DISABLE_ACTION,
  DisableAction,
  EDIT_ACTION,
  EditAction,
} from '../../../../domain/models/attendance/AttDailyRequest';
import { DynamicTestConditions } from '@apps/domain/models/access-control/Permission';

import FormRow from './FormRow';

import './FormFrame.scss';

const ROOT = 'timesheet-pc-dialogs-daily-att-request-dialog-form-frame';

/*
 * TIME_FOR_WAITING_TO_SEND_REQUEST
 *
 * ローディングレイヤーが表示されるまでメソッドの二回目の実行を止める時間です。
 * 時間は「API 通信時間 > 待機時間 > ローディングレイヤーが表示される時間」である必要があります。
 * 現在、API 通信時間は本番環境で 4000ms ~ 2000ms でした。
 * 画面の切り替えに500ms以上掛かる場合は体感的にも「遅い」はずで画面の不具合と想定します。
 * したがって、TIME_FOR_WATING_TO_SEND_REQUEST は 500ms としました。
 *
 * The time to stop the second execution of the method until the loading layer is displayed.
 * The time must be "API connection time > waiting time > loading layer display time".
 * Currently, the API connection time is 4000ms ~ 2000ms in the production environment.
 * If it takes more than 500ms to switch screens, it should be "slow" from a physical point of view and we assume that the screen is defective.
 * Therefore, I set TIME_FOR_WATING_TO_SEND_REQUEST to 500ms.
 */
const TIME_FOR_WAITING_TO_SEND_REQUEST = 500;

const preventDoubleFiring = (method: (...args) => void) =>
  debounce(method, TIME_FOR_WAITING_TO_SEND_REQUEST, {
    leading: true,
    trailing: false,
  });

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
        onClick={preventDoubleFiring(this.onSubmit)}
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
            <FormRow labelText={msg().Att_Lbl_NextApproverEmployee}>
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
