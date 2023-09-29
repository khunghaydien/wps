import { IDailyRecordDisplayFieldLayoutRepository } from '@attendance/domain/models/DailyRecordDisplayFieldLayout';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/timesheet/IFetchTableUseCase';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    DailyRecordDisplayFieldLayoutRepository: IDailyRecordDisplayFieldLayoutRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ DailyRecordDisplayFieldLayoutRepository }) =>
  () =>
  async (params) => {
    const { employeeId, startDate, endDate } = params || {};
    const layoutTable =
      await DailyRecordDisplayFieldLayoutRepository.fetchTable({
        employeeId,
        startDate,
        endDate,
      });

    const output = {
      employeeId,
      startDate,
      endDate,
      layoutTable,
    };

    return output;
  };

export default interactor;
