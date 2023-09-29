/**
 * Annual - 年次有給休暇
 * Paid - 有休
 * Unpaid - 無休
 * Substitute - 振替
 * Compensatory - 代休
 */
export type LeaveType =
  | 'Annual'
  | 'Paid'
  | 'Unpaid'
  | 'Substitute'
  | 'Compensatory';

// eslint-disable-next-line import/prefer-default-export
export const LEAVE_TYPE: { [key in LeaveType]: LeaveType } = {
  Annual: 'Annual',
  Paid: 'Paid',
  Unpaid: 'Unpaid',
  Substitute: 'Substitute',
  Compensatory: 'Compensatory',
};

/**
 * LeaveTypeが、"給与が発生する"タイプのものかどうかを判定します
 * Paid(有給休暇)だけでなく、Annual(年次有給休暇)なども該当します
 * (LeaveRequest.leaveType の型が LeaveType | null なので、引数の型もそれに合わせています)
 * @param {LeaveType} leaveType (nullable)
 * @return {boolean}
 */
export const isWithPayment = (leaveType: LeaveType | null) => {
  return (
    leaveType === 'Annual' ||
    leaveType === 'Paid' ||
    leaveType === 'Compensatory'
  );
};

/**
 * LeaveTypeが、"控除が発生する"タイプのものかどうかを判定します
 * (LeaveRequest.leaveType の型が LeaveType | null なので、引数の型もそれに合わせています)
 * @param {LeaveType} leaveType (nullable)
 * @return {boolean}
 */
export const isWithDeduction = (leaveType: LeaveType | null) => {
  return leaveType === 'Unpaid';
};
