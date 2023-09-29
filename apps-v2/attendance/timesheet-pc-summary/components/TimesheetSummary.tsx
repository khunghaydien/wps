import React from 'react';

import { State } from '@attendance/timesheet-pc-summary/modules/entities/summary';

import TimesheetSummaryContent from './TimesheetSummaryContent';
import TimesheetSummaryFooter from './TimesheetSummaryFooter';
import TimesheetSummaryHeader from './TimesheetSummaryHeader';

const ROOT = 'timesheet-pc-summary-timesheet-summary';

export type Props = {
  summaryName: string;
  status: State['status'];
  ownerInfos: State['ownerInfos'];
  workingType: State['workingType'];
  records: State['records'];
  recordTotal: State['recordTotal'];
  summaries: State['summaries'];
  dividedSummaries: State['dividedSummaries'];
  masked: State['masked'];
  onRequestOpenAllowanceWindow: (event: React.MouseEvent) => void;
  onRequestOpenObjectivelyEventLogWindow: (event: React.MouseEvent) => void;
  onRequestOpenRestReasonWindow: (event: React.MouseEvent) => void;
};

export default class TimesheetSummary extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <TimesheetSummaryHeader
          summaryName={this.props.summaryName}
          status={this.props.status}
          ownerInfos={this.props.ownerInfos}
        />
        <TimesheetSummaryContent
          ownerInfos={this.props.ownerInfos}
          records={this.props.records}
          recordTotal={this.props.recordTotal}
          workingType={this.props.workingType}
          onRequestOpenAllowanceWindow={this.props.onRequestOpenAllowanceWindow}
          onRequestOpenObjectivelyEventLogWindow={
            this.props.onRequestOpenObjectivelyEventLogWindow
          }
          onRequestOpenRestReasonWindow={
            this.props.onRequestOpenRestReasonWindow
          }
        />
        <TimesheetSummaryFooter
          summaries={this.props.summaries}
          dividedSummaries={this.props.dividedSummaries}
          masked={this.props.masked}
        />
      </div>
    );
  }
}
