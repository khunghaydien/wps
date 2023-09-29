import { IDailyObjectivelyEventLogDeviationReasonRepository } from '@attendance/domain/models/DailyObjectivelyEventLogDeviationReason';

import {
  IOutputData,
  IUseCase,
} from '@apps/attendance/domain/useCases/objectivelyEventLog/IFetchDailyDeviationReasonsUseCase';
import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    DailyObjectivelyEventLogDeviationReasonRepository: IDailyObjectivelyEventLogDeviationReasonRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ DailyObjectivelyEventLogDeviationReasonRepository }) =>
  () =>
  async (params) => {
    const { employeeId, targetDate } = params || {};
    const result =
      await DailyObjectivelyEventLogDeviationReasonRepository.fetchList({
        employeeId,
        targetDate,
      });

    const output = {
      employeeId,
      targetDate,
      ...result,
    };

    return output;
  };
export default interactor;
