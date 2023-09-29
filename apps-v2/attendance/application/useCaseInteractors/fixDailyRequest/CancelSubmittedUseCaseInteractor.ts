import { IFixDailyRequestRepository } from '@attendance/domain/models/FixDailyRequest';
import { REASON } from '@attendance/domain/models/Result';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/fixDailyRequest/ICancelSubmittedUseCase';

export type IPresenter = Interface.IPresenter<
  IOutputData,
  {
    confirm?: () => Promise<boolean>;
  }
>;

const interactor: Interface.IUseCaseInteractor<
  {
    FixDailyRequestRepository: IFixDailyRequestRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ FixDailyRequestRepository }) =>
  (presenter) =>
  async (param) => {
    if (presenter.confirm && !(await presenter.confirm())) {
      return {
        result: false,
        reason: REASON.USER_INDUCED,
      };
    }
    await FixDailyRequestRepository.cancelSubmitted(param);
    return {
      result: true,
      value: undefined,
    };
  };

export default interactor;
