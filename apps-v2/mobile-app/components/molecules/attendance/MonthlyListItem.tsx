import * as React from 'react';

import classNames from 'classnames';

import DateUtil from '../../../../commons/utils/DateUtil';
import AlertIcon from '../commons/AlertIcon';
import ApprovalStatus from '../commons/ApprovalStatus';

import { Status } from '../../../../domain/models/approval/request/Status';

import { ROW_TYPE } from '../../../modules/attendance/timesheet/entities';

import LinkListItem from '../../atoms/LinkListItem';

import './MonthlyListItem.scss';

const ROOT = 'mobile-app-molecules-attendance-monthly-list-item';

type Props = Readonly<{
  className?: string;
  onClick?: (arg0: React.SyntheticEvent<Element>) => void;
  rowType: string;
  date: string;
  startTime?: string;
  endTime?: string;
  workingTypeStartTime?: string;
  workingTypeEndTime?: string;
  requestStatus: Status | null;
  attentionMessages: string[];
}>;

export default function MonthlyListItem(props: Props) {
  const className = classNames(ROOT, props.className, {
    [`${ROOT}--workday`]: props.rowType === ROW_TYPE.WORKDAY,
    [`${ROOT}--holiday`]: props.rowType === ROW_TYPE.HOLIDAY,
    [`${ROOT}--legal-holiday`]: props.rowType === ROW_TYPE.LEGAL_HOLIDAY,
    [`${ROOT}--all-day-paid-leave`]:
      props.rowType === ROW_TYPE.ALL_DAY_PAID_LEAVE,
    [`${ROOT}--all-day-unpaid-leave`]:
      props.rowType === ROW_TYPE.ALL_DAY_UNPAID_LEAVE,
    [`${ROOT}--am-paid-leave`]: props.rowType === ROW_TYPE.AM_PAID_LEAVE,
    [`${ROOT}--am-unpaid-leave`]: props.rowType === ROW_TYPE.AM_UNPAID_LEAVE,
    [`${ROOT}--pm-paid-leave`]: props.rowType === ROW_TYPE.PM_PAID_LEAVE,
    [`${ROOT}--pm-unpaid-leave`]: props.rowType === ROW_TYPE.PM_UNPAID_LEAVE,
    [`${ROOT}--am-paid-leave-pm-unpaid-leave`]:
      props.rowType === ROW_TYPE.AM_PAID_LEAVE_PM_UNPAID_LEAVE,
    [`${ROOT}--am-unpaid-leave-pm-paid-leave`]:
      props.rowType === ROW_TYPE.AM_UNPAID_LEAVE_PM_PAID_LEAVE,
  });

  return (
    <div className={className}>
      <LinkListItem
        className={`${ROOT}__link-list-item`}
        onClick={props.onClick}
      >
        <div className={`${ROOT}__status`}>
          <div className={`${ROOT}__status-top`}>
            <ApprovalStatus
              size="medium"
              status={props.requestStatus || undefined}
              className={`${ROOT}__request-approval-status`}
              iconOnly
            />
            {props.attentionMessages.length >= 1 && (
              <AlertIcon variant="attention" />
            )}
          </div>
        </div>
        <div className={`${ROOT}__date`}>
          <div className={`${ROOT}__month-day`}>
            {DateUtil.formatMD(props.date)}
          </div>
          <div className={`${ROOT}__weekday`}>
            {DateUtil.formatW(props.date)}
          </div>
        </div>
        <div
          className={classNames(`${ROOT}__startTime`, {
            [`${ROOT}__startTime--placeholder`]: !props.startTime,
          })}
        >
          {props.startTime ||
            (props.workingTypeStartTime && `(${props.workingTypeStartTime})`) ||
            '-'}
        </div>
        <div
          className={classNames(`${ROOT}__endTime`, {
            [`${ROOT}__endTime--placeholder`]: !props.endTime,
          })}
        >
          {props.endTime ||
            (props.workingTypeEndTime && `(${props.workingTypeEndTime})`) ||
            '-'}
        </div>
      </LinkListItem>
    </div>
  );
}
