import { IEarlyLeaveReasonRepository } from '@attendance/domain/models/EarlyLeaveReason';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/dailyRequest/earlyLeaveRequest/IFetchReasonsUseCase';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    EarlyLeaveReasonRepository: IEarlyLeaveReasonRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ EarlyLeaveReasonRepository }) =>
  () =>
  async (params) => {
    const { employeeId, targetDate } = params || {};
    const reasons = await EarlyLeaveReasonRepository.fetchList({
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
