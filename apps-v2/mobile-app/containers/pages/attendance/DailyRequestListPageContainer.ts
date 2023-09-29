import { connect } from 'react-redux';
// @ts-ignore
import { RouterHistory } from 'react-router';
import { compose } from 'redux';

import lifecycle from '../../../concerns/lifecycle';

import { AttDailyRequest } from '@attendance/domain/models/AttDailyRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

import { State } from '../../../modules';
import { State as AvailableRequests } from '../../../modules/attendance/dailyRequest/entities/availableRequests';
import { State as LatestRequests } from '../../../modules/attendance/dailyRequest/entities/latestRequests';
import { State as Timesheet } from '../../../modules/attendance/timesheet/entities';

import { AppDispatch } from '../../../action-dispatchers/AppThunk';
import * as actions from '../../../action-dispatchers/attendance/dailyRequest';

import DailyRequestListPage, {
  Props,
} from '../../../components/pages/attendance/DailyRequestListPage';

type OwnProps = {
  targetDate: string;
  timesheet: Timesheet;
  history: RouterHistory;
};

const mapStateToProps = (state: State, ownProps: OwnProps) => ({
  availableRequests: state.attendance.dailyRequest.entities
    .availableRequests as AvailableRequests,
  latestRequests: state.attendance.dailyRequest.entities
    .latestRequests as LatestRequests,
  isLocked:
    (state.attendance.timesheet.entities.isLocked as boolean) ||
    state.attendance.timesheet.entities.recordsByRecordDate[ownProps.targetDate]
      ?.isLocked,
});

const mapDispatchToProps = {};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...stateProps,
  ...dispatchProps,
  onClickRequest: (dailyRequest: AttDailyRequest) => {
    const path = dailyRequest.id ? dailyRequest.id : 'new';
    switch (dailyRequest.requestTypeCode) {
      case CODE.Absence:
        ownProps.history.replace(
          `/attendance/daily-requests/${ownProps.targetDate}/absence/${path}`
        );
        break;
      case CODE.Leave:
        ownProps.history.replace(
          `/attendance/daily-requests/${ownProps.targetDate}/leave/${path}`
        );
        break;
      case CODE.HolidayWork:
        ownProps.history.replace(
          `/attendance/daily-requests/${ownProps.targetDate}/holiday-work/${path}`
        );
        break;
      case CODE.EarlyStartWork:
        ownProps.history.replace(
          `/attendance/daily-requests/${ownProps.targetDate}/early-start-work/${path}`
        );
        break;
      case CODE.OvertimeWork:
        ownProps.history.replace(
          `/attendance/daily-requests/${ownProps.targetDate}/overtime-work/${path}`
        );
        break;
      case CODE.LateArrival:
        ownProps.history.replace(
          `/attendance/daily-requests/${ownProps.targetDate}/late-arrival/${path}`
        );
        break;
      case CODE.EarlyLeave:
        ownProps.history.replace(
          `/attendance/daily-requests/${ownProps.targetDate}/early-leave/${path}`
        );
        break;
      case CODE.Direct:
        ownProps.history.replace(
          `/attendance/daily-requests/${ownProps.targetDate}/direct/${path}`
        );
        break;
      case CODE.Pattern:
        ownProps.history.replace(
          `/attendance/daily-requests/${ownProps.targetDate}/pattern/${path}`
        );
        break;
      default:
        break;
    }
  },
});

export default compose(
  connect(
    (state: State, ownProps: OwnProps): OwnProps => ({
      ...ownProps,
      timesheet: state.attendance.timesheet.entities as Timesheet,
    })
  ),
  lifecycle({
    componentDidMount: (dispatch: AppDispatch, props: OwnProps) => {
      dispatch(actions.initialize(props.targetDate, props.timesheet));
    },
  }),
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(DailyRequestListPage);
