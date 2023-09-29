import { ILateArrivalReasonRepository } from '@attendance/domain/models/LateArrivalReason';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/dailyRequest/lateArrivalRequest/IFetchReasonsUseCase';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    LateArrivalReasonRepository: ILateArrivalReasonRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ LateArrivalReasonRepository }) =>
  () =>
  async (params) => {
    const { employeeId, targetDate } = params || {};
    const reasons = await LateArrivalReasonRepository.fetchList({
      employeeId,
      targetDate,
    });

    const output = {
      employeeId,
      targetDate,
      reasons,
    };

    return output;
  };
export default interactor;
