import { Result, UnexpectedReason } from '@attendance/domain/models/Result';

import { IInputData as ISubmitFixDailyRequestInputData } from '@attendance/domain/useCases/fixDailyRequest/ISubmitUseCase';
import * as Interface from '@attendance/domain/useCases/IUseCase';
import { IInputData as IPostStampTimeInputData } from '@attendance/domain/useCases/stampTime/IPostUseCase';

export type IInputData = Interface.IInputData<{
  stampTimeRecord: Omit<IPostStampTimeInputData, 'clockType'>;
  dailyRecords: { [date: string]: ISubmitFixDailyRequestInputData };
}>;

export type IOutputData = Interface.IOutputData<Result<UnexpectedReason>>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
