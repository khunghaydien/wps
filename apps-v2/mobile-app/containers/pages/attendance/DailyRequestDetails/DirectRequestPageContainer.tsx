import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { create as createDirectRequest } from '@attendance/domain/models/AttDailyRequest/DirectRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

import { State } from '../../../../modules';
import { actions } from '../../../../modules/attendance/dailyRequest/ui/detail';
import {
  actions as requestActions,
  appendId,
  RestTime,
} from '../../../../modules/attendance/dailyRequest/ui/requests/directRequest';
import * as selectors from '../../../../modules/attendance/selector';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

import Component from '../../../../components/pages/attendance/DailyRequestDetails/DirectRequestPage';

type OwnProps = Readonly<{
  id?: string;
  targetDate: string;
}>;

const DirectRequestPageContainer: React.FC<OwnProps> = (ownProps) => {
  const readOnly = useSelector(
    (state: State) => !state.attendance.dailyRequest.ui.detail.isEditing
  );
  const request = useSelector(
    (state: State) =>
      state.attendance.dailyRequest.ui.requests.directRequest.request
  );
  const validation = useSelector(
    (state: State) => state.attendance.dailyRequest.ui.validation
  );
  const timesheet = useSelector(
    (state: State) => state.attendance.timesheet.entities
  );
  const originalRequest = useSelector((state: State) =>
    ownProps.id
      ? selectors.selectLatestRequest(state.attendance, ownProps.id)
      : selectors.selectAvailableRequest(state.attendance, CODE.Direct)
  );
  const maxRestTimesCount = React.useMemo(
    () => timesheet.dailyRestCountLimit,
    [timesheet.dailyRestCountLimit]
  );

  const dispatch = useDispatch();
  const updateHandler = React.useCallback(
    (...param: Parameters<typeof requestActions.update>) => {
      dispatch(requestActions.update(...param));
    },
    [dispatch]
  );

  const onChangeStartDate = React.useCallback(() => {}, []);
  const onChangeEndDate = React.useCallback(
    (val: string) => {
      updateHandler('endDate', val);
    },
    [updateHandler]
  );
  const onChangeStartTime = React.useCallback(
    (val: number | null) => {
      updateHandler('startTime', val);
    },
    [updateHandler]
  );
  const onChangeEndTime = React.useCallback(
    (val: number | null) => {
      updateHandler('endTime', val);
    },
    [updateHandler]
  );
  const onChangeRestTime = React.useCallback(
    (index: number, value: RestTime | null) => {
      const arr = [...request.directApplyRestTimes];
      arr.splice(index, 1, value);
      updateHandler('directApplyRestTimes', arr);
    },
    [request?.directApplyRestTimes, updateHandler]
  );
  const onClickAddRestTime = React.useCallback(() => {
    const arr = [...request.directApplyRestTimes];
    arr.push(
      appendId({
        startTime: null,
        endTime: null,
        restReason: null,
      })
    );
    updateHandler('directApplyRestTimes', arr);
  }, [request?.directApplyRestTimes, updateHandler]);
  const onClickRemoveRestTime = React.useCallback(
    (index: number) => {
      const arr = [...request.directApplyRestTimes];
      arr.splice(index, 1);
      updateHandler('directApplyRestTimes', arr);
    },
    [request?.directApplyRestTimes, updateHandler]
  );
  const onChangeRemarks = React.useCallback(
    (val: string) => {
      updateHandler('remarks', val);
    },
    [updateHandler]
  );

  React.useEffect(() => {
    return () => {
      dispatch(requestActions.clear());
    };
  }, []);

  React.useEffect(() => {
    if (!originalRequest) {
      return;
    }
    const request = createDirectRequest(
      originalRequest,
      RecordsUtil.getWithinRange(ownProps.targetDate, timesheet.workingTypes),
      ownProps.targetDate
    );
    dispatch(actions.initialize(request));
    dispatch(requestActions.initialize(request, maxRestTimesCount));
  }, [ownProps.targetDate, originalRequest]);

  if (!request) {
    return null;
  }

  return (
    <Component
      key={`${request.status}`}
      readOnly={readOnly}
      request={request}
      validation={validation}
      minRestTimesCount={1}
      maxRestTimesCount={maxRestTimesCount}
      onChangeStartDate={onChangeStartDate}
      onChangeEndDate={onChangeEndDate}
      onChangeStartTime={onChangeStartTime}
      onChangeEndTime={onChangeEndTime}
      onChangeRestTime={onChangeRestTime}
      onClickAddRestTime={onClickAddRestTime}
      onClickRemoveRestTime={onClickRemoveRestTime}
      onChangeRemarks={onChangeRemarks}
    />
  );
};

export default DirectRequestPageContainer;
