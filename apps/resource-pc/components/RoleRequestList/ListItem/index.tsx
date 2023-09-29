import React from 'react';

import classNames from 'classnames';

import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';

import { RequestListItem } from '@apps/domain/models/psa/Request';
import { RoleStatus } from '@apps/domain/models/psa/RoleStatus';

import './index.scss';

type Props = RequestListItem & {
  onClickRequestListItem: (requestId?: string) => void;
};
const ROOT = 'ts-resource__list-item';

const ListItem = (props: Props) => {
  const statusClass = classNames(`${ROOT}__status-item`, {
    'is-completed': props.status === RoleStatus.Completed,
    'is-requested': props.status === RoleStatus.Requested,
    'is-soft-booked': props.status === RoleStatus.SoftBooked,
    'is-in-progress': props.status === RoleStatus.InProgress,
    'is-cancelled': props.status === RoleStatus.Cancelled,
    'is-in-planning': props.status === RoleStatus.Planning,
    'is-confirmed': props.status === RoleStatus.Confirmed,
    'is-not-found': props.status === RoleStatus.NotFound,
    'is-scheduling': props.status === RoleStatus.Scheduling,
  });

  return (
    <div
      className={`${ROOT}`}
      onClick={() => props.onClickRequestListItem(props.roleId)}
    >
      <MultiColumnsGrid sizeList={[1, 1, 1, 1, 2, 1, 2, 1, 1, 1]}>
        <span className={`${ROOT}__request-code`}>{props.requestCode}</span>

        <span className={`${ROOT}__project-code`}>{props.projectCode}</span>

        <span className={`${ROOT}__project-title`}>{props.projectTitle}</span>

        <span className={`${ROOT}__client`}>{props.clientName || '-'}</span>

        <span className={`${ROOT}__manager`}>{props.projectManager}</span>

        <div className={`${ROOT}__status`}>
          <span className={statusClass} />
          &nbsp;&nbsp;{props.status && msg()[`Psa_Lbl_Status${props.status}`]}
        </div>

        <span className={`${ROOT}__title`}>{props.roleTitle}</span>

        <span className={`${ROOT}__resource-group`}>{props.resourceGroup}</span>

        <span className={`${ROOT}__received-date`}>
          {props.receivedDate && DateUtil.format(props.receivedDate)}
        </span>

        <span className={`${ROOT}__assignment-due-date`}>
          {props.assignmentDueDate && DateUtil.format(props.assignmentDueDate)}
        </span>
      </MultiColumnsGrid>
    </div>
  );
};

export default ListItem;
