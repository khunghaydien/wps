import React from 'react';

import classNames from 'classnames';

import msg from '../../../../commons/languages';

import STATUS from '../../../../domain/models/approval/request/Status';
import { AttDailyRequest } from '../../../../domain/models/attendance/AttDailyRequest';
import {
  Code as RequestTypeCode,
  DisplayOrder as DisplayOrderOfRequest,
} from '../../../../domain/models/attendance/AttDailyRequestType';
import { DailyRequestConditionsType } from '../../../models/DailyRequestConditions';

import ApprovedIcon from '../../../images/approvedIcon.svg';
import PendingIcon from '../../../images/pendingIcon.svg';
import PendingIsForReapplyIcon from '../../../images/pendingIsForReapplyIcon.svg';
import RejectIcon from '../../../images/rejectIcon.svg';
import RejectIsForReapplyIcon from '../../../images/rejectIsForReapplyIcon.svg';

import './Menu.scss';

const ROOT = 'timesheet-pc-dialogs-daily-att-request-dialog-menu';

const MAP_STATE_TO_ICON = {
  [STATUS.Approved]: <ApprovedIcon />,
  [STATUS.ApprovalIn]: <PendingIcon />,
  [STATUS.Rejected]: <RejectIcon />,
  [STATUS.Recalled]: <RejectIcon />,
  [STATUS.Canceled]: <RejectIcon />,
};

const MAP_STATE_TO_ICON_IS_FOR_REAPPLY = {
  [STATUS.Approved]: <ApprovedIcon />, // 勤務表がロックされてる場合
  [STATUS.ApprovalIn]: <PendingIsForReapplyIcon />,
  [STATUS.Rejected]: <RejectIsForReapplyIcon />,
  [STATUS.Recalled]: <RejectIsForReapplyIcon />,
  [STATUS.Canceled]: <RejectIsForReapplyIcon />,
};

type MenuItemProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: string | null;
  isSelected: boolean | null | undefined;
  status?: string | null | undefined;
  isForReapply?: boolean | null | undefined;
};

const MenuItem = (props: MenuItemProps) => {
  const RequestIcon = props.isForReapply
    ? props.status && MAP_STATE_TO_ICON_IS_FOR_REAPPLY[props.status]
    : props.status && MAP_STATE_TO_ICON[props.status];

  return (
    <li>
      <button
        className={classNames(`${ROOT}__item-button`, {
          [`${ROOT}__item-button--selected`]: props.isSelected,
        })}
        type="button"
        onClick={props.onClick}
      >
        <div className={`${ROOT}__item-button-icon`}>{RequestIcon}</div>
        <div
          className={classNames(`${ROOT}__item-button-content`, {
            [`${ROOT}__item-button-content--selected`]: props.isSelected,
          })}
        >
          {props.children}
        </div>
      </button>
    </li>
  );
};

MenuItem.defaultProps = {
  status: null,
  isSelected: false,
};

type Props = {
  requestConditions: DailyRequestConditionsType;
  onClickRequestDetailButton: (arg0: AttDailyRequest) => void;
  onClickRequestEntryButton: (arg0: string, arg1: string) => void;
  selectedRequestId: string | null;
  selectedRequestTypeCode: RequestTypeCode | null;
};

export default class Menu extends React.Component<Props> {
  static defaultProps = {
    selectedRequestId: null,
  };

  // 申請済み
  renderSubmittedRequestsBlock() {
    const { selectedRequestId, requestConditions, onClickRequestDetailButton } =
      this.props;
    const { latestRequests, isLocked } = requestConditions || {};

    if (!latestRequests || !latestRequests.length) {
      return null;
    }

    return (
      <div className={`${ROOT}__section`}>
        <div className={`${ROOT}__title`}>{msg().Att_Lbl_ApprovelIn}</div>
        <ul className={`${ROOT}__items`}>
          {latestRequests.map((request, i) => {
            const isSelected = request.id === selectedRequestId;
            return (
              <MenuItem
                key={`menu-item-for-${request.id || i}`}
                status={isLocked ? STATUS.Approved : request.status}
                onClick={() => {
                  onClickRequestDetailButton(request);
                }}
                isForReapply={request.isForReapply}
                isSelected={isSelected}
              >
                {request.requestTypeName || null}
              </MenuItem>
            );
          })}
        </ul>
      </div>
    );
  }

  // 新規申請
  renderRequestEntryBlock() {
    const {
      requestConditions,
      onClickRequestEntryButton,
      selectedRequestId,
      selectedRequestTypeCode,
    } = this.props;
    const { isAvailableToEntryNewRequest, availableRequestTypes } =
      requestConditions || {};

    if (
      !isAvailableToEntryNewRequest ||
      Object.keys(availableRequestTypes).length <= 0
    ) {
      return null;
    }

    const items = DisplayOrderOfRequest.filter(
      (orderedTypeCode) => availableRequestTypes[orderedTypeCode]
    ).map((orderedTypeCode) => {
      const requestType = availableRequestTypes[orderedTypeCode];

      const isSelected =
        !selectedRequestId && selectedRequestTypeCode === requestType.code;

      return (
        <MenuItem
          key={`menu-item-for-${requestType.code}`}
          isSelected={isSelected}
          onClick={() => {
            onClickRequestEntryButton(
              requestType.code,
              requestConditions.recordDate
            );
          }}
        >
          {requestType.name}
        </MenuItem>
      );
    });

    return (
      <div className={`${ROOT}__section`}>
        <div className={`${ROOT}__title`}>{msg().Att_Lbl_NewRequest}</div>
        <ul className={`${ROOT}__items`}>{items}</ul>
      </div>
    );
  }

  render() {
    return (
      <div className={`${ROOT}`}>
        {this.renderSubmittedRequestsBlock()}
        {this.renderRequestEntryBlock()}
      </div>
    );
  }
}
