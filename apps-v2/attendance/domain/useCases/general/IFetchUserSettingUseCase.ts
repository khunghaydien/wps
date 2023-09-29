import { UserSetting } from '@apps/domain/models/UserSetting';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<void>;

export type IOutputData = Interface.IOutputData<UserSetting | void>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
