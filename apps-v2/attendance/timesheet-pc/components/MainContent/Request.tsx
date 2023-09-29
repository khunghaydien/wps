import React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import AccessControl from '../../../../commons/containers/AccessControlContainer';
import msg from '../../../../commons/languages';

import { DynamicTestConditions } from '@apps/domain/models/access-control/Permission';
import {
  ACTIONS_FOR_FIX,
  STATUS,
} from '@attendance/domain/models/AttFixSummaryRequest';
import { AttSummary as AttSummaryModel } from '@attendance/domain/models/DeprecatedAttSummary';

import './Request.scss';

const ROOT = 'timesheet-pc-request';

type Props = {
  attSummary: AttSummaryModel | null | undefined;
  onClickRequestButton: () => void;
  onClickOpenRequestHistoryButton: () => void;
};

// FIXME: 適した名前を検討して適用する
export default class Request extends React.Component<Props> {
  renderStatusValue() {
    const { attSummary } = this.props;
    const { status } = attSummary || {};

    const label =
      {
        [STATUS.NOT_REQUESTED]: msg().Att_Lbl_ReqStatNotRequested,
        [STATUS.PENDING]: msg().Att_Lbl_ReqStatPending,
        [STATUS.APPROVED]: msg().Att_Lbl_ReqStatApproved,
        [STATUS.REJECTED]: msg().Att_Lbl_ReqStatRejected,
        [STATUS.RECALLED]: msg().Att_Lbl_ReqStatRecalled,
        [STATUS.CANCELED]: msg().Att_Lbl_ReqStatCanceled,
      }[status] || '\u00A0';

    return (
      <span className={`${ROOT}__status__value`}>
        {!status || status === STATUS.NOT_REQUESTED ? (
          label
        ) : (
          <Button
            type="text"
            onClick={this.props.onClickOpenRequestHistoryButton}
          >
            {label}
          </Button>
        )}
      </span>
    );
  }

  renderRequestButton() {
    const { attSummary } = this.props;
    const { performableActionForFix } = attSummary || {};

    if (!performableActionForFix) {
      return null;
    }

    const label = {
      [ACTIONS_FOR_FIX.Submit]: msg().Att_Btn_SubmitFixMonthlyRequest,
      [ACTIONS_FOR_FIX.CancelRequest]: msg().Com_Btn_RequestCancel,
      [ACTIONS_FOR_FIX.CancelApproval]: msg().Com_Btn_ApprovalCancel,
      [ACTIONS_FOR_FIX.None]: msg().Att_Btn_SubmitFixMonthlyRequest,
    }[performableActionForFix];

    const actionType = [ACTIONS_FOR_FIX.Submit, ACTIONS_FOR_FIX.None].some(
      (action) => action === performableActionForFix
    )
      ? 'primary'
      : 'destructive';

    // FIXME:epic/GENIE-18704の進行を妨げていたため一旦 as DynamicTestConditionsでエラーを解消している
    // asで型を強制してしまっているためあまり良い型の指定ではない。要改善。
    const permissionTestConditions = {
      [ACTIONS_FOR_FIX.Submit]: {
        allowIfByEmployee: true,
        requireIfByDelegate: ['submitAttRequestByDelegate'],
      },
      [ACTIONS_FOR_FIX.CancelRequest]: {
        allowIfByEmployee: true,
        requireIfByDelegate: ['cancelAttRequestByDelegate'],
      },
      [ACTIONS_FOR_FIX.CancelApproval]: {
        requireIfByEmployee: ['cancelAttApprovalByEmployee'],
        requireIfByDelegate: ['cancelAttApprovalByDelegate'],
      },
      [ACTIONS_FOR_FIX.None]: {
        allowIfByEmployee: true,
      },
    }[performableActionForFix] as DynamicTestConditions;

    return (
      <AccessControl conditions={permissionTestConditions}>
        <Button
          type={actionType}
          onClick={this.props.onClickRequestButton}
          disabled={performableActionForFix === ACTIONS_FOR_FIX.None}
        >
          {label}
        </Button>
      </AccessControl>
    );
  }

  render() {
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__status`}>
          <span className={`${ROOT}__status__title`}>
            {msg().Att_Lbl_Status}
          </span>

          {this.renderStatusValue()}
        </div>

        <div className={`${ROOT}__action`}>{this.renderRequestButton()}</div>
      </div>
    );
  }
}
