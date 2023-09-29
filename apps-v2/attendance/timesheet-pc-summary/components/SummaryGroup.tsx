import * as React from 'react';

import * as AttendanceSummary from '@attendance/domain/models/AttendanceSummary';

import { State } from '@attendance/timesheet-pc-summary/modules/entities/summary';

import SummaryItemModel from './SummaryItem';

import './SummaryGroup.scss';

const ROOT = 'timesheet-pc-summary-summary-group';

export type Props = {
  items: State['summaries'][number]['items'];
  masked: State['masked'];
};

export default class SummaryGroup extends React.Component<Props> {
  renderItems() {
    const { items, masked } = this.props;
    return items.map((parent) => {
      const elements = [
        <SummaryItemModel key={parent.name} {...parent} masked={masked} />,
      ];

      switch (parent.name) {
        case AttendanceSummary.SUMMARY_ITEM_NAME.GENERAL_PAID_LEAVE_DAYS:
        case AttendanceSummary.SUMMARY_ITEM_NAME.UNPAID_LEAVE_DAYS:
          parent.items?.forEach((child) => {
            elements.push(
              <SummaryItemModel key={child.name} {...child} isSubItem={true} />
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
