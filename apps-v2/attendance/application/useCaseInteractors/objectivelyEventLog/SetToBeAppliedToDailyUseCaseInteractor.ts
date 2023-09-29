import { IDailyObjectivelyEventLogRepository } from '@attendance/domain/models/DailyObjectivelyEventLog';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/objectivelyEventLog/ISetToBeAppliedToDailyUseCase';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    DailyObjectivelyEventLogRepository: IDailyObjectivelyEventLogRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ DailyObjectivelyEventLogRepository }) =>
  () =>
  async (parameters) => {
    const result = await DailyObjectivelyEventLogRepository.setToBeApplied(
      parameters
    );

    return result;
  };

export default interactor;
