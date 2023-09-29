import { connect } from 'react-redux';
import { compose } from 'redux';

import guard from '../../../../../commons/concerns/guard';
import lifecycle from '../../../../concerns/lifecycle';

import { create as createEarlyStartWorkRequest } from '@attendance/domain/models/AttDailyRequest/EarlyStartWorkRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

import { State } from '../../../../modules';
import { actions } from '../../../../modules/attendance/dailyRequest/ui/detail';
import { actions as requestActions } from '../../../../modules/attendance/dailyRequest/ui/requests/earlyStartWorkRequest';
import * as selectors from '../../../../modules/attendance/selector';

import { AppDispatch } from '../../../../action-dispatchers/AppThunk';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/EarlyStartWorkRequestPage';

type OwnProps = Readonly<{
  id?: string;
  targetDate: string;
}>;

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const record =
    state.attendance.timesheet.entities.recordsByRecordDate[
      ownProps.targetDate
    ];
  return {
    ...ownProps,
    readOnly: !state.attendance.dailyRequest.ui.detail.isEditing,
    record,
    request:
      state.attendance.dailyRequest.ui.requests.earlyStartWorkRequest.request,
    validation: state.attendance.dailyRequest.ui.validation,
    originalRequest: ownProps.id
      ? selectors.selectLatestRequest(state.attendance, ownProps.id)
      : selectors.selectAvailableRequest(state.attendance, CODE.EarlyStartWork),
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
  onChangeStartTime: (val: number | null) => {
    dispatchProps.updateHandler('startTime', val);
  },
  onChangeEndTime: (_: number | null, val: number | null) => {
    dispatchProps.updateHandler('endTime', val);
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
      const { originalRequest, record, targetDate } = props;
      if (!originalRequest) {
        return;
      }
      const request = createEarlyStartWorkRequest(
        originalRequest,
        record.earlyStartWorkApplyDefaultEndTime,
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
