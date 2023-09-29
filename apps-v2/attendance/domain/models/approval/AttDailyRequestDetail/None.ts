import { BaseAttDailyRequestDetail, Request } from './Base';

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

export type NoneRequestDetail = BaseAttDailyRequestDetail<None>;

/**
 * The body of request
 */
export type NoneRequest = Request<NoneRequestDetail>;
