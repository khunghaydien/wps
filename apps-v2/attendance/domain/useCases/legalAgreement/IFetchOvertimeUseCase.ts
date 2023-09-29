import { LegalAgreementOvertime } from '@apps/attendance/domain/models/LegalAgreementOvertime';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  employeeId?: string | null;
  targetDate: string;
}>;

export type IOutputData = Interface.IOutputData<{
  employeeId: string;
  targetDate: string;
  overTime: LegalAgreementOvertime | null;
}>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
