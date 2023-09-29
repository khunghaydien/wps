import { Store } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import { actions as monthlyActions } from '@attendance/timesheet-pc/modules/ui/legalAgreementRequest/requests/monthlyRequest';
import { actions as yearlyActions } from '@attendance/timesheet-pc/modules/ui/legalAgreementRequest/requests/yearlyRequest';

import { IPresenter } from '@apps/attendance/application/useCaseInteractors/legalAgreement/FetchOvertimeUseCaseInteractor';

export default ({ dispatch }: Store): IPresenter => ({
  start: () => {
    dispatch(loadingStart());
  },
  complete: (response) => {
    const { overTime } = response;
    dispatch(
      monthlyActions.setOvertime(
        overTime.monthlyOvertime,
        overTime.legalAgreementWorkSystem
      )
    );
    dispatch(
      yearlyActions.setOvertime(
        overTime.yearlyOvertime,
        overTime.legalAgreementWorkSystem
      )
    );
  },
  error: (err) => {
    dispatch(monthlyActions.clear());
    dispatch(yearlyActions.clear());
    dispatch(catchApiError(err as Parameters<typeof catchApiError>[0]));
  },
  finally: () => {
    dispatch(loadingEnd());
  },
});
