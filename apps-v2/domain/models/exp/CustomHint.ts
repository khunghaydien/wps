import Api from '../../../commons/api';

// Custom Hint
export type CustomHint = {
  moduleType?: string;
  recordCostCenter?: string;
  recordCurrency?: string;
  recordDate?: string;
  recordExchangeRate?: string;
  recordExpenseType?: string;
  recordGstAmount?: string;
  recordIncludeTax?: string;
  recordInvoice?: string;
  recordJob?: string;
  recordLocalAmount?: string;
  recordPaymentMethod?: string;
  recordQuotation?: string;
  recordReceipt?: string;
  recordSummary?: string;
  recordWithholdingTaxAmount?: string;
  recordWithoutTax?: string;
  reportHeaderAccountingPeriod?: string;
  reportHeaderCAAmount?: string;
  reportHeaderCADate?: string;
  reportHeaderCAPurpose?: string;
  reportHeaderCARequestAmount?: string;
  reportHeaderCARequestDate?: string;
  reportHeaderCASettlementAmount?: string;
  reportHeaderCostCenter?: string;
  reportHeaderJob?: string;
  reportHeaderPurpose?: string;
  reportHeaderRecordDate?: string;
  reportHeaderRemarks?: string;
  reportHeaderReportType?: string;
  reportHeaderScheduledDate?: string;
  reportHeaderVendor?: string;
  requestRecordDate?: string;
};

// eslint-disable-next-line import/prefer-default-export
export const getCustomHint = (
  companyId: string,
  moduleType: string
): Promise<CustomHint> => {
  return Api.invoke({
    path: '/custom-hint/get',
    param: { companyId, moduleType },
  });
};
