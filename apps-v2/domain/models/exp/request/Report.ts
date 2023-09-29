import Decimal from 'decimal.js';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import Api from '../../../../commons/api';
import { DateRangeOption } from '../../../../commons/components/fields/DropdownDateRange';
import DateUtil from '../../../../commons/utils/DateUtil';

import STATUS from '../../../models/approval/request/Status';
import { AttachedFiles } from '@apps/domain/models/common/AttachedFile';

import { ApprovalHistory } from '../../approval/request/History';
import {
  ExtendedItemExpectedList,
  FieldCustomLayout,
  initialEmptyEIs,
} from '../ExtendedItem';
import {
  MileageRouteInfo,
  Receipt,
  RecordItem,
  RouteInfo,
  transitIcRecordInfo,
} from '../Record';

export const OPTION_LIMIT = 100;
export type ExtendItemInfo = {
  defaultValueText: string;
  description: string;
  extendedItemCustomId: string;
  inputType: string;
  isRequired: string;
  limitLength: string;
  name: string;
  picklist: Array<{ label: string; value: string }>;
};

// 経費明細
export type ExpRequestRecord = ExtendedItemExpectedList & {
  // 通貨名
  amount: number;
  // 利用日	YYYY-MM-DD形式の文字列
  currencyName: string;
  // Pre-Request Report Id
  expPreRequestRecordId?: string | null;
  // 明細の並び順
  items: Array<RecordItem>;
  jctRegistrationNumberUsage?: string;
  merchantUsage?: string;
  mileageRouteInfo?: MileageRouteInfo;
  ocrAmount: number;
  ocrDate?: string;
  // 合計金額
  order: number;
  paymentMethodName?: string;
  receiptCreatedDate?: string;
  receiptDataType?: string;
  receiptFileId?: string;
  receiptId?: string;
  receiptList?: Array<Receipt>;
  receiptTitle?: string;
  // 経費明細ID
  recordDate: string;
  recordId: string;
  recordType: string;
  routeInfo: RouteInfo;
  transitIcRecordInfo?: transitIcRecordInfo;
  withholdingTaxUsage: string;
  // 経費内訳
  withoutTax: number;
};

// 承認履歴
export type ExpRequestHistoryList = ApprovalHistory;

// 経費申請
export type ExpRequest = ExtendedItemExpectedList & {
  // 件名
  accountingDate: string;
  // 処理日 YYYY-MM-DD形式の文字列
  accountingPeriodId: string;
  attachedFileCreatedDate?: string;
  attachedFileDataType?: string;
  attachedFileId?: string;
  attachedFileList?: AttachedFiles;
  attachedFileName?: string;
  // ID of Accounting Period
  // TODO temporary remain for flow check, delete after whole feature done
  attachedFileVerId?: string;
  cashAdvanceAmount?: number;
  cashAdvanceDate?: string;
  cashAdvanceRequestAmount?: number;
  cashAdvanceRequestDate?: string;
  cashAdvanceRequestPurpose?: string;
  // 申請者顔写真URL
  comment: string;
  costCenterCode: string;
  costCenterName: string;
  customRequestId?: string;
  customRequestName?: string;
  customRequestStatus?: string;
  delegatedEmployeeName?: string;
  // 申請ステータス
  employeeName: string;
  // 申請者名
  employeePhotoUrl: string;
  expPreRequest?: ExpRequest;
  expPreRequestId?: string;
  expReportTypeName?: string;
  fieldCustomLayout?: FieldCustomLayout;
  historyList: Array<ExpRequestHistoryList>;
  isCostCenterRequired?: boolean;
  isEstimated: boolean;
  isJobRequired?: boolean;
  jobCode: string;
  jobName: string;
  paymentDueDate: string;
  paymentDueDateUsage?: string;
  purpose?: string;
  recordingDate?: string;
  // 備考
  records: Array<ExpRequestRecord>;
  // 合計金額
  remarks: string;
  // 申請者コメント
  reportNo: string;
  requestId: string;
  requestNo?: string;
  scheduledDate?: string;
  settlementAmount?: number;
  settlementResult?: string;
  // 申請ID
  status: string;
  // 申請番号
  subject: string;
  // 代理承認者
  totalAmount: number;
  useCashAdvance?: boolean;
  vendorCode: string;
  vendorId?: string;
  vendorIsJctQualifiedIssuer?: boolean;
  vendorJctRegistrationNumber?: string;
  vendorName: string;
};

