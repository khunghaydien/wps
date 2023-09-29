export type ResultSuccess<Value = void> = { result: true; value: Value };

export type ResultFailed<Reason> = {
  result: false;
  reason: Reason;
};

export type Result<Reason, Value = unknown> =
  | ResultSuccess<Value>
  | ResultFailed<Reason>;

export const REASON = {
  UNEXPECTED: 'unexpected',
  USER_INDUCED: 'userInduced',
  NO_RECORD: 'noRecord',
  EXISTED_INVALID_REQUEST: 'existedInvalidRequest',
  EXISTED_SUBMITTING_REQUEST: 'existedSubmittingRequest',
} as const;

export type ReasonMap = typeof REASON;

export type UnexpectedReason = ReasonMap['UNEXPECTED'];

export type UserInducedReason = ReasonMap['USER_INDUCED'];

export type NoRecord = ReasonMap['NO_RECORD'];

export type NotSubmittedReason =
  | ReasonMap['EXISTED_INVALID_REQUEST']
  | ReasonMap['EXISTED_SUBMITTING_REQUEST'];
