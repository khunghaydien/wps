import React from 'react';

import _ from 'lodash';

import RecordSummaryGroup from './RecordSummaryGroup';

import './RecordSummary.scss';

const ROOT = 'approvals-pc-att-monthly-process-list-pane-detail-record-summary';

const summaryPositionTranslations = {
  DaysSummary: 'left',
  WorkTimeSummary: 'left',
  LegalOverSummary: 'left',
  CommuteCountSummary: 'left',
  OverTimeSummary1: 'center',
  OverTimeSummary2: 'center',
  LostTimeSummary: 'center',
  LeaveSummary: 'right', // TODO: 日数管理休暇の対応で不要になるはず
  AnnualPaidLeaveSummary: 'right',
  GeneralPaidLeaveSummary: 'right',
  UnpaidLeaveSummary: 'right',
  AbsenceSummary: 'right',
  AnnualPaidLeaveLeftSummary: 'right',
};

const getSummaryPosition = (summary) => {
  return summaryPositionTranslations[summary.name] || 'left';
};

type Props = {
  summaries: Array<any>;
  closingDate: string;
};
export default class RecordSummary extends React.Component<Props> {
  renderSummaryGroups() {
    const summariesByPosition = Object.assign(
      {
        left: [],
        center: [],
        right: [],
      },
      _.groupBy(this.props.summaries, (summary) => getSummaryPosition(summary))
    );

    // Perhaps we shouldn't get property by string key
    return ['left', 'center', 'right']
      .filter((position) => summariesByPosition[position].length)
      .map((position) => (
        <div
          key={position}
          className={`${ROOT}__col ${ROOT}__col--${position}`}
        >
          {summariesByPosition[position].map((summary) => (
            <RecordSummaryGroup
              key={summary.name}
              items={summary.items}
              closingDate={this.props.closingDate}
            />
          ))}
        </div>
      ));
  }

  render() {
    return <div className={ROOT}>{this.renderSummaryGroups()}</div>;
  }
}