export type ExpRequestIdsInfo = {
  requestIdList: Array<string>;
  totalSize: number;
};

// 経費一覧
export type ExpRequestListItem = {
  departmentName: string; // 部署名
  employeeName: string; // 社員名
  photoUrl: string; // 社員の顔写真URL
  reportNo: string; // 申請番号
  requestDate: string; // 申請日付
  requestId: string; // 申請ID
  status?: string; // ステータス
  subject: string; // 件名
  totalAmount: number; // 合計金額
};

export type SearchConditions = {
  departmentBaseIds: Array<string>;
  // FIXME remove `empBaseIdList` after BE make consist to accept empBaseIds for Approval
  empBaseIdList?: Array<string>;
  empBaseIds?: Array<string>;
  empHistoryIds?: Array<string>;
  name?: string;
  requestDateRange: DateRangeOption;
  statusList: Array<string>;
};

export type ExpRequestList = Array<ExpRequestListItem>;

export const submitDateInitVal = (): DateRangeOption => {
  const firstDayOfLastMonth = moment(new Date())
    .add(-1, 'months')
    .startOf('months')
    .format('YYYY-MM-DD');
  const today = DateUtil.getToday();
  const resDateRange: DateRangeOption = {
    startDate: firstDayOfLastMonth,
    endDate: today,
  };
  return resDateRange;
};

export const mobileSubmitDateInitVal = (): DateRangeOption => {
  const today = DateUtil.getToday();
  const priorMonthDate = DateUtil.addInDate(today, -1, 'months');
  const startDate = DateUtil.fromDate(priorMonthDate);

  const dateRange: DateRangeOption = {
    startDate,
    endDate: today,
  };
  return dateRange;
};

// 申請一覧
export const initialStateExpRequestList = [];

export const initialSearchCondition = {
  statusList: [STATUS.Pending],
  empBaseIdList: [],
  departmentBaseIds: [],
  requestDateRange: submitDateInitVal(),
};

export const mobileInitialSearchCondition = {
  statusList: [STATUS.Pending],
  empBaseIdList: [],
  departmentBaseIds: [],
  requestDateRange: mobileSubmitDateInitVal(),
};

// 経費申請
export const initialStateExpRequest = {
  requestId: '', // 申請ID
  status: '', // 申請ステータス
  employeeName: '', // 申請者名
  employeePhotoUrl: '', // 申請者顔写真URL
  comment: '', // 申請者コメント
  reportNo: '', // 申請番号
  subject: '', // 件名
  accountingDate: '', // 処理日 YYYY-MM-DD形式の文字列
  accountingPeriodId: '', // ID of Accounting Period
  attachedFileList: [],
  totalAmount: 0, // 合計金額
  remarks: '', // 備考
  isEstimated: false,
  purpose: '',
  jobName: '', // Job
  jobCode: '',
  costCenterName: '',
  costCenterCode: '',
  records: [],
  historyList: [],
  expReportTypeName: null,
  expPreRequestId: null,
  expPreRequest: null,
  requestNo: null,
  subroleId: undefined,
  ...initialEmptyEIs(),
  vendorId: null,
  vendorCode: '',
  vendorName: '',
  paymentDueDate: '',
  paymentDueDateUsage: null,
};

/**
 * Calculate total amount for each currency
 *
 * @param {Array<ExpRequestRecord>} records
 * @returns
 */
