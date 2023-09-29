import { ILegalAgreementRequestRepository } from '@attendance/domain/models/LegalAgreementRequest';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/legalAgreementRequest/IFetchListUseCase';

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
    const { employeeId, targetDate } = params || {};
    const requestList = await LegalAgreementRequestRepository.fetchList({
      employeeId,
      targetDate,
    });

    const output = {
      employeeId,
      targetDate,
      requestList,
    };

    return output;
  };

export default interactor;
