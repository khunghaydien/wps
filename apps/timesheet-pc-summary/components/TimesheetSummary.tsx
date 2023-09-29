import React from 'react';

import { AttDailyAttention } from '../../domain/models/attendance/AttDailyAttention';
import { Record } from '../models/Record';
import { SummaryBlock } from '../models/SummaryBlock';

import TimesheetSummaryContent from './TimesheetSummaryContent';
import TimesheetSummaryFooter from './TimesheetSummaryFooter';
import TimesheetSummaryHeader from './TimesheetSummaryHeader';

const ROOT = 'timesheet-pc-summary-timesheet-summary';

export type Props = {
  summaryName: string;
  status: string;
  departmentName: string;
  workingTypeName: string;
  employeeCode: string;
  employeeName: string;
  records: Record[];
  attentions: {
    [key: string]: AttDailyAttention[];
  };
  summaries: SummaryBlock[];
  closingDate: string;
  restTimeTotal: number;
  realWorkTimeTotal: number;
  overTimeTotal: number;
  nightTimeTotal: number;
  virtualWorkTimeTotal: number;
  holidayWorkTimeTotal: number;
  lostTimeTotal: number;
};

export default class TimesheetSummary extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <TimesheetSummaryHeader
          summaryName={this.props.summaryName}
          status={this.props.status}
          departmentName={this.props.departmentName}
          workingTypeName={this.props.workingTypeName}
          employeeCode={this.props.employeeCode}
          employeeName={this.props.employeeName}
        />
        <TimesheetSummaryContent
          records={this.props.records}
          restTimeTotal={this.props.restTimeTotal}
          realWorkTimeTotal={this.props.realWorkTimeTotal}
          overTimeTotal={this.props.overTimeTotal}
          nightTimeTotal={this.props.nightTimeTotal}
          virtualWorkTimeTotal={this.props.virtualWorkTimeTotal}
          holidayWorkTimeTotal={this.props.holidayWorkTimeTotal}
          lostTimeTotal={this.props.lostTimeTotal}
          attentions={this.props.attentions}
        />
        <TimesheetSummaryFooter
          summaries={this.props.summaries}
          closingDate={this.props.closingDate}
        />
      </div>
    );
  }
}
