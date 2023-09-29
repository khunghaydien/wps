import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';

import * as Interface from '@attendance/domain/useCases/IUseCase';

type ObjectivelyEventLog = Pick<
  DailyObjectivelyEventLog,
  | 'id'
  | 'deviatedEnteringTimeReason'
  | 'deviatedLeavingTimeReason'
  | 'deviationReasonExtendedItemId'
>;

export type IInputData<
  TObjectivelyEventLog extends ObjectivelyEventLog = ObjectivelyEventLog
> = Interface.IInputData<TObjectivelyEventLog>;

export type IOutputData = Interface.IOutputData<void>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
