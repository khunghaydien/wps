import {
  NoRecord,
  Result,
  UserInducedReason,
} from '@attendance/domain/models/Result';

import { IInputData as ISaveTimesheetInputData } from '@attendance/domain/useCases/importer/timesheet/ISaveUseCase';
import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<ISaveTimesheetInputData>;

export type IOutputData = Interface.IOutputData<
  Result<UserInducedReason | NoRecord>
>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
