import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{ requestId: string }>;

export type IOutputData = Interface.IOutputData<boolean>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
