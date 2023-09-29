import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  employeeId?: string | null;
  startDate: string;
  endDate: string;
}>;

export type IOutputData = Interface.IOutputData<{
  employeeId: string;
  startDate: string;
  endDate: string;
  dailyObjectivelyEventLogs: DailyObjectivelyEventLog[] | null;
}>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
