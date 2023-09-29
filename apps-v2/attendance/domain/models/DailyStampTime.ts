import { CommuteCount } from './CommuteCount';
import { FixDailyRequest } from './FixDailyRequest';

/**
 * @deprecated
 */
export const MODE_TYPE = {
  CLOCK_IN: 'CLOCK_IN',
  CLOCK_OUT: 'CLOCK_OUT',
  CLOCK_REIN: 'CLOCK_REIN',
} as const;

/**
 * @deprecated
 */
export type ModeType = Value<typeof MODE_TYPE>;

export const CLOCK_TYPE = {
  IN: 'in',
  OUT: 'out',
  REIN: 'rein',
} as const;

export type ClockType = Value<typeof CLOCK_TYPE>;

export const STAMP_SOURCE = {
  WEB: 'web',
  MOBILE: 'mobile',
} as const;

export type StampSource = Value<typeof STAMP_SOURCE>;

export type DailyStampTime = {
  isEnableStartStamp: boolean;
  isEnableEndStamp: boolean;
  isEnableRestartStamp: boolean;
  stampInDate: string;
  stampOutDate: string;
  stampReInDate: string;
  defaultAction: ClockType | null | undefined;
  commuteCount: CommuteCount;
  isPossibleFixDailyRequest: boolean;
  record: {
    id: string;
    fixDailyRequest: FixDailyRequest;
  };
};

/**
 * @deprecated
 */
export type EditingDailyStampTime = {
  isEnableStartStamp: boolean;
  isEnableEndStamp: boolean;
  isEnableRestartStamp: boolean;
  stampInDate: string;
  stampOutDate: string;
  stampReInDate: string;
  mode: ModeType | null | undefined;
  message: string;
};

export type IDailyStampTimeRepository = {
  fetch: (employeeId?: string) => Promise<DailyStampTime>;
  post: (param: {
    clockType: ClockType;
    source: StampSource;
    comment?: string | null | undefined;
    location?: {
      latitude: number;
      longitude: number;
    };
    commuteCount?: CommuteCount;
  }) => Promise<{
    targetDate: string;
    insufficientRestTime: number | null;
  }>;
};
