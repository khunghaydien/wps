import {
  DailyObjectivelyEventLog,
  ObjectivelyEventLogRecord,
} from '@attendance/domain/models/DailyObjectivelyEventLog';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  id: DailyObjectivelyEventLog['id'];
  records: {
    enteringId: ObjectivelyEventLogRecord['id'];
    leavingId: ObjectivelyEventLogRecord['id'];
  }[];
}>;

export type IOutputData = Interface.IOutputData<void>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
