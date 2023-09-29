import React from 'react';

import msg from '../../../../commons/languages';
import MonthlyHeader from '../../molecules/commons/Headers/MonthlyHeader';

import { Status } from '../../../../domain/models/approval/request/Status';

import MonthlyListHeader from '../../molecules/attendance/MonthlyListHeader';
import MonthlyList from '../../organisms/attendance/MonthlyList';

import './TimesheetMonthlyPage.scss';

const ROOT = 'mobile-app-pages-attendance-timesheet-monthly-page';

type Props = {
  currentDate: string;
  yearMonthOptions: Array<{
    value: string;
    label: string;
  }>;
  disabledPrevDate?: boolean;
  disabledNextDate?: boolean;
  records: Array<{
    rowType: string;
    recordDate: string;
    startTime: number | null;
    endTime: number | null;
    contractedDetail: {
      startTime: number | null;
      endTime: number | null;
    };
    remarkableRequestStatus: {
      count: number;
      status: Status;
    } | null;
    attentionMessages: string[];
  }>;
  onClickMonthlyListItem: (arg0: string) => void;
  onChangeMonth: (arg0: string) => void;
  onClickRefresh: (arg0: React.SyntheticEvent<Element>) => void;
  onClickPrevMonth?: () => void;
  onClickNextMonth?: () => void;
};

export default class TimesheetDailyPage extends React.Component<Props> {
  render() {
    return (
      <div className={`${ROOT}`}>
        <MonthlyHeader
          className={`${ROOT}__header`}
          title={msg().Att_Lbl_TimeAttendance}
          currentYearMonth={this.props.currentDate}
          yearMonthOptions={this.props.yearMonthOptions}
          disabledPrevDate={this.props.disabledPrevDate}
          disabledNextDate={this.props.disabledNextDate}
          onChangeMonth={(event: React.SyntheticEvent<HTMLSelectElement>) => {
            this.props.onChangeMonth(event.currentTarget.value);
          }}
          onClickRefresh={this.props.onClickRefresh}
          onClickPrevMonth={this.props.onClickPrevMonth}
          onClickNextMonth={this.props.onClickNextMonth}
        >
          <MonthlyListHeader />
        </MonthlyHeader>
        <MonthlyList
          key={this.props.currentDate}
          className={`${ROOT}__container`}
          items={this.props.records}
          onClickItem={this.props.onClickMonthlyListItem}
        />
      </div>
    );
  }
}
