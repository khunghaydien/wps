import { ITimesheetRepository } from '@attendance/domain/models/importer/Timesheet';
import { REASON } from '@attendance/domain/models/Result';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/importer/timesheet/ISaveUseCase';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    ImporterTimesheetRepository: ITimesheetRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ ImporterTimesheetRepository: TimesheetRepository }) =>
  () =>
  async (params) => {
    if (!params.records?.length) {
      return {
        result: false,
        reason: REASON.NO_RECORD,
      };
    }

    await TimesheetRepository.save(params);

    return {
      result: true,
      value: undefined,
    };
  };

export default interactor;
