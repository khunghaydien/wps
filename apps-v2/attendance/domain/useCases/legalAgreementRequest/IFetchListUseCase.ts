import { LegalAgreementRequestList } from '@attendance/domain/models/LegalAgreementRequest';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  employeeId?: string | null;
  targetDate: string;
}>;

export type IOutputData = Interface.IOutputData<{
  employeeId: string;
  targetDate: string;
  requestList: LegalAgreementRequestList | null;
}>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
