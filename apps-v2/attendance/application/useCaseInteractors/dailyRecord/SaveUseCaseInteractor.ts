import { IDailyRecordRepository } from '@attendance/domain/models/AttDailyRecord';
import { IDailyObjectivelyEventLogRepository } from '@attendance/domain/models/DailyObjectivelyEventLog';

import * as Interface from '@attendance/application/useCaseInteractors/IUseCaseInteractor';
import {
  IOutputData,
  IUseCase,
} from '@attendance/domain/useCases/dailyRecord/ISaveUseCase';

type Processes = [
  ReturnType<IDailyRecordRepository['save']>,
  ReturnType<IDailyObjectivelyEventLogRepository['saveDeviationReason']>
];

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
    DailyObjectivelyEventLogRepository: IDailyObjectivelyEventLogRepository;
  },
  IPresenter,
  IUseCase
> =
  ({ DailyRecordRepository, DailyObjectivelyEventLogRepository }) =>
  (presenter) =>
  async (entity) => {
    const { objectivelyEventLog, ...record } = entity;
    const processes: Processes = [
      Promise.resolve({
        insufficientRestTime: 0,
      }),
      Promise.resolve(),
    ];
    processes[0] = DailyRecordRepository.save(record);

    if (objectivelyEventLog) {
      processes[1] =
        DailyObjectivelyEventLogRepository.saveDeviationReason(
          objectivelyEventLog
        );
    }

    const responses = await Promise.allSettled(processes);
    const [recordSaveResult] = responses;

    const errors = (
      responses.filter((response) => response.status === 'rejected') as {
        reason: unknown;
      }[]
    )?.map((response) => response.reason);

    if (!errors || !errors.length) {
      if (
        recordSaveResult.status === 'fulfilled' &&
        recordSaveResult.value?.insufficientRestTime
      ) {
        const answer =
          await presenter.confirmToComplementInsufficientingRestTime(
            recordSaveResult.value
          );
        if (answer) {
          await DailyRecordRepository.fillRestTime({
            targetDate: entity.recordDate,
            employeeId: entity.employeeId,
          });
        }
      }
    }

    if (errors && errors.length) {
      throw errors;
    }
  };

export default interactor;
