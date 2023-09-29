import Decimal from 'decimal.js';
import _ from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import Api from '../../../commons/api';
import { AmountRangeOption } from '../../../commons/components/fields/DropdownAmountRange';
import { DateRangeOption } from '../../../commons/components/fields/DropdownDateRange';
import msg from '@commons/languages';
import FormatUtil from '@commons/utils/FormatUtil';

import { AttachedFiles } from '../common/AttachedFile';
import { ExpenseReportType } from './expense-report-type/list';
import { ExtendedItemExpectedList, initialEmptyEIs } from './ExtendedItem';
import { OrderBy, SortBy } from './FinanceApproval';
import { Record, RecordUpdateInfoList } from './Record';
import { VENDOR_USAGE } from './Vendor';

export const status = {
  NOT_REQUESTED: 'NotRequested',
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELED: 'Canceled',
  RECALLED: 'Removed',
  CLAIMED: 'Claimed',
  DISCARDED: 'Discarded',
  APPROVED_PRE_REQUEST: 'ApprovedPreRequest',
  ACCOUNTING_AUTHORIZED: 'AccountingAuthorized',
  ACCOUNTING_REJECTED: 'AccountingRejected',
  JOURNAL_CREATED: 'JournalCreated',
  FULLY_PAID: 'Fully Paid',
} as const;

export const SETTLEMENT_RESULTS = {
  REVERSAL: 'REVERSAL',
  REIMBURSE: 'REIMBURSE',
};

export const ATTACHMENT_MAX_COUNT = 3;

type StatusKeys = keyof typeof status;
export type ReportStatuses = typeof status[StatusKeys];

export type Report = ExtendedItemExpectedList & {
  accountingDate: string;
  accountingPeriodId?: string;
  attachedFileList?: AttachedFiles;
  // Ignore this field, use attachedFileName
  attachedFileTitle?: string;
  cashAdvanceAmount?: number;
  cashAdvanceDate?: string;
  cashAdvanceRequestAmount?: number;
  cashAdvanceRequestDate?: string;
  cashAdvanceRequestPurpose?: string;
  costCenterCode: string;
  costCenterHistoryId?: string;
  costCenterName: string;
  customRequestId?: string;
  customRequestName?: string;
  customRequestStatus?: string;
  departmentCode?: string;
  departmentName?: string;
  empHistoryId?: string;
  empId?: string;
  employeeBaseId?: string;
  employeeHistoryId?: string;
  employeeName?: string;
  expPreRequest?: Report;
  expReportTypeId?: string;
  expReportTypeName?: string;
  fieldCustomLayout?: Array<Array<string>>;
  isCostCenterChangedManually?: boolean;
  isEstimated?: boolean;
  isFileAttachmentRequired?: boolean;
  isNewReport?: boolean; // use in FE only
  isUseCashAdvance?: boolean;

  jobCode: string;
  jobId?: string;
  jobName: string;
  paymentDueDate: string;
  paymentDueDateUsage?: string;
  preRequest?: Report;
  preRequestId?: string;
  purpose?: string;
  recordIds?: Array<string>;
  records: Array<Record>;
  remarks?: string;
  reportId?: string;
  reportNo?: string;
  requestDate?: string;
  requestId?: string;
  scheduledDate?: string;
  selectedAccountingPeriod?: string;
  settAmount?: number;
  settResult?: string;
  status?: ReportStatuses;
  subject: string;
  totalAmount: number;
  useFileAttachment: boolean;
  vendorCode: string;
  vendorId?: string;
  vendorIsJctQualifiedIssuer?: boolean;
  vendorJctRegistrationNumber?: string;
  vendorName: string;
};

export type ReportListItem = {
  empHistoryId?: string;
  expReportTypeName: string;
  reportId: string;
  reportNo: string;
  requestDate: string;
  requestId: string;
  settAmount?: number;
  settResult?: string;
  status: string;
  subject: string;
  totalAmount: number;
  vendorId?: string;
  vendorRequiredFor?: string;
};

export type ReportList = Array<ReportListItem>;

// Pagination
export type ReportIdList = Array<string>;
export type ExpReportIds = {
  reportIdList: ReportIdList;
  totalSize: number;
};

