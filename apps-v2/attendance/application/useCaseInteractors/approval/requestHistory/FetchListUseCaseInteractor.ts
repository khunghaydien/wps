import { IRequestHistoryRepository } from '@attendance/domain/models/approval/RequestHistory';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/approval/RequestHistory/IFetchListUseCase';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    RequestHistoryRepository: IRequestHistoryRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ RequestHistoryRepository }) =>
  () =>
  async (requestId) => {
    const historyList = await RequestHistoryRepository.fetchList(requestId);

    return historyList;
  };

export default interactor;
