import { Result, UserInducedReason } from '@attendance/domain/models/Result';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<string>;

export type IOutputData = Interface.IOutputData<Result<UserInducedReason>>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
