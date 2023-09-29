import {
  ClockType,
  StampSource,
} from '@attendance/domain/models/DailyStampTime';
import { Result } from '@attendance/domain/models/Result';

import * as Interface from '@attendance/domain/useCases/IUseCase';

export const REASON = {
  REQUIRED_COMMENT_WITHOUT_LOCATION: 'requiredCommentWithoutLocation',
} as const;

export type IInputData = Interface.IInputData<{
  clockType: ClockType;
  source: StampSource;
  comment?: string | null | undefined;
  location?: {
    latitude: number;
    longitude: number;
  };
  commuteCount?: {
    forwardCount: number;
    backwardCount: number;
  };
  requiredLocation?: boolean;
}>;

export type IOutputData = Interface.IOutputData<
  Result<
    Value<typeof REASON>,
    {
      targetDate: string;
    }
  >
>;

export type IUseCase = Interface.IUseCase<IInputData, IOutputData>;
