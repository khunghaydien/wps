import { Store } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import { State } from '@attendance/timesheet-pc/modules';
import { actions as listActions } from '@attendance/timesheet-pc/modules/ui/legalAgreementRequest/list';
import { actions as pageActions } from '@attendance/timesheet-pc/modules/ui/legalAgreementRequest/page';

import { IPresenter } from '@attendance/application/useCaseInteractors/legalAgreementRequest/FetchListUseCaseInteractor';

export default ({ dispatch, getState }: Store) =>
  (): IPresenter => {
    let opened = false;
    return {
      start: () => {
        const state = getState() as State;
        if (state.ui.legalAgreementRequest.page.opened) {
          opened = true;
          dispatch(loadingStart());
        }
        dispatch(pageActions.startLoading());
      },
      complete: (response) => {
        dispatch(listActions.set(response.requestList));
      },
      error: (err) => {
        dispatch(listActions.clear());
        dispatch(catchApiError(err as Parameters<typeof catchApiError>[0]));
      },
      finally: () => {
        if (opened) {
          dispatch(loadingEnd());
        }
        dispatch(pageActions.finishLoading());
      },
    };
  };
