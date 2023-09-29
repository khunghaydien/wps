import * as React from 'react';
import { connect } from 'react-redux';
// @ts-ignore
import { RouterHistory, withRouter } from 'react-router-dom';
import { compose } from 'redux';

import msg from '../../../../commons/languages';

import { State } from '../../../modules';

import { initialize } from '../../../action-dispatchers/attendance/dailyRequest';

import Component, {
  Props,
  TABS,
} from '../../../components/organisms/attendance/DailyLayout';

type OwnProps = Readonly<{
  children: React.ReactNode;
  history: RouterHistory;
}>;

const goDailyRequestList = (
  history: RouterHistory,
  targetDate: string
): void => {
  history.replace(`/attendance/daily-requests/${targetDate}`);
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
  title: msg().Att_Lbl_Request,
  tab: TABS.request,
  disabledPrevDate: !stateProps.prevDate,
  disabledNextDate: !stateProps.nextDate,
  onChangeDate: (date: string) => goDailyRequestList(ownProps.history, date),
  onClickBackMonth: () =>
    goTimesheetMonthly(ownProps.history, stateProps.currentDate),
  onClickPrevDate: () =>
    goDailyRequestList(ownProps.history, stateProps.prevDate),
  onClickNextDate: () =>
    goDailyRequestList(ownProps.history, stateProps.nextDate),
  onClickTimesheetDaily: () => {
    ownProps.history.replace(
      `/attendance/timesheet-daily/${stateProps.currentDate}`
    );
  },
  onClickDailyRequest: () => {
    goDailyRequestList(ownProps.history, stateProps.currentDate);
  },
  onClickRefresh: () => dispatchProps.onClickRefresh(stateProps.currentDate),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(Component);
