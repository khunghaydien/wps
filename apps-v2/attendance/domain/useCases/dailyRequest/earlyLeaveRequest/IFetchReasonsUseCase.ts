import { EarlyLeaveReason } from '@attendance/domain/models/EarlyLeaveReason';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  targetDate: string;
  employeeId?: string;
}>;

export type IOutputData = Interface.IOutputData<{
  targetDate: string;
  employeeId: string;
  reasons: EarlyLeaveReason[];
}>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
