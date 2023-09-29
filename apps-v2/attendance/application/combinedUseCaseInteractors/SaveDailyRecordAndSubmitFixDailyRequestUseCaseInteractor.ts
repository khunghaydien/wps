import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/combinedUseCases/ISaveDailyRecordAndSubmitFixDailyRequestUseCase';
import { IUseCase as ISaveDailyRecordUseCase } from '@attendance/domain/useCases/dailyRecord/ISaveUseCase';
import { IUseCase as ISubmitFixDailyRequestUseCase } from '@attendance/domain/useCases/fixDailyRequest/ISubmitUseCase';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    saveDailyRecord: ISaveDailyRecordUseCase;
    submitFixDailyRequest: ISubmitFixDailyRequestUseCase;
  },
  IPresenter,
  IUseCase
> =
  (UseCases) =>
  () =>
  async ({ dailyRecord, dailyRequestSummary }) => {
    const resultSave = await UseCases.saveDailyRecord(dailyRecord)
      .then(() => true)
      .catch(() => false);

    let resultRequest = false;
    if (resultSave) {
      resultRequest = await UseCases.submitFixDailyRequest({
        id: dailyRecord.recordId,
        dailyRequestSummary,
      })
        .then(({ result }) => result)
        .catch(() => false);
    }

    const result = resultSave && resultRequest;

    return result;
  };

export default interactor;
