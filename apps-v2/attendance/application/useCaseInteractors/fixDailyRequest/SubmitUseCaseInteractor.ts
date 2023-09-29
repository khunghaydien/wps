import { IFixDailyRequestRepository } from '@attendance/domain/models/FixDailyRequest';
import { REASON } from '@attendance/domain/models/Result';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import canSubmitRequest from '@attendance/domain/services/FixDailyRequestService/canSubmitRequest';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/fixDailyRequest/ISubmitUseCase';

export type IPresenter = Interface.IPresenter<
  IOutputData,
  {
    confirmToSubmitWithWarning: (confirmation: string[]) => Promise<boolean>;
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
  async ({ id: recordId, dailyRequestSummary }) => {
    const resultCanSubmit = canSubmitRequest({
      dailyRequestSummary,
    });

    if (resultCanSubmit.result === false) {
      return resultCanSubmit;
    }

    const { confirmation } = await FixDailyRequestRepository.canSubmit(
      recordId
    );

    if (confirmation && confirmation.length) {
      if (!(await presenter.confirmToSubmitWithWarning(confirmation))) {
        return {
          result: false,
          reason: REASON.USER_INDUCED,
        };
      }
    }

    await FixDailyRequestRepository.submit(recordId);

    return {
      result: true,
      value: undefined,
    };
  };

export default interactor;
