import { ITimesheetRepository } from '@attendance/domain/models/importer/Timesheet';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<
  Parameters<ITimesheetRepository['check']>[0]
>;

export type IOutputData = Interface.IOutputData<
  IInputData & {
    errors: PromiseType<ReturnType<ITimesheetRepository['check']>>;
  }
>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
