import Api from '../../../../commons/api';

import { ExtendedItemExpectedList } from '../ExtendedItem';

const MAX_END_DATE = '2101-01-01';

export type ExpTypeInfo = {
  expTypeId: string;
  expTypeName: string;
};

// Export Type Definition
export type ExpenseReportType = ExtendedItemExpectedList & {
  id: string;
  active?: boolean;
  code?: string;
  companyId?: string;
  customRequestLinkUsage: string;
  description?: string;
  expTypeIds?: Array<string>;
  expTypeList?: Array<ExpTypeInfo>;
  fileAttachment: string;
  isCostCenterRequired?: string;
  isJobRequired?: string;
  isVendorRequired?: string;
  name?: string;
  requestRequired?: boolean;
  useFileAttachment: boolean;
  vendorUsedIn?: boolean;
};

export type ExpenseReportTypeList = Array<ExpenseReportType>;

export const reportTypeArea = 'ReportType';

export const getReportTypeList = (
  companyId: string,
  usedIn: string | undefined,
  active?: boolean,
  empId?: string,
  withExpTypeName?: boolean,
  startDate?: string,
  endDate?: string,
  includeLinkedExpenseTypeIds?: boolean,
  reportTypeId?: string
): Promise<{ records: ExpenseReportTypeList }> => {
  return Api.invoke({
    path: '/exp/report-type/search',
    param: {
      companyId,
      usedIn,
      active,
      withExpTypeName,
      includeLinkedExpenseTypeIds,
      startDate,
      endDate: endDate || MAX_END_DATE,
      empId,
      id: reportTypeId,
    },
  });
};

export const getReportTypeById = (
  reportTypeId: string,
  companyId: string,
  usedIn: string | undefined
): Promise<ExpenseReportType> => {
  const _ = undefined;
  return Api.invoke({
    path: '/exp/report-type/search',
    param: {
      companyId,
      id: reportTypeId,
      usedIn,
    },
  }).then(({ records }: { records: ExpenseReportTypeList }) => records[0]);
};
