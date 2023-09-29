import * as React from 'react';

import {
  SUMMARY_ITEM_NAME,
  SummaryItem,
} from '@attendance/domain/models/approval/FixMonthlyRequest';

import RecordSummaryItem from '@apps/approvals-pc/components/attendance/particles/RecordSummaryItem';

import './RecordSummaryGroup.scss';

const ROOT =
  'approvals-pc-att-monthly-process-list-pane-detail-record-summary-group';

export type Props = {
  items: SummaryItem[];
};

export default class SummaryGroup extends React.Component<Props> {
  renderItems() {
    const { items } = this.props;
    return items.map((parent) => {
      const elements = [<RecordSummaryItem key={parent.name} {...parent} />];

      switch (parent.name) {
        case SUMMARY_ITEM_NAME.GENERAL_PAID_LEAVE_DAYS:
        case SUMMARY_ITEM_NAME.UNPAID_LEAVE_DAYS:
          parent.items?.forEach((child) => {
            elements.push(
              <RecordSummaryItem key={child.name} {...child} isSubItem={true} />
            );
          });
          break;
      }
      return elements;
    });
  }

  render() {
    return <div className={ROOT}>{this.renderItems()}</div>;
  }
}
