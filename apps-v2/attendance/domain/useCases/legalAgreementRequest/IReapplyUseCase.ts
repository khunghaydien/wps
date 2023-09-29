import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  originalRequestId: string | null;
  requestId: string | null;
  changedOvertimeHoursLimit: number;
  reason: string;
  measures: string;
}>;

export type IOutputData = Interface.IOutputData<void>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
