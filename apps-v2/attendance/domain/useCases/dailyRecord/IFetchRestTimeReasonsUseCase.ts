import { RestTimeReason } from '@attendance/domain/models/RestTimeReason';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  employeeId?: string | null;
  targetDate: string;
}>;

export type IOutputData = Interface.IOutputData<{
  employeeId: string;
  targetDate: string;
  restReasons: RestTimeReason[];
}>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