export const calculateSubtotalAmount = (records: Array<ExpRequestRecord>) => {
  const foreignCurrency = {};
  const foreignCurrencyRecords =
    filter(records, 'items.0.useForeignCurrency') || [];
  foreignCurrencyRecords.forEach((record) => {
    const {
      currencyInfo: { code, decimalPlaces, symbol },
      localAmount,
    } = record.items[0];
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

/**
 * Expense-pc submit report
 *
 * @param {string} reportId
 * @param {string} comment
 * @param {string} empId
 * @returns
 */
export const submitExpRequestReport = (
  reportId: string,
  comment: string,
  empId?: string
) => {
  return Api.invoke({
    path: '/exp/request/report/submit',
    param: { reportId, comment, empId },
  });
};

export const preProcess = (reportId: string, isRequest?: boolean) => {
  const path = isRequest
    ? '/exp/pre-request/approval/pre-process'
    : '/exp/report/approval/pre-process';
  return Api.invoke({
    path,
    param: { reportId },
  });
};

/**
 * Expense-pc fix files for report records
 * Clear receipt if expType = receipt not used
 *
 * @param {string} reportId
 */
export const fixFiles = (reportId: string) => {
  return Api.invoke({
    path: '/exp/report/fix-file',
    param: { reportId },
  });
};

/**
 * Expense-pc recall report
 *
 * @param {string} requestId
 * @param {string} comment
 * @returns
 */
export const cancelExpRequestReport = (requestId: string, comment: string) => {
  return Api.invoke({
    path: '/exp/request/report/cancel-request',
    param: { requestId, comment },
  });
};

export const fetchExpRequestReportIds = (
  searchCondition: SearchConditions,
  empId?: string
) => {
  return Api.invoke({
    path: '/exp/request/report/id/list',
    param: {
      searchCondition,
      empId,
    },
  });
};

export const fetchExpRequestReportList = (
  requestIdList: Array<string>,
  empId?: string
) => {
  return Api.invoke({
    path: '/exp/request/report/list',
    param: { requestIdList, empId },
  }).then((res: { requestList: ExpRequestList }) => res.requestList);
};

export const getExpRequestReport = (requestId?: string, empBaseId?: string) => {
  return Api.invoke({
    path: '/exp/request/report/get',
    param: {
      requestId,
      empBaseId,
    },
  }).then((response: ExpRequest) => response);
};

/**
 * Request-pc submit report
 *
 * @param {string} reportId
 * @param {string} comment
 * @returns {Promise<void>}
 */
export const submitExpPreRequestReport = (
  reportId: string,
  comment: string,
  empId: string
): Promise<void> => {
  return Api.invoke({
    path: '/exp/request/pre-request/submit',
    param: { reportId, comment, empId },
  }).catch((err) => {
    throw err;
  });
};

/**
 * Request-pc recall report
 *
 * @param {string} requestId
 * @param {string} comment
 * @returns
 */
export const canExpRequestApproval = (requestId: string, comment: string) => {
  return Api.invoke({
    path: '/exp/request/pre-request/cancel-request',
    param: { requestId, comment },
  });
};

export const fetchExpPreRequestReportIds = (
  searchCondition: SearchConditions,
  empId?: string
): Promise<ExpRequestIdsInfo> => {
  return Api.invoke({
    path: '/exp/request/pre-request/id/list',
    param: { searchCondition, empId },
  });
};

export const fetchExpPreRequestReportList = (
  requestIdList: Array<string>,
  empId?: string
): Promise<ExpRequestList> => {
  return Api.invoke({
    path: '/exp/request/pre-request/list',
    param: { requestIdList, empId },
  })
    .then((res: any) => res.requestList)
    .catch((err) => {
      throw err;
    });
};

export const getExpPreRequestReport = (
  requestId?: string,
  empBaseId?: string
): Promise<ExpRequest> => {
  return Api.invoke({
    path: '/exp/request/pre-request/get',
    param: {
      requestId,
      empBaseId,
    },
  })
    .then((res: ExpRequest) => res)
    .catch((err) => {
      throw err;
    });
};

export const discardExpPreRequest = (requestId: string): Promise<void> => {
  return Api.invoke({
    path: '/exp/request/pre-request/discard',
    param: {
      requestId,
    },
  }).catch((err) => {
    throw err;
  });
};
