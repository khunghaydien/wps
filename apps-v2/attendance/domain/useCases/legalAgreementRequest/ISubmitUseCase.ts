import { Code } from '@attendance/domain/models/LegalAgreementRequestType';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  requestId: string | null;
  summaryId: string;
  requestType: Code;
  changedOvertimeHoursLimit: number;
  reason: string;
  measures: string;
}>;

export type IOutputData = Interface.IOutputData<void>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
