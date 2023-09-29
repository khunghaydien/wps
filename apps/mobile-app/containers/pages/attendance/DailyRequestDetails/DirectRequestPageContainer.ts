import { connect } from 'react-redux';
import { compose } from 'redux';

import guard from '../../../../../commons/concerns/guard';
import lifecycle from '../../../../concerns/lifecycle';

import { create as createDirectRequest } from '../../../../../domain/models/attendance/AttDailyRequest/DirectRequest';
import { CODE } from '../../../../../domain/models/attendance/AttDailyRequestType';
import * as RestTime from '../../../../../domain/models/attendance/RestTime';

import { State } from '../../../../modules';
import { actions } from '../../../../modules/attendance/dailyRequest/ui/detail';
import { actions as requestActions } from '../../../../modules/attendance/dailyRequest/ui/requests/directRequest';
import * as selectors from '../../../../modules/attendance/selector';

import { AppDispatch } from '../../../../action-dispatchers/AppThunk';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/DirectRequestPage';

type OwnProps = Readonly<{
  id?: string;
  targetDate: string;
}>;

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    ...ownProps,
    readOnly: !state.attendance.dailyRequest.ui.detail.isEditing,
    request: state.attendance.dailyRequest.ui.requests.directRequest.request,
    validation: state.attendance.dailyRequest.ui.validation,
    timesheet: state.attendance.timesheet.entities,
    originalRequest: ownProps.id
      ? selectors.selectLatestRequest(state.attendance, ownProps.id)
      : selectors.selectAvailableRequest(state.attendance, CODE.Direct),
  };
};

const mapDispatchToProps = {
  updateHandler: requestActions.update,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps
) => ({
  ...stateProps,
  minRestTimesCount: 1,
  maxRestTimesCount: RestTime.MAX_STANDARD_REST_TIME_COUNT,
  // FIXME
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChangeStartDate: () => {},
  onChangeEndDate: (val: string) => {
    dispatchProps.updateHandler('endDate', val);
  },
  onChangeStartTime: (val: number | null) => {
    dispatchProps.updateHandler('startTime', val);
  },
  onChangeEndTime: (val: number | null) => {
    dispatchProps.updateHandler('endTime', val);
  },
  onChangeRestTime: (
    idx: number,
    startTime: number | null,
    endTime: number | null
  ) => {
    dispatchProps.updateHandler(
      'directApplyRestTimes',
      RestTime.update(stateProps.request.directApplyRestTimes, idx, {
        startTime,
        endTime,
      })
    );
  },
  onClickRemoveRestTime: (idx: number) => {
    dispatchProps.updateHandler(
      'directApplyRestTimes',
      RestTime.remove(stateProps.request.directApplyRestTimes, idx)
    );
  },
  onClickAddRestTime: () => {
    dispatchProps.updateHandler(
      'directApplyRestTimes',
      RestTime.push(stateProps.request.directApplyRestTimes)
    );
  },
  onChangeRemarks: (val: string) => {
    dispatchProps.updateHandler('remarks', val);
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  lifecycle({
    componentDidMount: (
      dispatch: AppDispatch,
      props: ReturnType<typeof mergeProps>
    ) => {
      const { originalRequest, timesheet, targetDate } = props;
      if (!originalRequest) {
        return;
      }
      const request = createDirectRequest(
        originalRequest,
        timesheet.workingType,
        targetDate
      );
      dispatch(actions.initialize(request));
      dispatch(requestActions.initialize(request));
    },
  }),
  guard((props: ReturnType<typeof mapStateToProps>) => props.request !== null)
)(
  // @ts-ignore
  Component
) as React.ComponentType;
