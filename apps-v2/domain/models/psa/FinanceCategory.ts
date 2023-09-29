export type FinanceType = {
  readonly Revenue: 'Revenue';
  readonly Cost: 'Cost';
  readonly RevenueCost: 'RevenueCost';
  readonly GrossMargin: 'GrossMargin';
};

export const FINANCE_TYPE = {
  Revenue: 'Revenue',
  Cost: 'Cost',
};

export type FinanceCategory = {
  id: string;
  name: string;
  companyId: string;
  financeType: FinanceType[keyof FinanceType] | string;
  code: string;
  name_L0: string;
  name_L1: string;
  name_L2: string;
  description_L0: string;
  description_L1: string;
  description_L2: string;
  order: string;
};

export type FinanceCategoryList = Array<FinanceCategory>;
