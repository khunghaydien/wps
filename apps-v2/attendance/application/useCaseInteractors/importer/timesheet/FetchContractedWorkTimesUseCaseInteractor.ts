import { IContractedWorkTimeRepository } from '@attendance/domain/models/importer/ContractedWorkTime';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/importer/timesheet/IFetchContractedWorkTimesUseCase';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    ContractedWorkTimeRepository: IContractedWorkTimeRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ ContractedWorkTimeRepository }) =>
  () =>
  async (params) =>
    ContractedWorkTimeRepository.fetch(params);

export default interactor;
