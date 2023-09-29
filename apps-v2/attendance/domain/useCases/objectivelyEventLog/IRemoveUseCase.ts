import { ObjectivelyEventLogRecord } from '@attendance/domain/models/ObjectivelyEventLogRecord';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<ObjectivelyEventLogRecord['id']>;

export type IOutputData = Interface.IOutputData<void>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
