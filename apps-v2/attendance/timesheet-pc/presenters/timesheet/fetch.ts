import { Store } from 'redux';

import {
  catchApiError,
  catchBusinessError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';

import { State } from '@attendance/timesheet-pc/modules';
import { actions as selectedPeriodUiActions } from '@attendance/timesheet-pc/modules/client/selectedPeriodStartDate';
import { actions as entitiesActions } from '@attendance/timesheet-pc/modules/entities/timesheet';

import { IPresenter } from '@attendance/application/useCaseInteractors/timesheet/FetchUseCaseInteractor';

export default (store: Store): IPresenter => ({
  start: () => {
    store.dispatch(loadingStart());
  },
  complete: (result) => {
    const { timesheet, employeeId } = result;
    if (timesheet?.isMigratedSummary) {
      store.dispatch(
        catchBusinessError(
          msg().Com_Lbl_Error,
          msg().Att_Err_CanNotDisplayBeforeUsing,
          null,
          {
            isContinuable: false,
          },
          false
        )
      );
      return;
    }
    store.dispatch(entitiesActions.setTimesheetItems(timesheet, employeeId));
    store.dispatch(selectedPeriodUiActions.set(timesheet?.startDate));
  },
  error: (err) => {
    if (!(store.getState() as State).common.app.error) {
      store.dispatch(catchApiError(err as Parameters<typeof catchApiError>[0]));
    }
  },
  finally: () => {
    store.dispatch(loadingEnd());
  },
});
