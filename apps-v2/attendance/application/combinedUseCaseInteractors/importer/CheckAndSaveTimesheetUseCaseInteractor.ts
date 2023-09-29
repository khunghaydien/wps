import { REASON } from '@attendance/domain/models/Result';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/combinedUseCases/importer/ICheckAndSaveTimesheetUseCase';
import * as ICheckUseCase from '@attendance/domain/useCases/importer/timesheet/ICheckUseCase';
import { IUseCase as ISaveUseCase } from '@attendance/domain/useCases/importer/timesheet/ISaveUseCase';

export type IPresenter = Interface.IPresenter<
  IOutputData,
  {
    confirmSubmittingWithoutErrorRecords: (
      result: ICheckUseCase.IOutputData
    ) => Promise<boolean>;
  }
>;

const interactor: Interface.IUseCaseInteractor<
  {
    saveTimesheet: ISaveUseCase;
    checkTimesheet: ICheckUseCase.IUseCase;
  },
  IPresenter,
  IUseCase
> = (UseCases) => (presenter) => async (params) => {
  const checkResult = await UseCases.checkTimesheet(params);
  const answer = await presenter.confirmSubmittingWithoutErrorRecords(
    checkResult
  );

  if (!answer) {
    return {
      result: false,
      reason: REASON.USER_INDUCED,
    };
  }

  const { errors } = checkResult || {};
  const filteredErrors = new Map(
    [...(errors?.keys() ?? [])]
      .filter((key) =>
        params.records.some(({ recordDate }) => key === recordDate)
      )
      .map((key) => [key, errors.get(key)])
  );

  return UseCases.saveTimesheet({
    ...params,
    records: params.records.filter(
      ({ recordDate }) => !filteredErrors.has(recordDate)
    ),
  });
};

export default interactor;
