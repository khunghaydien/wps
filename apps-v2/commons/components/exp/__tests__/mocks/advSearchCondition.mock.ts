const advSearchCondition = {
  requestDateRange: {
    startDate: '2020-07-01',
    endDate: '2020-07-31',
  },
  accountingDateRange: { startDate: '2020-07-06', endDate: '2020-05-02' },
  amountRange: { minAmount: 100, maxAmount: 1000 },
  reportTypeIds: ['a0v0o00000nRe2lAAC'],
  subject: 'Test',
  detail: [],
  reportNo: null,
  vendor: [],
};

export const EXTRA_CONDITIONS = {
  ACCOUNTING_DATE: 'accountingDate',
  REPORT_NO: 'reportNo',
  VENDOR: 'vendor',
};

export default advSearchCondition;
