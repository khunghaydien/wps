import { connect } from 'react-redux';
import { compose } from 'redux';

import guard from '../../../../../commons/concerns/guard';
import lifecycle from '../../../../concerns/lifecycle';

import { AttDailyRequest } from '../../../../../domain/models/attendance/AttDailyRequest';
import { create } from '../../../../../domain/models/attendance/AttDailyRequest/AbsenceRequest';
import { CODE } from '../../../../../domain/models/attendance/AttDailyRequestType';

import { State } from '../../../../modules';
import { actions } from '../../../../modules/attendance/dailyRequest/ui/detail';
import { actions as requestActions } from '../../../../modules/attendance/dailyRequest/ui/requests/absenceRequest';

import { AppDispatch } from '../../../../action-dispatchers/AppThunk';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/AbsenceRequestPage';

type OwnProps = Readonly<{
  id: string;
  targetDate: string;
}>;

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    ...ownProps,
    latestRequests: state.attendance.dailyRequest.entities
      .latestRequests as AttDailyRequest[],
    availableRequests: state.attendance.dailyRequest.entities
      .availableRequests as AttDailyRequest[],
    request: state.attendance.dailyRequest.ui.requests.absenceRequest.request,
    readOnly: !state.attendance.dailyRequest.ui.detail.isEditing,
    validation: state.attendance.dailyRequest.ui.validation,
  };
};

const mapDispatchToProps = {
  onChange: requestActions.update,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps
) => ({
  ...stateProps,
  onChangeEndDate: (value: string) => dispatchProps.onChange('endDate', value),
  onChangeReason: (value: string) => dispatchProps.onChange('reason', value),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  lifecycle({
    componentDidMount: (
      dispatch: AppDispatch,
      props: any // FIXME: ReturnType<typeof mergeProps> causes type error on mobile-app/concerns/lifecycle/index.js
    ) => {
      const request = props.id
        ? props.latestRequests.find((r) => r.id === props.id)
        : props.availableRequests.find(
            (r) => r.requestTypeCode === CODE.Absence
          );
      if (!request) {
        return;
      }

      const absence = create(request, props.targetDate);

      dispatch(actions.initialize(absence));
      dispatch(requestActions.initialize(absence));
    },
  }),
  guard((props: ReturnType<typeof mergeProps>) => props.request !== null)
)(
  // @ts-ignore
  Component
) as React.ComponentType;
