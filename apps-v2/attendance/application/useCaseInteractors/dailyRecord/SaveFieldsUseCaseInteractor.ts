import { IDailyRecordRepository } from '@attendance/domain/models/AttDailyRecord';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/dailyRecord/ISaveFieldsUseCase';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    DailyRecordRepository: IDailyRecordRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ DailyRecordRepository }) =>
  () =>
  async (entity) => {
    const result = DailyRecordRepository.saveFields(entity);

    return result;
  };

export default interactor;
