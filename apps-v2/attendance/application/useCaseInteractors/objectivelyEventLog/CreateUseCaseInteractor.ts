import { IObjectivelyEventLogRepository } from '@attendance/domain/models/ObjectivelyEventLog';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/objectivelyEventLog/ICreateUseCase';

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
    return await ObjectivelyEventLogRepository.create(params);
  };

export default interactor;
