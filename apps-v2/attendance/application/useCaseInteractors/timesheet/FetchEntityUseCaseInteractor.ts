/**
 * IFetchUseCase が変換されてたエンティティを返すようになったらこのファイルは削除されます。
 */
import { ITimesheetRepository } from '@attendance/domain/models/Timesheet';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/timesheet/IFetchEntityUseCase';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    TimesheetRepository: ITimesheetRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ TimesheetRepository }) =>
  () =>
  async (params) => {
    const { targetDate, employeeId } = params || {};
    const timesheet = await TimesheetRepository.fetch(targetDate, employeeId);

    if (timesheet?.isMigratedSummary) {
      return {
        employeeId,
        timesheet,
      };
    }

    const output = {
      employeeId,
      timesheet,
    };

    return output;
  };

export default interactor;
