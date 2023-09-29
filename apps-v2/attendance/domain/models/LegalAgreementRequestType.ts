/**
 * Monthly - 月次残業
 * Yearly - 年次残業
 */
export const CODE = {
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
} as const;

export type CodeMap = typeof CODE;

export type Code = CodeMap[keyof CodeMap];

export const DisplayOrder: Code[] = [CODE.MONTHLY, CODE.YEARLY];

export const ReapplyableTypes: Code[] = [CODE.MONTHLY, CODE.YEARLY];
