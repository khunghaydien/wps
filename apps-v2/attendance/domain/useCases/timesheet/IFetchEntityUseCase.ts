/**
 * IFetchUseCase が変換されてたエンティティを返すようになったらこのファイルは削除されます。
 */
import { Timesheet } from '@attendance/domain/models/Timesheet';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  targetDate?: string | null;
  employeeId?: string | null;
} | void>;

export type IOutputData = Interface.IOutputData<{
  employeeId: string;
  timesheet: Timesheet;
}>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