// Advanced Search
export type SearchConditions = {
  accountingDateRange?: DateRangeOption;
  amountRange?: AmountRangeOption;
  costCenterBaseIds?: Array<string>;
  departmentBaseIds?: Array<string>;
  detail?: Array<string>;
  empBaseIds?: Array<string>;
  empHistoryIds?: Array<string>;
  financeStatusList?: Array<string>;

  reportNo?: string;
  reportTypeIds?: Array<string>;
  requestDateRange?: DateRangeOption;
  statusList?: Array<string>;
  subject?: string;
  vendorIds?: Array<string>;
};

/**
 * The default date of search condition
 * 1st day of last month to today
 *
 * @returns {DateRangeOption}
 */
export const requestDateInitVal = (): DateRangeOption => {
  const firstDayOfLastMonth = moment()
    .add(-1, 'months')
    .startOf('months')
    .format('YYYY-MM-DD');
  const today = moment().format('YYYY-MM-DD');
  const resDateRange: DateRangeOption = {
    startDate: firstDayOfLastMonth,
    endDate: today,
  };
  return resDateRange;
};

export const initialSearchCondition = {
  requestDateRange: requestDateInitVal(),
  accountingDateRange: { startDate: null, endDate: null },
  amountRange: { minAmount: null, maxAmount: null },
  reportTypeIds: [],
  vendorIds: [],
  reportNo: null,
  extraCondition: [],
  subject: '',
  detail: [],
};

// Handling Performance
export const VIEW_MODE = {
  REPORT_LIST: 'REPORT_LIST',
  REPORT_DETAIL: 'REPORT_DETAIL',
};

// Other status are not to be displayed in report summary screen
export const headerStatusLabels = [
  status.NOT_REQUESTED,
  status.PENDING,
  status.RECALLED,
  status.REJECTED,
  status.CANCELED,
  status.APPROVED,
  status.CLAIMED,
  status.DISCARDED,
  status.APPROVED_PRE_REQUEST,
  status.ACCOUNTING_AUTHORIZED,
  status.ACCOUNTING_REJECTED,
  status.JOURNAL_CREATED,
  status.FULLY_PAID,
];

export const FILE_ATTACHMENT_TYPE = {
  Optional: 'Optional',
  Required: 'Required',
  NotUsed: 'NotUsed',
};

export const CUSTOM_REQUEST_LINK_USAGE_TYPE = {
  Optional: 'Optional',
  Required: 'Required',
  NotUsed: 'NotUsed',
};

export const REPORT_PER_PAGE_MOBILE = 10;

export const initialStateReport = {
  subject: '',
  accountingDate: '',
  accountingPeriodId: null,
  attachedFileList: [],
  useFileAttachment: false,
  totalAmount: 0,
  jobId: null,
  jobName: '',
  jobCode: '',
  costCenterHistoryId: null,
  reportId: null,
  requestId: null,
  costCenterName: '',
  costCenterCode: '',
  customRequestId: null,
  customRequestName: '',
  purpose: '',
  remarks: '',
  records: [],
  vendorId: null,
  vendorCode: '',
  vendorName: '',
  paymentDueDate: '',
  paymentDueDateUsage: null,
  expReportTypeId: null,
  subroleId: undefined,
  ...initialEmptyEIs(),
};

export const initailCostCenterData = {
  costCenterHistoryId: null,
  costCenterName: '',
  costCenterCode: '',
};

export const initialJobData = {
  jobId: null,
  jobCode: '',
  jobName: '',
};

export const initailVendorData = {
  vendorId: null,
  vendorCode: '',
  vendorName: '',
  paymentDueDate: '',
  paymentDueDateUsage: null,
  vendorJctRegistrationNumber: null,
  vendorIsJctQualifiedIssuer: false,
};

export const initialCustomRequestData = {
  customRequestId: null,
  customRequestName: null,
  customRequestStatus: null,
};

export const initialCashAdvanceData = {
  cashAdvanceRequestAmount: null,
  cashAdvanceRequestDate: null,
  cashAdvanceRequestPurpose: null,
};

export const initialStatePreRequest = {
  subject: '',
  accountingDate: moment(new Date()).format('YYYY-MM-DD'),
  attachedFileList: [],
  useFileAttachment: false,
  scheduledDate: '',
  totalAmount: 0,
  purpose: '',
  remarks: '',
  records: [],
  expReportTypeId: null,
  isEstimated: false,
  ...initialEmptyEIs(),
  ...initialCashAdvanceData,
  ...initailCostCenterData,
  ...initialJobData,
  ...initailVendorData,
};

