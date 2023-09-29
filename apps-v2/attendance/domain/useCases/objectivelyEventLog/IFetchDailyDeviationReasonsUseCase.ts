import { DailyObjectivelyEventLogDeviationReasons } from '@attendance/domain/models/DailyObjectivelyEventLogDeviationReason';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  employeeId?: string | null;
  targetDate: string;
}>;

export type IOutputData = Interface.IOutputData<
  {
    employeeId?: string | null;
    targetDate: string;
  } & DailyObjectivelyEventLogDeviationReasons
>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
