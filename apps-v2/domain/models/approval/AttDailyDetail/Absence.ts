import {
  AttDailyDetailBaseForStore,
  AttDailyDetailBaseFromApi,
  Request,
} from './Base';

/**
 * Absence
 */
export type Absence = {
  type: 'Absence';
  startDate: string; // 対象日
  endDate: string; // 対象日
  reason: string; // 理由
};

// TODO
// Merge the following types into one type,
// becuase those two types have same structure.

export type AbsenceApi = AttDailyDetailBaseFromApi<Absence>;

export type AbsenceStore = AttDailyDetailBaseForStore<Absence>;

/**
 * The body of request
 */
export type AbsenceRequest = Request<AbsenceStore>;
