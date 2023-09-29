import { IInputData as ISaveDailyRecordInputData } from '@attendance/domain/useCases/dailyRecord/ISaveUseCase';
import { IInputData as ISubmitFixRequestInputData } from '@attendance/domain/useCases/fixDailyRequest/ISubmitUseCase';
import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  dailyRecord: ISaveDailyRecordInputData;
  dailyRequestSummary: ISubmitFixRequestInputData['dailyRequestSummary'];
}>;

export type IOutputData = Interface.IOutputData<boolean>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
