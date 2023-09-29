import { IDailyObjectivelyEventLogRepository } from '@attendance/domain/models/DailyObjectivelyEventLog';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/objectivelyEventLog/IFetchDailyUseCase';

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
  async (params) => {
    const { employeeId, startDate, endDate } = params || {};

    const dailyObjectivelyEventLogs =
      await DailyObjectivelyEventLogRepository.search({
        employeeId,
        startDate,
        endDate,
      });

    const output = {
      employeeId,
      startDate,
      endDate,
      dailyObjectivelyEventLogs,
    };

    return output;
  };

export default interactor;
