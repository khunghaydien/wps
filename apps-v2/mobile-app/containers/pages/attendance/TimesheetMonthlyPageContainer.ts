import { connect } from 'react-redux';
// @ts-ignore
import { RouterHistory } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';

import map from 'lodash/map';

import lifecycle from '@mobile/concerns/lifecycle';
import onResume from '@mobile/concerns/onResume';

import msg from '@apps/commons/languages';
import { showAlert } from '@mobile/modules/commons/alert';
import { catchBusinessError } from '@mobile/modules/commons/error';

import { Timesheet } from '@attendance/domain/models/Timesheet';

import { actions as AttFixSummaryActions } from '@apps/mobile-app/modules/attendance/attendanceRequest/request';
import { State } from '@mobile/modules';

import { AppDispatch } from '@mobile/action-dispatchers/AppThunk';
import * as AttendanceRequestActions from '@mobile/action-dispatchers/attendance/attendanceRequest';
import * as MonthlyRecordsActions from '@mobile/action-dispatchers/attendance/monthlyRecords';

import TimesheetMonthlyPage from '@mobile/components/pages/attendance/TimesheetMonthlyPage';

const mapStateToProps = (state: State, ownProps) => {
  const timesheet = state.attendance.timesheet.entities;
  const { recordAllRecordDates, recordsByRecordDate } = timesheet;
  return {
    ...ownProps,
    currentDate: state.attendance.timesheet.ui.monthly.paging.current,
    prevDate: state.attendance.timesheet.ui.monthly.paging.prev,
    nextDate: state.attendance.timesheet.ui.monthly.paging.next,
    yearMonthOptions: state.attendance.timesheet.ui.monthly.paging.pages,
    timesheet: state.attendance.timesheet.entities,
    records: recordAllRecordDates.map((k) => recordsByRecordDate[k]),
    historyList: state.attendance.attendanceRequest.history,
    attendanceRequest: state.attendance.attendanceRequest.request,
    workingTypes: timesheet.workingTypes,
    // 月中勤務体系変更で日次勤務確定の使用/未使用が入り混じる
    // 列がずれないように全体的な設定を知らせている
    useFixDailyRequest: timesheet.workingTypes.some(
      (workingType) => workingType.useFixDailyRequest
    ),
    changeMonthHandler: (value: string) => {
      ownProps.history.push(`/attendance/timesheet-monthly/${value}`);
    },
    changeDateHandler: (value: string) => {
      ownProps.history.push(`/attendance/timesheet-daily/${value}`);
    },
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators(
    {
      onClickRefresh: (currentDate: string) => (thunkDispatch: AppDispatch) =>
        thunkDispatch(MonthlyRecordsActions.initialize(currentDate)),
      onChangeAttendanceRequestComment: AttFixSummaryActions.setComment,
      onClickSendAttendanceRequest: AttendanceRequestActions.interact,
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  disabledPrevDate: !stateProps.prevDate,
  disabledNextDate: !stateProps.nextDate,
  onChangeMonth: stateProps.changeMonthHandler,
  onClickRefresh: () => dispatchProps.onClickRefresh(stateProps.currentDate),
  onClickSendAttendanceRequest: () =>
    dispatchProps.onClickSendAttendanceRequest({
      targetDate: stateProps.currentDate,
      request: stateProps.attendanceRequest,
      records: map(stateProps.timesheet.recordsByRecordDate),
    }),
  onClickPrevMonth: () => stateProps.changeMonthHandler(stateProps.prevDate),
  onClickNextMonth: () => stateProps.changeMonthHandler(stateProps.nextDate),
  onClickMonthlyListItem: stateProps.changeDateHandler,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  onResume((dispatch: AppDispatch, props: { targetDate: string }) =>
    dispatch(MonthlyRecordsActions.initialize(props.targetDate))
  ),
  lifecycle({
    componentDidMount: (
      dispatch: AppDispatch,
      props: {
        targetDate: string;
        timesheet: Timesheet;
        history: RouterHistory;
      }
    ) => {
      dispatch(
        MonthlyRecordsActions.initialize(props.targetDate, props.timesheet)
      )
        // @ts-ignore
        .then(async (timesheet: Timesheet | null) => {
          if (timesheet && timesheet.isMigratedSummary) {
            if (props.targetDate) {
              const $targetDate =
                props.timesheet.startDate !== timesheet.startDate
                  ? props.timesheet.startDate
                  : '';
              await dispatch(showAlert(msg().Att_Err_CanNotDisplayBeforeUsing));
              props.history.replace(
                `/attendance/timesheet-monthly/${$targetDate}`
              );
            } else {
              dispatch(
                catchBusinessError(
                  msg().Com_Lbl_Error,
                  msg().Att_Err_CanNotDisplayBeforeUsing,
                  null,
                  { isContinuable: false }
                )
              );
            }
          }
        });
    },
    // FIXME
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    componentWillUnmount: () => {},
  })
)(TimesheetMonthlyPage);