/**
 * Update field value and return updated object
 *
 * @param {Report} report
 * @param {string} key
 * @param {*} value
 * @returns updated report
 */
export const updateFiledValue = (state: Report, key: string, value: any) => {
  const cloneState = cloneDeep(state);
  cloneState[key] = value;
  return cloneState;
};

/**
 * Total amount for report records
 *
 * @param {Report} report
 * @param {number} [decimalPlaces=6]
 * @returns {number}
 */
export const calcTotalAmount = (report: Report, decimalPlaces = 6): number => {
  const totalAmount: Decimal = report.records.reduce(
    (total: Decimal, record): Decimal =>
      Decimal.add(total, record ? record.items[0].amount : 0),
    new Decimal(0)
  );
  return Number(totalAmount.toFixed(decimalPlaces, Decimal.ROUND_DOWN));
};

/**
 *  Calculate total amount for each currency
 *
 * @param {Array<Record>} records
 * @returns {Object}
 */
export const calculateSubtotalAmount = (records: Array<Record>) => {
  const foreignCurrency = {};
  const foreignCurrencyRecords =
    filter(records, 'items.0.useForeignCurrency') || [];
  foreignCurrencyRecords.forEach((record) => {
    const { currencyInfo, localAmount } = record.items[0];
    const { code, decimalPlaces, symbol } = currencyInfo || {};
    if (foreignCurrency[code]) {
      foreignCurrency[code].amount = Decimal.add(
        foreignCurrency[code].amount,
        localAmount
      );
    } else {
      foreignCurrency[code] = {
        symbol,
        amount: new Decimal(localAmount),
        decimalPlaces,
      };
    }
  });

  let baseCurrencyAmount = 0;
  if (!isEmpty(foreignCurrency)) {
    const baseCurrencyRecords = filter(records, [
      'items.0.useForeignCurrency',
      false,
    ]);
    baseCurrencyAmount =
      (!isEmpty(baseCurrencyRecords) &&
        baseCurrencyRecords.reduce(
          (acc, cur) => acc + Number(cur.amount),
          0
        )) ||
      0;
  }
  return { foreignCurrency, baseCurrencyAmount };
};

export const getDisplayOfCR = (reportType?: ExpenseReportType) => {
  if (!reportType) {
    return {};
  }
  const { customRequestLinkUsage } = reportType;
  const isCustomRequestVisible =
    customRequestLinkUsage &&
    customRequestLinkUsage !== CUSTOM_REQUEST_LINK_USAGE_TYPE.NotUsed;
  const isCustomRequestRequired =
    isCustomRequestVisible &&
    customRequestLinkUsage === CUSTOM_REQUEST_LINK_USAGE_TYPE.Required;
  return {
    isCustomRequestVisible,
    isCustomRequestRequired,
  };
};

export const getDisplayOfVendorCCJob = (reportType?: ExpenseReportType) => {
  if (!reportType) {
    return {};
  }
  const {
    isVendorRequired: vendor,
    isCostCenterRequired: cc,
    isJobRequired: job,
  } = reportType;

  const visibleSetting = [VENDOR_USAGE.OPTIONAL, VENDOR_USAGE.REQUIRED];

  const isVendorVisible = vendor && visibleSetting.includes(vendor);
  const isVendorRequired = isVendorVisible && vendor === VENDOR_USAGE.REQUIRED;
  const isCostCenterVisible = cc && visibleSetting.includes(cc);
  const isCostCenterRequired =
    isCostCenterVisible && cc === VENDOR_USAGE.REQUIRED;
  const isJobVisible = job && visibleSetting.includes(job);
  const isJobRequired = isJobVisible && job === VENDOR_USAGE.REQUIRED;

  return {
    isVendorVisible,
    isVendorRequired,
    isCostCenterVisible,
    isCostCenterRequired,
    isJobVisible,
    isJobRequired,
  };
};

export const getDisplayOfRecordVendor = (reportType?: ExpenseReportType) => {
  if (!reportType) {
    return {};
  }

  const visibleSetting = [
    VENDOR_USAGE.RECORD_OPTIONAL,
    VENDOR_USAGE.RECORD_REQUIRED,
  ];
  const { isVendorRequired: vendor } = reportType;
  const isRecordVendorVisible = vendor && visibleSetting.includes(vendor);
  const isRecordVendorRequired =
    vendor && vendor === VENDOR_USAGE.RECORD_REQUIRED;

  return {
    isRecordVendorVisible,
    isRecordVendorRequired,
  };
};

