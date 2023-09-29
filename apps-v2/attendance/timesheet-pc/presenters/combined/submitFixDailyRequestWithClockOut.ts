import { Store } from 'redux';

import { IPresenter } from '@attendance/application/combinedUseCaseInteractors/SubmitFixDailyRequestWithClockOutUseCaseInteractor';

export default (_: Store): IPresenter => ({
  start: () => {},
  complete: () => {},
  error: () => {},
  finally: () => {},
});
