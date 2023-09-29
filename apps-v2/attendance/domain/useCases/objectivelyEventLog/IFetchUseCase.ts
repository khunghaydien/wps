import { ObjectivelyEventLog } from '@attendance/domain/models/ObjectivelyEventLog';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  employeeId?: string | null;
  targetDate: string;
}>;

export type IOutputData = Interface.IOutputData<{
  employeeId: string;
  targetDate: string;
  objectivelyEventLogs: ObjectivelyEventLog[];
}>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
