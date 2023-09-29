import { IDailyRecordRepository } from '@attendance/domain/models/AttDailyRecord';
import { IDailyStampTimeRepository } from '@attendance/domain/models/DailyStampTime';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
  REASON,
} from '@attendance/domain/useCases/stampTime/IPostUseCase';

export type IPresenter = Interface.IPresenter<
  IOutputData,
  {
    confirmToComplementInsufficientingRestTime: (arg0: {
      insufficientRestTime: number | null | undefined;
    }) => Promise<boolean>;
  }
>;

const interactor: Interface.IUseCaseInteractor<
  {
    DailyRecordRepository: IDailyRecordRepository;
    DailyStampTimeRepository: IDailyStampTimeRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ DailyRecordRepository, DailyStampTimeRepository }) =>
  (presenter) =>
  async ({ requiredLocation, ...entity }) => {
    if (requiredLocation) {
      if (
        !entity.location ||
        (!entity.location.latitude && entity.location.latitude !== 0) ||
        (!entity.location.longitude && entity.location.longitude !== 0)
      ) {
        if (!entity.comment) {
          return {
            result: false,
            reason: REASON.REQUIRED_COMMENT_WITHOUT_LOCATION,
          };
        }
      }
    }

    const result = await DailyStampTimeRepository.post(entity);

    if (result?.insufficientRestTime) {
      const answer = await presenter.confirmToComplementInsufficientingRestTime(
        {
          insufficientRestTime: result.insufficientRestTime,
        }
      );
      if (answer) {
        await DailyRecordRepository.fillRestTime({
          targetDate: result?.targetDate,
        });
      }
    }

    return {
      result: true,
      value: {
        targetDate: result?.targetDate,
      },
    };
  };

export default interactor;
