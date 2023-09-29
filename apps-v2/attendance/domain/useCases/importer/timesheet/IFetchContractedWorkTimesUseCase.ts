import { ContractedWorkTime } from '@attendance/domain/models/importer/ContractedWorkTime';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  employeeId: string;
  startDate: string;
  endDate: string;
}>;

export type IOutputData = Interface.IOutputData<ContractedWorkTime[]>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
