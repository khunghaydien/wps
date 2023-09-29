import { ObjectivelyEventLogRecord } from '@attendance/domain/models/ObjectivelyEventLogRecord';
import { ObjectivelyEventLogSetting } from '@attendance/domain/models/ObjectivelyEventLogSetting';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  employeeId: string;
  targetDate: string;
  settingCode: ObjectivelyEventLogSetting['code'];
  eventType: ObjectivelyEventLogRecord['eventType'];
  time: ObjectivelyEventLogRecord['time'];
}>;

export type IOutputData = Interface.IOutputData<void>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
