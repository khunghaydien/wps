import { Leave } from '@attendance/domain/models/Leave';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  targetDate: string;
  employeeId?: string;
  ignoredId?: string;
}>;

export type IOutputData = Interface.IOutputData<{
  targetDate: string;
  employeeId?: string;
  ignoredId?: string;
  leaves: Map<Leave['code'], Leave>;
}>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
