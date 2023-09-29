import { IRestTimeReasonRepository } from '@attendance/domain/models/RestTimeReason';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/dailyRecord/IFetchRestTimeReasonsUseCase';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    RestTimeReasonRepository: IRestTimeReasonRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ RestTimeReasonRepository }) =>
  () =>
  async (params) => {
    const { employeeId, targetDate } = params || {};
    const restReasons = await RestTimeReasonRepository.fetchList({
      employeeId,
      targetDate,
    });

    const output = {
      employeeId,
      targetDate,
      restReasons,
    };

    return output;
  };
export default interactor;
