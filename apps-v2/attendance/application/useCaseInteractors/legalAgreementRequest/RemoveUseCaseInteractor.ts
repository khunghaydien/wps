import { ILegalAgreementRequestRepository } from '@attendance/domain/models/LegalAgreementRequest';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/legalAgreementRequest/IRemoveUseCase';

export type IPresenter = Interface.IPresenter<
  IOutputData,
  {
    confirmRemoving: () => Promise<boolean>;
  }
>;

const interactor: Interface.IUseCaseInteractor<
  {
    LegalAgreementRequestRepository: ILegalAgreementRequestRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ LegalAgreementRequestRepository }) =>
  (presenter) =>
  async (params) => {
    const answer = await presenter.confirmRemoving();
    if (answer) {
      await LegalAgreementRequestRepository.remove(params);
    }
    return answer;
  };

export default interactor;
