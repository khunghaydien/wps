import * as React from 'react';

import AccessControl from '../../../../commons/containers/AccessControlContainer';
import msg from '../../../../commons/languages';
import Navigation from '../../molecules/commons/Navigation';

import { ApprovalHistory } from '../../../../domain/models/approval/request/History';
import {
  BaseAttDailyRequest,
  DISABLE_ACTION,
  DisableAction,
  EDIT_ACTION,
  EditAction,
} from '@attendance/domain/models/AttDailyRequest';

import Button from '../../atoms/Button';
import Label from '../../atoms/Label';
import TextButton from '../../atoms/TextButton';
import HistoryList from '../approval/HistoryList';

import './DailyRequestDetailLayout.scss';

const ROOT = 'mobile-app-organisms-attendance-daily-request-detail-layout';

export type Props = Readonly<{
  isLocked: boolean;
  isEditing: boolean;
  target: BaseAttDailyRequest | null;
  children: React.ReactNode;
  editAction: EditAction;
  disableAction: DisableAction;
  approvalHistories: ApprovalHistory[];
  onClickBack?: () => void;
  onClickStartEditing: () => void;
  onClickCancelEditing: () => void;
  onClickCreate: () => void;
  onClickModify: () => void;
  onClickReapply: () => void;
  onClickCancelRequest: () => void;
  onClickCancelApproval: () => void;
  onClickRemove: () => void;
}>;

export default class DailyRequestDetailLayout extends React.Component<Props> {
  getHeaderActionButton() {
    const {
      isLocked,
      isEditing,
      editAction,
      onClickStartEditing,
      onClickCancelEditing,
    } = this.props;

    if (isLocked) {
      return [];
    }

    if (editAction === EDIT_ACTION.Create) {
      return [];
    }

    if (isEditing) {
      return [
        <TextButton onClick={onClickCancelEditing}>
          {msg().Com_Btn_Cancel}
        </TextButton>,
      ];
    }

    switch (editAction) {
      case EDIT_ACTION.Modify:
      case EDIT_ACTION.Reapply:
        const label = {
          [EDIT_ACTION.Modify]: msg().Att_Btn_ModifyRequest,
          [EDIT_ACTION.Reapply]: msg().Att_Btn_ChangeRequest,
        }[editAction];
        return [
          <AccessControl
            allowIfByEmployee
            requireIfByDelegate={['submitAttDailyRequestByDelegate']}
          >
            <TextButton onClick={onClickStartEditing}>{label}</TextButton>
          </AccessControl>,
        ];
      default:
        return [];
    }
  }

  renderApplyButton() {
    const {
      isEditing,
      isLocked,
      editAction,
      disableAction,
      onClickCreate,
      onClickModify,
      onClickReapply,
      onClickCancelRequest,
      onClickCancelApproval,
      onClickRemove,
    } = this.props;

    if (isLocked) {
      return null;
    }

    if (isEditing) {
      switch (editAction) {
        case EDIT_ACTION.Create:
          return (
            <Button variant="add" priority="primary" onClick={onClickCreate}>
              {msg().Att_Btn_Request}
            </Button>
          );

        case EDIT_ACTION.Modify:
          return (
            <Button
              variant="neutral"
              priority="primary"
              onClick={onClickModify}
            >
              {msg().Att_Btn_RequestAgain}
            </Button>
          );
        case EDIT_ACTION.Reapply:
          return (
            <Button
              variant="neutral"
              priority="primary"
              onClick={onClickReapply}
            >
              {msg().Att_Btn_Reapply}
            </Button>
          );
        default:
          return null;
      }
    } else {
      switch (disableAction) {
        case DISABLE_ACTION.CancelRequest:
          return (
            <AccessControl
              conditions={{
                allowIfByEmployee: true,
                requireIfByDelegate: ['cancelAttDailyRequestByDelegate'],
              }}
            >
              <Button
                variant="alert"
                priority="secondary"
                onClick={onClickCancelRequest}
              >
                {msg().Att_Btn_CancelRequest}
              </Button>
            </AccessControl>
          );
        case DISABLE_ACTION.CancelApproval:
          return (
            <AccessControl
              conditions={{
                requireIfByEmployee: ['cancelAttDailyApprovalByEmployee'],
                requireIfByDelegate: ['cancelAttDailyApprovalByDelegate'],
              }}
            >
              <Button
                variant="alert"
                priority="secondary"
                onClick={onClickCancelApproval}
              >
                {msg().Att_Btn_CancelApproval}
              </Button>
            </AccessControl>
          );
        case DISABLE_ACTION.Remove:
          return (
            <AccessControl
              conditions={{
                allowIfByEmployee: true,
                requireIfByDelegate: ['submitAttDailyRequestByDelegate'],
              }}
            >
              <Button
                variant="alert"
                priority="primary"
                onClick={onClickRemove}
              >
                {msg().Att_Btn_RemoveRequest}
              </Button>
            </AccessControl>
          );
        default:
          return null;
      }
    }
  }

  render() {
    const { isEditing, editAction, target, approvalHistories, onClickBack } =
      this.props;
    const { requestTypeName } = target || {};

    return (
      <div className={ROOT}>
        <form action="/#">
          <Navigation
            className={`${ROOT}__navigation`}
            title={requestTypeName || ''}
            onClickBack={
              isEditing && editAction !== EDIT_ACTION.Create
                ? undefined
                : onClickBack
            }
            actions={this.getHeaderActionButton()}
          />
          <div className={`${ROOT}__container`}>
            <div className={`${ROOT}__container-inner`}>
              <div className={`${ROOT}__body`}>{this.props.children}</div>
              <div className={`${ROOT}__footer`}>
                {!isEditing && approvalHistories.length > 0 && (
                  <div className={`${ROOT}__history-list`}>
                    <Label text={msg().Com_Lbl_ApprovalHistory} />
                    <HistoryList historyList={approvalHistories} />
                  </div>
                )}
                <div className={`${ROOT}__apply-button`}>
                  {this.renderApplyButton()}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
