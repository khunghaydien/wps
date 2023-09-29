import { Store } from 'redux';

import { catchApiError } from '@apps/commons/actions/app';

import { isAvailableTimeTrack } from '@apps/domain/models/access-control/Permission';

import { State } from '@attendance/timesheet-pc/modules';

import { AppDispatch } from '@attendance/timesheet-pc/action-dispatchers/AppThunk';
import { loadDailyTimeTrackRecords } from '@attendance/timesheet-pc/action-dispatchers/DailyTimeTrack';
import { loadTimeTrackAlerts } from '@attendance/timesheet-pc/action-dispatchers/TimeTrackAlert';

import * as AccessControlService from '@attendance/application/AccessControlService';
import { IOutputData } from '@attendance/domain/useCases/timesheet/IFetchUseCase';

export default (store: Store) =>
  async ({ employeeId, timesheet }: IOutputData): Promise<void> => {
    const state = store.getState() as State;
    const dispatch = store.dispatch as AppDispatch;

    if (!timesheet || timesheet.isMigratedSummary) {
      return;
    }

    const userSetting = state.common.userSetting;
    const isDelegated = !!(employeeId && userSetting.employeeId !== employeeId);

    const errors = [];
    if (
      isAvailableTimeTrack(
        AccessControlService.getPermission(),
        userSetting,
        isDelegated
      )
    ) {
      const empId = employeeId || undefined;
      const responses = await Promise.allSettled([
        dispatch(loadTimeTrackAlerts(timesheet, empId)),
        dispatch(loadDailyTimeTrackRecords(timesheet, empId)),
      ]);
      responses.forEach((response) => {
        if (response.status === 'rejected') {
          errors.push(response.reason);
        }
      });
    }
    if (errors.length) {
      if (!(store.getState() as State).common.app.error) {
        dispatch(catchApiError(errors[0]));
      }
    }
  };
