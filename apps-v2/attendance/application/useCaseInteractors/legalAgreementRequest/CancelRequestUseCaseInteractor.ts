import { ILegalAgreementRequestRepository } from '@attendance/domain/models/LegalAgreementRequest';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/legalAgreementRequest/ICancelRequestUseCase';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    LegalAgreementRequestRepository: ILegalAgreementRequestRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ LegalAgreementRequestRepository }) =>
  () =>
  async (params) => {
    return await LegalAgreementRequestRepository.cancelRequest(params);
  };

export default interactor;
