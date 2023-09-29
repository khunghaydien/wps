export const PRODUCT_CATEGORY = {
  ALL: 'All',
  ATTENDANCE: 'Attendance',
  COMMON: 'Common',
  CUSTOM_REQUEST: 'CustomRequest',
  EXPENSE: 'Expense',
  TIME_TRACKING: 'TimeTracking',
  PSA: 'PSA',
} as const;

export type ProductCategory =
  typeof PRODUCT_CATEGORY[keyof typeof PRODUCT_CATEGORY];
