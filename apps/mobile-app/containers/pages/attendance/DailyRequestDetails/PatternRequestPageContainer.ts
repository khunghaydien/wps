import { connect } from 'react-redux';
// @ts-ignore
import { RouterHistory } from 'react-router';
import { bindActionCreators, compose } from 'redux';

import guard from '../../../../../commons/concerns/guard';
import lifecycle from '../../../../concerns/lifecycle';

import msg from '../../../../../commons/languages';
import {
  catchApiError,
  catchBusinessError,
} from '../../../../modules/commons/error';
import { withLoading } from '../../../../modules/commons/loading';

import AttDailyPatternRepository from '../../../../../repositories/attendance/AttDailyPatternRepository';

import STATUS from '../../../../../domain/models/approval/request/Status';
import { create as createPatternRequest } from '../../../../../domain/models/attendance/AttDailyRequest/PatternRequest';
import { CODE } from '../../../../../domain/models/attendance/AttDailyRequestType';

import { State } from '../../../../modules';
import { actions } from '../../../../modules/attendance/dailyRequest/ui/detail';
import { actions as requestActions } from '../../../../modules/attendance/dailyRequest/ui/requests/patternRequest';
import { patternOptions } from '../../../../modules/attendance/dailyRequest/ui/requests/selector';
import * as selectors from '../../../../modules/attendance/selector';

import { AppDispatch } from '../../../../action-dispatchers/AppThunk';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/PatternRequestPage';

type OwnProps = Readonly<{
  id?: string;
  targetDate: string;
  history: RouterHistory;
}>;

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    ...ownProps,
    readOnly: !state.attendance.dailyRequest.ui.detail.isEditing,
    request: state.attendance.dailyRequest.ui.requests.patternRequest.request,
    validation: state.attendance.dailyRequest.ui.validation,
    patternOptions: patternOptions(state.attendance.dailyRequest.ui.requests),
    selectedAttPattern:
      state.attendance.dailyRequest.ui.requests.patternRequest
        .selectedAttPattern,
    originalRequest: ownProps.id
      ? selectors.selectLatestRequest(state.attendance, ownProps.id)
      : selectors.selectAvailableRequest(state.attendance, CODE.Pattern),
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
  // FIXME
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChangeStartDate: () => {},
  onChangeEndDate: (val: string) => {
    dispatchProps.updateHandler('endDate', val);
  },
  onChangePatternCode: (val: string | null) => {
    dispatchProps.updateHandler('patternCode', val);
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
      const { originalRequest, targetDate } = props;

      if (!originalRequest) {
        return;
      }

      const appService = bindActionCreators(
        {
          withLoading,
          catchBusinessError,
          catchApiError,
        },
        dispatch
      );

      const dailyRequestService = bindActionCreators(actions, dispatch);
      const requestService = bindActionCreators(requestActions, dispatch);

      if (originalRequest.status === STATUS.NotRequested) {
        appService.withLoading(async () => {
          try {
            const attPatterns = await AttDailyPatternRepository.search({
              targetDate,
            });

            if (attPatterns.length === 0) {
              appService.catchBusinessError(
                msg().Com_Lbl_Error,
                msg().Att_Err_CannotCreateIfAttPatternListLengthIsZero,
                null
              );
              props.history.replace(
                `/attendance/daily-requests/${props.targetDate}`
              );
              return;
            }

            const request = createPatternRequest(
              originalRequest,
              attPatterns,
              targetDate
            );
            dailyRequestService.initialize(request);
            requestService.initialize(request, attPatterns);
          } catch (err) {
            appService.catchApiError(err);
          }
        });
      } else {
        const request = createPatternRequest(originalRequest, null, targetDate);
        dailyRequestService.initialize(request);
        requestService.initialize(request);
      }
    },
  }),
  guard((props: ReturnType<typeof mapStateToProps>) => props.request !== null)
)(
  // @ts-ignore
  Component
) as React.ComponentType;