export const generateSettlementAmount = (
  currencyDecimalPlaces: number,
  currencySymbol: string,
  settAmount?: number,
  settResult?: string
): string => {
  if (_.isNil(settAmount) || _.isNil(settResult)) return '';

  const isReversal = settResult === SETTLEMENT_RESULTS.REVERSAL;
  const settResultLabel = settResult
    ? isReversal
      ? msg().Exp_Lbl_Reversal
      : msg().Exp_Lbl_Reimburse
    : '';
  return `${currencySymbol} ${FormatUtil.formatNumber(
    settAmount,
    currencyDecimalPlaces
  )} ${settResultLabel}`;
};

export const expensesArea = 'Expenses';
export const expenseListArea = 'List';
// Pagination
export const getReportIdList = (
  isApproved = true,
  sortBy?: SortBy,
  order?: OrderBy,
  advSearchConditions?: SearchConditions,
  empId?: string
): Promise<ExpReportIds> => {
  return Api.invoke({
    path: '/exp/report/id-list',
    param: {
      isApproved,
      sortBy,
      order,
      searchFilter:
        isApproved || (advSearchConditions && advSearchConditions.empHistoryIds)
          ? advSearchConditions
          : null,
      empId,
    },
  }).then((response: ExpReportIds) => response);
};

export const getReportList = (
  reportIds?: ReportIdList,
  count?: number,
  empId?: string,
  empHistoryId?: string
): Promise<ReportList> => {
  return Api.invoke({
    path: '/exp/report/list',
    param: {
      reportIds,
      getByNumberOfReports: count,
      empId,
      empHistoryId,
    },
  }).then((response: { reports: ReportList }) => response.reports);
};

/**
 *
 *
 * @param {string} empId
 * @param {ReportIdList} reportIds
 * @param {number} [getByNumberOfReports]
 * if specified, will get by number of report regardless of ids passed; and only non-approved report will be returned
 * @return {*}  {Promise<ReportList>}
 */
export const getReportListMobile = (
  empId: string,
  reportIds: ReportIdList,
  getByNumberOfReports?: number,
  empHistoryIds?: Array<string>
): Promise<ReportList> => {
  return Api.invoke({
    path: '/exp/report/list',
    param: {
      empId,
      reportIds,
      empHistoryIds,
      getByNumberOfReports,
    },
  }).then((response: { reports: ReportList }) => response.reports);
};

export const expFormArea = 'ExpensesForm';
export const getReport = (
  reportId?: string,
  usedIn?: string
): Promise<Report> => {
  return Api.invoke({
    path: '/exp/report/get',
    param: {
      reportId,
      usedIn,
    },
  }).then((response: Report) => response);
};

export const deleteReport = (reportId: string): Promise<any> => {
  return Api.invoke({
    path: '/exp/report/delete',
    param: {
      reportId,
    },
  }).then((response: any) => response);
};

export const saveReport = (
  report: Report & { isNewReport?: boolean },
  empId: string
) => {
  // remove records for better API performance.
  const reportCopy = Object.assign({}, report);
  reportCopy.empId = empId;
  delete reportCopy.records;
  delete reportCopy?.isNewReport;

  return Api.invoke({
    path: '/exp/report/save',
    param: reportCopy,
  }) // response is save reportId
    .then((response: string) => response)
    .catch((err) => {
      throw err;
    });
};

// Temporary Solution. To be removed once mobile api is updated.
export const saveReportMobile = (report: Report): Promise<void> => {
  const reportCopy = Object.assign({}, report);

  // convert date format
  const accountingDate = moment(report.accountingDate).format('YYYY-MM-DD');
  reportCopy.accountingDate = accountingDate;

  // get recordIds from records
  // TODO BE should add empty check for empty array
  let recordIds = null;
  if (reportCopy.records && reportCopy.records.length > 0) {
    recordIds = reportCopy.records.map((record) => record.recordId);
  }
  reportCopy.recordIds = recordIds;

  // remove records for better API performance.
  delete reportCopy.records;

  return Api.invoke({
    path: '/exp/report/save',
    param: reportCopy,
  }) // response is save reportId
    .then((response: string) => response)
    .catch((err) => {
      throw err;
    });
};

