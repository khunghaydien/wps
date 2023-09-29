import { BaseAttDailyRequestDetail, Request, REQUEST_TYPE } from './Base';

/**
 * Absence
 */
export type Absence = {
  type: typeof REQUEST_TYPE.Absence;
  startDate: string; // 対象日
  endDate: string; // 対象日
  reason: string; // 理由
};

// TODO
// Merge the following types into one type,
// becuase those two types have same structure.

export type AbsenceRequestDetail = BaseAttDailyRequestDetail<Absence>;

/**
 * The body of request
 */
export type AbsenceRequest = Request<AbsenceRequestDetail>;
