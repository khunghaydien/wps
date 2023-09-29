import { IDailyStampTimeRepository } from '@attendance/domain/models/DailyStampTime';

export type CloseEvent = {
  /**
   * true if user closed daily-summary
   */
  dismissed: boolean;

  /**
   * true if user saved daily-summary
   */
  saved: boolean;

  /**
   * true if user called timestamp API to leave work
   */
  timestamp: boolean;

  /**
   * The date daily-summary opens
   */
  targetDate: string;

  /**
   * The result of timestamp API
   */
  dailyStampTimeResult?: PromiseType<
    ReturnType<IDailyStampTimeRepository['post']>
  >;
};

/**
 * The type of onClose event handler
 */
export type CloseEventHandler = (e: CloseEvent) => void;
