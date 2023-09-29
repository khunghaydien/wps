import { LateArrivalReason } from '@attendance/domain/models/LateArrivalReason';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  targetDate: string;
  employeeId?: string;
}>;

export type IOutputData = Interface.IOutputData<{
  targetDate: string;
  employeeId: string;
  reasons: LateArrivalReason[];
}>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
