import { ILeaveRepository } from '@attendance/domain/models/Leave';

import {
  IOutputData,
  IUseCase,
} from '@apps/attendance/domain/useCases/leave/IFetchListUseCase';
import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    LeaveRepository: ILeaveRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ LeaveRepository }) =>
  () =>
  async (params) => {
    const leaves = await LeaveRepository.fetchList(params);

    const output = {
      ...params,
      leaves,
    };

    return output;
  };

export default interactor;
