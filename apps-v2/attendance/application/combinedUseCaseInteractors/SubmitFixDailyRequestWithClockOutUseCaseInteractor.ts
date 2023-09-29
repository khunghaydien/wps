import { CLOCK_TYPE } from '@attendance/domain/models/DailyStampTime';
import { REASON } from '@attendance/domain/models/Result';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/combinedUseCases/ISubmitFixDailyRequestWithClockOutUseCase';
import { IUseCase as ISubmitFixDailyRequestUseCase } from '@attendance/domain/useCases/fixDailyRequest/ISubmitUseCase';
import { IUseCase as IPostStampTimeUseCase } from '@attendance/domain/useCases/stampTime/IPostUseCase';

export type IPresenter = Interface.IPresenter<IOutputData>;

const interactor: Interface.IUseCaseInteractor<
  {
    stampTime: IPostStampTimeUseCase;
    submitFixDailyRequest: ISubmitFixDailyRequestUseCase;
  },
  IPresenter,
  IUseCase
> =
  (UseCases) =>
  () =>
  async ({ stampTimeRecord, dailyRecords }) => {
    try {
      const result = await UseCases.stampTime({
        ...stampTimeRecord,
        clockType: CLOCK_TYPE.OUT,
      });

      if (!result.result) {
        return {
          result: false,
          reason: REASON.UNEXPECTED,
        };
      }

      const { targetDate } = result.value;
      if (targetDate) {
        const record = dailyRecords[targetDate];
        if (record) {
          const result = await UseCases.submitFixDailyRequest(record);
          if (!result.result) {
            return {
              result: false,
              reason: REASON.UNEXPECTED,
            };
          }
        }
      }

      return {
        result: true,
        value: undefined,
      };
    } catch (e) {
      return {
        result: false,
        reason: REASON.UNEXPECTED,
      };
    }
  };

export default interactor;
