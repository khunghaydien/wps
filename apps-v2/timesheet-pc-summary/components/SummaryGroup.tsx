import * as React from 'react';

import { SummaryItem as SummaryItemType } from '../models/SummaryItem';

import SummaryItem from './SummaryItem';

import './SummaryGroup.scss';

const ROOT = 'timesheet-pc-summary-summary-group';

export type Props = {
  items: SummaryItemType[];
  closingDate: string;
};

export default class SummaryGroup extends React.Component<Props> {
  renderItems() {
    return this.props.items.map<Array<React.ReactElement<typeof SummaryItem>>>(
      (item) => {
        const summaryItems = [
          <SummaryItem
            key={item.name}
            name={item.name}
            unit={item.unit}
            value={item.value}
            daysAndHours={item.daysAndHours}
            closingDate={this.props.closingDate}
            isAsAtClosingDate={item.isAsAtClosingDate}
            maskValue={!item.shouldShowValue}
          />,
        ];

        (item.items || []).forEach((detail) => {
          summaryItems.push(
            <SummaryItem
              key={detail.name}
              name={detail.name}
              unit={detail.unit}
              value={detail.value}
              daysAndHours={detail.daysAndHours}
              closingDate={this.props.closingDate}
              hasTranslatedName={item.hasTranslatedNameInItems}
              maskValue={!item.shouldShowValue}
              isSubItem
            />
          );
        });

        return summaryItems;
      }
    );
  }

  render() {
    return <div className={ROOT}>{this.renderItems()}</div>;
  }
}
