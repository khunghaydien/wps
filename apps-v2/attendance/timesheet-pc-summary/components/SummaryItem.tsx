import React from 'react';

import classNames from 'classnames';

import * as AttendanceSummary from '@attendance/domain/models/AttendanceSummary';

import { State } from '@attendance/timesheet-pc-summary/modules/entities/summary';

import * as helper from '@attendance/ui/helpers/attendanceSummary/summaryItem';

import './SummaryItem.scss';

type TSummaryItem =
  | State['summaries'][number]['items'][number]
  | AttendanceSummary.BaseSummaryItem;

const ROOT = 'timesheet-pc-summary-summary-item';

const UNCONFIRMED_VALUE_MASK = '* *';

const ClosingDate: React.FC<TSummaryItem> = (summaryItem) => {
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

const Value: React.FC<
  TSummaryItem & {
    masked: State['masked'];
  }
> = ({ masked, ...summaryItem }) => {
  if (!masked) {
    return <>{helper.value(summaryItem)}</>;
  }
  switch (summaryItem.name) {
    case AttendanceSummary.SUMMARY_ITEM_NAME.WORK_ABSENCE_DAYS:
      return <>{UNCONFIRMED_VALUE_MASK}</>;
    default:
      return <>{helper.value(summaryItem)}</>;
  }
};

const SummaryItem: React.FC<
  TSummaryItem & {
    isSubItem?: boolean;
    masked?: boolean;
  }
> = ({ isSubItem, masked, ...summaryItem }) => {
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
          <ClosingDate key="closing-date" {...summaryItem} />
        </span>
      </div>
      <div className={`${ROOT}__value`}>
        <span>
          <Value {...summaryItem} masked={masked} />
        </span>
      </div>
    </div>
  );
};

SummaryItem.defaultProps = {
  isSubItem: false,
  masked: false,
};

export default SummaryItem;
