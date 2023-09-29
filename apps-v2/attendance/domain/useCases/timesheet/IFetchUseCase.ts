import { Timesheet as TimesheetFromRemote } from '@attendance/repositories/models/Timesheet';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  targetDate?: string | null;
  employeeId?: string | null;
} | void>;

export type IOutputData = Interface.IOutputData<{
  employeeId: string;
  // FIXME:
  // リモートのからの値ではなく変換されたエンティティを返却したいが既存の実装に合わせるためにリモートからの値を返却しています。
  // 問題が解消されたらエンティティを返すようにしてください。
  timesheet: TimesheetFromRemote;
}>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
