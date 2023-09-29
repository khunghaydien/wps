import { ILegalAgreementRequestRepository } from '@attendance/domain/models/LegalAgreementRequest';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/legalAgreementRequest/ISubmitUseCase';

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
  async (entity) => {
    const result = LegalAgreementRequestRepository.submit(entity);

    return result;
  };

export default interactor;
