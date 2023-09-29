import Api from '../../../commons/api';

// Custom Hint
export type CustomHint = {
  moduleType?: string;
  recordCostCenter?: string;
  recordDate?: string;
  recordExpenseType?: string;
  recordInvoice?: string;
  recordJob?: string;
  recordQuotation?: string;
  recordReceipt?: string;
  recordSummary?: string;
  reportHeaderAccountingPeriod?: string;
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
