import React from 'react';

import classNames from 'classnames';

import {
  BaseSummaryItem,
  SummaryItem,
} from '@attendance/domain/models/approval/FixMonthlyRequest';

import * as helper from '@attendance/ui/helpers/attendanceSummary/summaryItem';

import './RecordSummaryItem.scss';

const ROOT = 'approvals-pc-attendance-record-summary-item';

const ClosingDate: React.FC<SummaryItem | BaseSummaryItem> = (summaryItem) => {
  if ('closingDate' in summaryItem && summaryItem.closingDate) {
    const { closingDate } = summaryItem;
    return (
      <span className={`${ROOT}__as_at_closing_date`}>
        {helper.closingDate(closingDate)}
      </span>
    );
  }
  return null;
};

const RecordSummaryItem: React.FC<
  | (SummaryItem | BaseSummaryItem) & {
      isSubItem?: boolean;
    }
> = ({ isSubItem, ...summaryItem }) => {
  const { name } = summaryItem;
  return (
    <div
      className={classNames(ROOT, {
        [`${ROOT}--sub-item`]: isSubItem,
      })}
    >
      <div className={`${ROOT}__name`}>
        <span>
          {isSubItem ? name : helper.label(name)}
          <ClosingDate {...summaryItem} />
        </span>
      </div>
      <div className={`${ROOT}__value`}>
        <span>{helper.value(summaryItem)}</span>
      </div>
    </div>
  );
};

export default RecordSummaryItem;
