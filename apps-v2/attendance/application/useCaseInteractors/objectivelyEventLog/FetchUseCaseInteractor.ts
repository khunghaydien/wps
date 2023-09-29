import { IObjectivelyEventLogRepository } from '@attendance/domain/models/ObjectivelyEventLog';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/objectivelyEventLog/IFetchUseCase';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    ObjectivelyEventLogRepository: IObjectivelyEventLogRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ ObjectivelyEventLogRepository }) =>
  () =>
  async (params) => {
    const { employeeId, targetDate } = params || {};
    const objectivelyEventLogs = await ObjectivelyEventLogRepository.fetch({
      employeeId,
      targetDate,
    });

    const output = {
      employeeId,
      targetDate,
      objectivelyEventLogs,
    };

    return output;
  };

export default interactor;
