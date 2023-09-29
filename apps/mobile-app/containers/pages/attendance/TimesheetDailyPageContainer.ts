import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import lifecycle from '../../../concerns/lifecycle';

import { MAX_STANDARD_REST_TIME_COUNT } from '../../../../domain/models/attendance/RestTime';
import { Timesheet } from '../../../../domain/models/attendance/Timesheet';

import { actions as UiDailyEditingActions } from '../../../modules/attendance/timesheet/ui/daily/editing';

import { AppDispatch } from '../../../action-dispatchers/AppThunk';
import * as DailyRecordActions from '../../../action-dispatchers/attendance/dailyRecord';

import TimesheetDailyPage from '../../../components/pages/attendance/TimesheetDailyPage';

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  currentDate: state.attendance.timesheet.ui.daily.paging.current,
  prevDate: state.attendance.timesheet.ui.daily.paging.prev,
  nextDate: state.attendance.timesheet.ui.daily.paging.next,
  record: state.attendance.timesheet.ui.daily.editing,
  isEditable: state.attendance.timesheet.ui.daily.editing.canEdit,
  startDate: state.attendance.timesheet.entities.startDate,
  endDate: state.attendance.timesheet.entities.endDate,
  timesheet: state.attendance.timesheet.entities,
  minRestTimesCount: 1,
  maxRestTimesCount: MAX_STANDARD_REST_TIME_COUNT,
  useManageCommuteCount:
    state.attendance.timesheet.entities.workingType.useManageCommuteCount,
});

const mapDispatchToProps = (_dispatch: AppDispatch) =>
  bindActionCreators(
    {
      onChangeStartTime: UiDailyEditingActions.updateStartTime,
      onChangeEndTime: UiDailyEditingActions.updateEndTime,
      onChangeRestTime: UiDailyEditingActions.updateRestTime,
      onClickRemoveRestTime: UiDailyEditingActions.deleteRestTime,
      onClickAddRestTime: UiDailyEditingActions.addRestTime,
      onChangeOtherRestTime: UiDailyEditingActions.updateRestHours,
      onChangeCommuteForwardCount:
        UiDailyEditingActions.updateCommuteForwardCount,
      onChangeCommuteBackwardCount:
        UiDailyEditingActions.updateCommuteBackwardCount,
      onChangeRemarks: UiDailyEditingActions.updateRemarks,
      onClickSave: DailyRecordActions.saveAttDailyRecord,
    },
    _dispatch
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onChangeRestTimeStartTime: (
    idx: number,
    startTime: number | null,
    endTime: number | null
  ) => dispatchProps.onChangeRestTime(idx, { startTime, endTime }),
  onChangeRestTimeEndTime: (
    idx: number,
    startTime: number | null,
    endTime: number | null
  ) =>
    dispatchProps.onChangeRestTime(idx, {
      startTime,
      endTime,
    }),
  onClickSave: () =>
    dispatchProps.onClickSave(
      stateProps.record,
      stateProps.timesheet.workingType.useManageCommuteCount
    ),
  onChangeCommuteCount: (
    commuteForwardCount: number | null,
    commuteBackwardCount: number | null
  ) => {
    dispatchProps.onChangeCommuteForwardCount(commuteForwardCount);
    dispatchProps.onChangeCommuteBackwardCount(commuteBackwardCount);
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  lifecycle({
    componentDidMount: (
      dispatch: AppDispatch,
      props: {
        targetDate: string;
        timesheet: Timesheet;
      }
    ) => {
      dispatch(
        DailyRecordActions.initialize(props.targetDate, props.timesheet)
      );
    },
    // FIXME
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    componentWillUnmount: () => {},
  })
)(TimesheetDailyPage);