export type ReportClaimResponse = {
  reportId: string;
  updatedRecords: RecordUpdateInfoList;
};

/**
 * Create expense report from approved request
 *
 * @param {string} preRequestId
 * @param {string} empId
 * @returns {Promise<ReportClaimResponse>}
 */
export const createReportFromRequest = (
  preRequestId: string,
  empId: string,
  empHistoryId?: string
): Promise<ReportClaimResponse> => {
  return Api.invoke({
    path: '/exp/pre-request/create-report',
    param: {
      reportId: preRequestId,
      empId,
      empHistoryId,
    },
  }) // response are reportId and updated records' exchange rate/tax rate
    .then((response: ReportClaimResponse) => response)
    .catch((err) => {
      throw err;
    });
};

export const cloneRequest = (
  reportId: string,
  empId: string,
  empHistoryId?: string
): Promise<void> => {
  return Api.invoke({
    path: '/exp/pre-request/clone',
    param: {
      reportId,
      empId,
      empHistoryId,
    },
  })
    .then((response: string) => response)
    .catch((err) => {
      throw err;
    });
};

export const cloneReport = (
  reportId: string,
  empId: string,
  empHistoryId?: string
): Promise<void> => {
  return Api.invoke({
    path: '/exp/report/clone',
    param: {
      reportId,
      empId,
      empHistoryId,
    },
  })
    .then((response: string) => response)
    .catch((err) => {
      throw err;
    });
};

export const getApprovedRequestReport = (reportId?: string, empId?: string) => {
  return Api.invoke({
    path: '/exp/report/approved-request/get',
    param: {
      reportId,
      empId,
    },
  })
    .then((res: Report) => res)
    .catch((err) => {
      throw err;
    });
};

export type PreRequestList = Array<Report>;

export const getPreRequestIdList = (
  isApproved = true,
  advSearchConditions?: SearchConditions,
  empId?: string
): Promise<ExpReportIds> => {
  return Api.invoke({
    path: '/exp/pre-request/id-list',
    param: {
      isApproved,
      searchFilter: advSearchConditions,
      empId,
    },
  }).then((response: ExpReportIds) => response);
};

export const getPreRequestList = (
  reportIds?: ReportIdList,
  count?: number,
  empId?: string,
  empHistoryIds?: Array<string>
): Promise<PreRequestList> => {
  return Api.invoke({
    path: '/exp/pre-request/list',
    param: {
      reportIds,
      getByNumberOfReports: count,
      empId,
      empHistoryIds,
    },
  }).then((response: { reports: ReportList }) => response.reports);
};

export const getPreRequest = (
  reportId?: string,
  usedIn?: string
): Promise<any> => {
  return Api.invoke({
    path: '/exp/pre-request/get',
    param: {
      reportId,
      usedIn,
    },
  })
    .then((res: Report) => res)
    .catch((err) => {
      throw err;
    });
};

export const savePreRequest = (report: Report, empId: string): Promise<any> => {
  return Api.invoke({
    path: '/exp/pre-request/save',
    param: { ...report, empId },
  })
    .then((response: any) => response)
    .catch((err) => {
      throw err;
    });
};

// used in mobile only to save as pdf when generating print page
export const generatePrintPage = (
  empId: string,
  reportId: string,
  reportTypeId: string,
  endDate: string,
  isRequest: boolean,
  empHistoryId: string
): Promise<{ fileId: string }> => {
  return Api.invoke({
    path: '/exp/print-page/generate',
    param: { empId, reportId, endDate, reportTypeId, isRequest, empHistoryId },
  })
    .then((response: { fileId: string }) => {
      return response;
    })
    .catch((err) => {
      throw err;
    });
};

export const deletePreRequest = (reportId?: string): Promise<void> => {
  return Api.invoke({
    path: '/exp/pre-request/delete',
    param: {
      reportId,
    },
  }).catch((err) => {
    throw err;
  });
};

export const exportToEmail = (
  contentDocumentId: string,
  contentVersionId: string
): Promise<void> => {
  return Api.invoke({
    path: '/exp/report/send-email',
    param: {
      contentDocumentId,
      contentVersionId,
    },
  });
};
