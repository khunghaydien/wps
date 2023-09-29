import { connect } from 'react-redux';
// @ts-ignore
import { RouterHistory } from 'react-router';
import { bindActionCreators, compose } from 'redux';

import guard from '../../../../../commons/concerns/guard';
import lifecycle from '../../../../concerns/lifecycle';

import msg from '../../../../../commons/languages';
import TextUtil from '../../../../../commons/utils/TextUtil';
import {
  catchApiError,
  catchBusinessError,
} from '../../../../modules/commons/error';
import { withLoading } from '../../../../modules/commons/loading';

import AttPatternRepository from '@attendance/repositories/AttPatternRepository';

import { DAY_TYPE } from '@attendance/domain/models/AttDailyRecord';
import { STATUS } from '@attendance/domain/models/AttDailyRequest';
import { create as createPatternRequest } from '@attendance/domain/models/AttDailyRequest/PatternRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';
import * as AttPattern from '@attendance/domain/models/AttPattern';
import { WORK_SYSTEM_TYPE } from '@attendance/domain/models/WorkingType';

import { State } from '../../../../modules';
import { actions } from '../../../../modules/attendance/dailyRequest/ui/detail';
import { actions as requestActions } from '../../../../modules/attendance/dailyRequest/ui/requests/patternRequest';
import { patternOptions } from '../../../../modules/attendance/dailyRequest/ui/requests/selector';
import * as selectors from '../../../../modules/attendance/selector';
import { State as TimesheetState } from '../../../../modules/attendance/timesheet/entities';

import { AppDispatch } from '../../../../action-dispatchers/AppThunk';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

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
    record:
      state.attendance.timesheet.entities.recordsByRecordDate[
        ownProps.targetDate
      ],
    workingType: RecordsUtil.getWithinRange(
      ownProps.targetDate,
      state.attendance.timesheet.entities
        .workingTypes as TimesheetState['workingTypes']
    ),
    validation: state.attendance.dailyRequest.ui.validation,
    patternOptions: patternOptions(state.attendance.dailyRequest.ui.requests),
    latestRequests: state.attendance.dailyRequest.entities.latestRequests,
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
  onChangeSwitchWorkDayToHoliday: (val: string | null) => {
    dispatchProps.updateHandler('requestDayType', val);
  },
  onUpdate: dispatchProps.updateHandler,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  lifecycle({
    componentDidMount: (
      dispatch: AppDispatch,
      props: ReturnType<typeof mergeProps>
    ) => {
      const {
        originalRequest,
        targetDate,
        workingType,
        record,
        latestRequests,
      } = props;

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

      if (originalRequest.status === STATUS.NOT_REQUESTED) {
        appService.withLoading(async () => {
          try {
            const attPatterns = await AttPatternRepository.fetch({
              targetDate,
            });

            if (attPatterns.requestableDayType === DAY_TYPE.Workday) {
              const workingTypeInfo = AttPattern.createRegularShift(
                msg().Att_Lbl_WorkPattern,
                workingType
              );

              attPatterns.patterns.unshift(workingTypeInfo);
            }

            if (
              attPatterns.canDirectInputTimeRequest &&
              workingType.workSystem !== WORK_SYSTEM_TYPE.JP_Discretion &&
              workingType.workSystem !== WORK_SYSTEM_TYPE.JP_Manager
            ) {
              const directInputInfo = AttPattern.createDirectInput(
                msg().Att_Lbl_DirectInput,
                null
              );
              attPatterns.patterns.push(directInputInfo);
            }

            if (
              record.dayType === DAY_TYPE.Workday &&
              attPatterns.requestableDayType === DAY_TYPE.Workday
            ) {
              appService.catchBusinessError(
                msg().Com_Lbl_Error,
                TextUtil.template(
                  msg().Att_Err_NotAvailableDayType,
                  targetDate,
                  msg().Att_Lbl_WorkDay
                ),
                null,
                { isContinuable: true }
              );
              return;
            }

            if (
              record.dayType === DAY_TYPE.Holiday &&
              attPatterns.requestableDayType === DAY_TYPE.Holiday
            ) {
              appService.catchBusinessError(
                msg().Com_Lbl_Error,
                TextUtil.template(
                  msg().Att_Err_NotAvailableDayType,
                  targetDate,
                  msg().Att_Lbl_Holiday
                ),
                null,
                { isContinuable: true }
              );
              return;
            }

            if (
              attPatterns.patterns.length === 0 &&
              attPatterns.requestableDayType === null
            ) {
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
              attPatterns.patterns,
              targetDate,
              attPatterns.requestableDayType,
              attPatterns.canDirectInputTimeRequest
            );

            if (request.requestTypeCode === CODE.Pattern) {
              if (request.requestableDayType === DAY_TYPE.Workday) {
                request.requestDayType = request.requestableDayType;
              }
              if (request.requestableDayType === DAY_TYPE.Holiday) {
                if (attPatterns.patterns.length === 0) {
                  request.requestDayType = request.requestableDayType;
                }
              }
            }

            dailyRequestService.initialize(request);
            requestService.initialize(request, attPatterns.patterns);
          } catch (err) {
            appService.catchApiError(err);
          }
        });
      } else {
        const workingTypeInfo = AttPattern.createRegularShift(
          msg().Att_Lbl_WorkPattern,
          workingType
        );

        dispatch(requestService.setWorkingType(workingTypeInfo));
        const patternRequest = latestRequests.find(
          (item) =>
            item.requestTypeCode === CODE.Pattern &&
            item.isDirectInputTimeRequest
        );
        if (patternRequest != null) {
          const directInputInfo = AttPattern.createDirectInput(
            msg().Att_Lbl_DirectInput,
            patternRequest
          );
          dispatch(requestActions.setDirectInput(directInputInfo));
        }

        const request = createPatternRequest(originalRequest, null, targetDate);
        if (request) {
          if (request.requestTypeCode === CODE.Pattern) {
            request.requestableDayType = request.requestDayType;
            request.canDirectInputTimeRequest =
              request.isDirectInputTimeRequest;
          }
        }
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
