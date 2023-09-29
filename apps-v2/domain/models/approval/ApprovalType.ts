import { $Values } from 'utility-types';

// NOTE: 値は、リクエスト時のパラメータに一致させている
const ApprovalType = {
  ByEmployee: 'employee',
  ByDelegate: 'delegate',
} as const;

export type ApprovalTypeValue = $Values<typeof ApprovalType>;

export default ApprovalType;
