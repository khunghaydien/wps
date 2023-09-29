import { ILegalAgreementOvertimeRepository } from '@attendance/domain/models/LegalAgreementOvertime';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/legalAgreement/IFetchOvertimeUseCase';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    LegalAgreementOvertimeRepository: ILegalAgreementOvertimeRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ LegalAgreementOvertimeRepository }) =>
  () =>
  async (params) => {
    const { employeeId, targetDate } = params || {};
    const overTime = await LegalAgreementOvertimeRepository.fetch({
      employeeId,
      targetDate,
    });

    const output = {
      employeeId,
      targetDate,
      overTime,
    };

    return output;
  };

export default interactor;
