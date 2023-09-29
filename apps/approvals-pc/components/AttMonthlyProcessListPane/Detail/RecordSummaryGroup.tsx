import * as React from 'react';

import RecordSummaryItem from './RecordSummaryItem';

import './RecordSummaryGroup.scss';

const ROOT =
  'approvals-pc-att-monthly-process-list-pane-detail-record-summary-group';

type SummaryItem = {
  name: string;
  value: number;
  daysAndHours: {
    days: number;
    hours?: number;
    unit?: string;
  };
  unit: 'days' | 'hours' | 'count' | 'daysAndHours';
  items?: SummaryItem[];
  isAsAtClosingDate?: boolean;
  hasTranslatedNameInItems?: boolean;
};

export type Props = {
  items: SummaryItem[];
  closingDate: string;
};

export default class SummaryGroup extends React.Component<Props> {
  renderItems() {
    return this.props.items.map<
      Array<React.ReactElement<typeof RecordSummaryItem>>
    >((item) => {
      const summaryItems = [
        <RecordSummaryItem
          key={item.name}
          name={item.name}
          unit={item.unit}
          value={item.value}
          daysAndHours={item.daysAndHours}
          isAsAtClosingDate={item.isAsAtClosingDate}
          closingDate={this.props.closingDate}
        />,
      ];

      (item.items || []).forEach((detail) => {
        summaryItems.push(
          <RecordSummaryItem
            key={detail.name}
            name={detail.name}
            unit={detail.unit}
            value={detail.value}
            daysAndHours={detail.daysAndHours}
            closingDate={this.props.closingDate}
            hasTranslatedName={item.hasTranslatedNameInItems}
            isSubItem
          />
        );
      });

      return summaryItems;
    });
  }

  render() {
    return <div className={ROOT}>{this.renderItems()}</div>;
  }
}
