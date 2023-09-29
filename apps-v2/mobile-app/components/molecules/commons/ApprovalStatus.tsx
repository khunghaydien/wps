import React from 'react';

import classNames from 'classnames';
import { $Values } from 'utility-types';

import msg from '../../../../commons/languages';

import STATUS, {
  ApprovalStatus,
} from '../../../../domain/models/approval/request/Status';

import Icon from '../../atoms/Icon';

import './ApprovalStatus.scss';

const ROOT = 'mobile-app-molecules-approval-status';

type Props = {
  status?: $Values<ApprovalStatus>;
  className?: string;
  iconOnly?: boolean;
  size?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
  isForReapply?: boolean;
};

const getViewModel = (
  status?: $Values<ApprovalStatus>,
  isForReapply?: boolean
) => {
  return {
    [STATUS.NotRequested]: {
      type: undefined,
      status: msg().Com_Status_NotRequested,
    },
    [STATUS.Pending]: {
      type: isForReapply ? 'status_pending_reapply' : 'status_pending',
      status: msg().Com_Status_Pending,
    },
    [STATUS.Recalled]: {
      type: isForReapply ? 'status_rejected_reapply' : 'status_rejected',
      status: msg().Com_Status_Recalled,
    },
    [STATUS.Rejected]: {
      type: isForReapply ? 'status_rejected_reapply' : 'status_rejected',
      status: msg().Com_Status_Rejected,
    },
    [STATUS.Approved]: {
      type: 'status_approved',
      status: msg().Com_Status_Approved,
    },
    [STATUS.ApprovalIn]: {
      type: isForReapply ? 'status_pending_reapply' : 'status_pending',
      status: msg().Com_Status_ApprovalIn,
    },
    [STATUS.Canceled]: {
      type: isForReapply ? 'status_rejected_reapply' : 'status_rejected',
      status: msg().Com_Status_Canceled,
    },
    [STATUS.Reapplying]: {
      type: undefined,
      status: msg().Com_Status_Reapplying,
    },
    [STATUS.ApprovedPreRequest]: {
      type: undefined,
      status: msg().Exp_Status_ApprovedPreRequest,
    },
    [STATUS.Claimed]: {
      type: undefined,
      status: msg().Exp_Status_Claimed,
    },
    [STATUS.Discarded]: {
      type: undefined,
      status: msg().Exp_Status_Discarded,
    },
    '': {
      type: undefined,
      status: '',
    },
  }[status || ''];
};

export default (props: Props) => {
  const { type, status } = getViewModel(
    props.status,
    props.isForReapply || false
  );

  const className = classNames(ROOT, props.className);
  return (
    <div className={className}>
      {type ? (
        <Icon
          type={type}
          size={props.size || 'small'}
          className={`${ROOT}__status-icon`}
        />
      ) : null}
      {!props.iconOnly && (
        <span className={`${ROOT}__status--${props.size || 'small'}`}>
          {status}
        </span>
      )}
    </div>
  );
};
