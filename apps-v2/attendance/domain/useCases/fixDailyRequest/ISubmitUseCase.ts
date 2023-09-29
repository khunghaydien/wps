import { Status as DailyRequestStatus } from '@attendance/domain/models/AttDailyRequest';
import {
  NotSubmittedReason,
  Result,
  UserInducedReason,
} from '@attendance/domain/models/Result';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export type IInputData = Interface.IInputData<{
  id: string;
  dailyRequestSummary: {
    status: DailyRequestStatus;
  };
}>;

export type IOutputData = Interface.IOutputData<
  Result<UserInducedReason | NotSubmittedReason>
>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
