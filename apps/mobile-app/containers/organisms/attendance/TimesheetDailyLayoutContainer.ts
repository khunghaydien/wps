import * as React from 'react';
import { connect } from 'react-redux';
// @ts-ignore
import { RouterHistory, withRouter } from 'react-router-dom';
import { compose } from 'redux';

import msg from '../../../../commons/languages';

import { State } from '../../../modules';

import { initialize } from '../../../action-dispatchers/attendance/dailyRecord';

import Component, {
  Props,
  TABS,
} from '../../../components/organisms/attendance/DailyLayout';

type OwnProps = Readonly<{
  children: React.ReactNode;
  history: RouterHistory;
}>;

const goTimesheetDaily = (history: RouterHistory, targetDate: string): void => {
  history.replace(`/attendance/timesheet-daily/${targetDate}`);
};

const goTimesheetMonthly = (
  history: RouterHistory,
  targetDate: string
): void => {
  history.replace(`/attendance/timesheet-monthly/${targetDate}`);
};

const mapStateToProps = (state: State) => ({
  currentDate: state.attendance.timesheet.ui.daily.paging.current as string,
  prevDate: state.attendance.timesheet.ui.daily.paging.prev as string,
  nextDate: state.attendance.timesheet.ui.daily.paging.next as string,
  startDate: state.attendance.timesheet.entities.startDate as string,
});

const mapDispatchToProps = {
  onClickRefresh: initialize,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps,
  ownProps: OwnProps
): Props => ({
  children: ownProps.children,
  currentDate: stateProps.currentDate,
  startDate: stateProps.startDate,
  title: msg().Att_Lbl_WorkTimeInput,
  tab: TABS.workTimeInput,
  disabledPrevDate: !stateProps.prevDate,
  disabledNextDate: !stateProps.nextDate,
  onChangeDate: (date: string) => goTimesheetDaily(ownProps.history, date),
  onClickBackMonth: () =>
    goTimesheetMonthly(ownProps.history, stateProps.currentDate),
  onClickPrevDate: () =>
    goTimesheetDaily(ownProps.history, stateProps.prevDate),
  onClickNextDate: () =>
    goTimesheetDaily(ownProps.history, stateProps.nextDate),
  onClickTimesheetDaily: () =>
    goTimesheetDaily(ownProps.history, stateProps.currentDate),
  onClickDailyRequest: () => {
    ownProps.history.replace(
      `/attendance/daily-requests/${stateProps.currentDate}`
    );
  },
  onClickRefresh: () => dispatchProps.onClickRefresh(stateProps.currentDate),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(Component);
