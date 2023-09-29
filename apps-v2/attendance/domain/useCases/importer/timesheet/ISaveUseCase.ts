import { Timesheet } from '@attendance/domain/models/importer/Timesheet';
import { NoRecord, Result } from '@attendance/domain/models/Result';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<Timesheet>;

export type IOutputData = Interface.IOutputData<Result<NoRecord>>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
