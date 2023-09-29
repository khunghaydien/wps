import { RequestHistory } from '@attendance/domain/models/approval/RequestHistory';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<string>;

export type IOutputData = Interface.IOutputData<RequestHistory[]>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
