import React from 'react';

import {
  ReportListItem,
  status,
} from '../../../../../domain/models/exp/Report';

import { getStatusText } from '../../../../../domain/modules/exp/report';

import './StatusIcon.scss';

const ROOT = 'ts-expenses__reports-icon';

type Props = {
  item: ReportListItem;
};

export default class StatusIcon extends React.Component<Props> {
  render() {
    const { item } = this.props;
    const itemStatus = getStatusText(item.status);
    let className = 'pending';
    if (item.status === status.APPROVED) {
      className = 'approved';
    } else if (
      item.status === status.REJECTED ||
      item.status === status.DISCARDED
    ) {
      className = 'rejected';
    } else if (item.status === status.CANCELED) {
      className = 'canceled';
    } else if (item.status === status.RECALLED) {
      className = 'removed';
    } else if (
      item.status === status.APPROVED_PRE_REQUEST ||
      item.status === status.NOT_REQUESTED
    ) {
      className = 'notrequested';
    } else if (item.status === status.CLAIMED) {
      className = 'claimed';
    }
    const statusClassName = `${ROOT}__${className} ${ROOT}__label`;

    return <div className={statusClassName}>{itemStatus}</div>;
  }
}
