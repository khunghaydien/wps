import { ITimesheetRepository } from '@attendance/domain/models/importer/Timesheet';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/importer/timesheet/ICheckUseCase';

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
  async (params) => ({
    ...params,
    errors: await TimesheetRepository.check(params),
  });

export default interactor;
