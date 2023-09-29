import {
  AttDailyDetailBaseForStore,
  AttDailyDetailBaseFromApi,
  Request,
} from './Base';

/**
 * a type used for initial view.
 *
 * 初期項目の type
 */
export type None = {
  type: '';
};

// TODO
// Merge the following types into one type,
// becuase those two types have same structure.

export type NoneApi = AttDailyDetailBaseFromApi<None>;

export type NoneStore = AttDailyDetailBaseForStore<None>;

/**
 * The body of request
 */
export type NoneRequest = Request<NoneStore>;
