import { DailyRecordDisplayFieldLayoutTable } from '@attendance/domain/models/DailyRecordDisplayFieldLayout';

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
  layoutTable: DailyRecordDisplayFieldLayoutTable;
}>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
