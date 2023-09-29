import * as React from 'react';

import _ from 'lodash';

import { SummaryBlock } from '../models/SummaryBlock';

import SummaryGroup from './SummaryGroup';

import './TimesheetSummaryFooter.scss';

const ROOT = 'timesheet-pc-summary-timesheet-summary-footer';

type Props = {
  summaries: SummaryBlock[];
  closingDate: string;
};

const summaryPositionTranslations: {
  [key: string]: 'left' | 'center' | 'right';
} = {
  DaysSummary: 'left',
  WorkTimeSummary: 'left',
  LegalOverSummary: 'left',
  CommuteCountSummary: 'left',
  OverTimeSummary1: 'center',
  OverTimeSummary2: 'center',
  LostTimeSummary: 'center',
  LeaveSummary: 'right',
  AnnualPaidLeaveSummary: 'right',
  GeneralPaidLeaveSummary: 'right',
  UnpaidLeaveSummary: 'right',
  AbsenceSummary: 'right',
  AnnualPaidLeaveLeftSummary: 'right',
};

const getSummaryPosition = (summary): 'left' | 'center' | 'right' => {
  return summaryPositionTranslations[summary.name] || 'left';
};

export default class TimesheetSummaryFooter extends React.Component<Props> {
  renderSummaryGroups() {
    const summariesByPosition: {
      left: SummaryBlock[];
      center: SummaryBlock[];
      right: SummaryBlock[];
    } = Object.assign(
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
      .map<React.ReactElement<'div'>>((position): any => (
        <div
          key={position}
          className={`${ROOT}__col ${ROOT}__col--${position}`}
        >
          {summariesByPosition[position].map((summary) => (
            <SummaryGroup
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
