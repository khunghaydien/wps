import Api from '../../../commons/api';
import { AmountRangeOption } from '../../../commons/components/fields/DropdownAmountRange';
import { DateRangeOption } from '../../../commons/components/fields/DropdownDateRange';

import { ApprovalStatus } from '../approval/request/Status';
import {
  Report,
  requestDateInitVal,
  SearchConditions as CommonConditions,
  status,
} from './Report';

const PAGE_SIZE = 25;

export type RequestIdList = Array<string>;
export type RequestIds = Array<string>;

export const MAX_COST_CENTER_LIMIT = 10000;

export type RequestItem = {
  costCenterName: string;
  departmentCode: string;
  departmentName: string;
  employeeCode: string;
  employeeName: string;
  hasReceipts: boolean;
  photoUrl: string;
  reportNo: string;
  reportTypeName: string;
  requestDate: string;
  requestId: string;
  status: ApprovalStatus | string;
  subject: string;
  totalAmount: number;
};

export type RequestList = Array<RequestItem>;

export type EditHistoryItem = {
  fieldName: string;
  isHeader: boolean;
  modifiedByEmployeeName: string;
  modifiedDateTime: string;
  newValue: string;
  oldValue: string;
  recordSummary: string;
  rowNo: number;
};

export type EditHistoryList = Array<EditHistoryItem>;

// eslint-disable-next-line import/prefer-default-export
export const initialStateRequestItem = {
  totalAmount: 0,
  subject: '',
  status: '',
  requestId: '',
  requestDate: '',
  reportNo: '',
  photoUrl: '',
  hasReceipts: false,
  employeeName: '',
  employeeCode: '',
  departmentName: '',
  departmentCode: '',
  reportTypeName: '',
  costCenterName: '',
};

export type SortBy =
  | ''
  | 'ReportNo' // 申請番号
  | 'Status' // ステータス
  | 'RequestDate' // 申請日付
  | 'Subject' // 件名
  | 'TotalAmount' // 金額
  | 'EmployeeCode' // 社員コード
  | 'EmployeeName' // 社員名
  | 'DepartmentCode' // 部署コード
  | 'DepartmentName'; // 部署名

export const SORT_BY = {
  ReportNo: 'ReportNo', // 申請番号
  Status: 'Status', // /ステータス
  RequestDate: 'RequestDate', // 申請日付
  Subject: 'Subject', // 件名
  TotalAmount: 'TotalAmount', // 金額
  EmployeeCode: 'EmployeeCode', // 社員コード
  EmployeeName: 'EmployeeName', // 社員名
  DepartmentCode: 'DepartmentCode', // 部署コード
  DepartmentName: 'DepartmentName', // 部署名
};

export type OrderBy = '' | 'Asc' | 'Desc';

export const ORDER_BY = {
  Asc: 'Asc',
  Desc: 'Desc',
};

export const receiptOption = [{ label: 'hasReceipt', value: 'hasReceipt' }];

export type selectedOption = {
  item: string;
  value: string;
};

export const AmountRangeOptionInitVal: AmountRangeOption = {
  minAmount: null,
  maxAmount: null,
};

export const accountingDateInitVal: DateRangeOption = {
  startDate: null,
  endDate: null,
};

export type SearchConditions = CommonConditions & {
  companyIdList: Array<string>;
  name?: string;
};

export const financeStatusListInitParam = [status.APPROVED];

export const financeStatusListAllParam = [
  status.APPROVED,
  status.ACCOUNTING_AUTHORIZED,
  status.ACCOUNTING_REJECTED,
  status.JOURNAL_CREATED,
  status.FULLY_PAID,
];

export function searchConditionInitValue() {
  return {
    // name: msg().Exp_Lbl_SearchConditionApprovelreRuestList,
    name: '',
    financeStatusList: financeStatusListInitParam,
    departmentBaseIds: [],
    empBaseIds: [],
    // expTypeIds: Array<?string>,
    reportNo: null,
    amountRange: AmountRangeOptionInitVal,
    requestDateRange: requestDateInitVal(),
    accountingDateRange: accountingDateInitVal,
    reportTypeIds: [],
    costCenterBaseIds: [],
    detail: [],
    companyIdList: [],
    subject: '',
    vendorIds: [],
  };
}

export type FinanceApprovalRequestIds = {
  requestIdList: RequestIdList;
  totalSize: number;
};

export const getRequestIdList = (
  companyId: string,
  sortBy?: SortBy,
  order?: OrderBy,
  advSearchConditions?: SearchConditions
): Promise<FinanceApprovalRequestIds> => {
  let financeStatusList;
  if (advSearchConditions) {
    if (
      advSearchConditions.financeStatusList &&
      advSearchConditions.financeStatusList.length > 0
    ) {
      financeStatusList = advSearchConditions.financeStatusList;
    } else {
      financeStatusList = financeStatusListAllParam;
    }
  } else {
    financeStatusList = financeStatusListInitParam;
  }
  return Api.invoke({
    path: '/exp/finance-approval/request-id/list',
    param: {
      sortBy,
      order,
      searchFilter: {
        financeStatusList,
        departmentBaseIds: advSearchConditions
          ? advSearchConditions.departmentBaseIds
          : null,
        empBaseIds: advSearchConditions ? advSearchConditions.empBaseIds : null,
        requestDateRange: advSearchConditions
          ? advSearchConditions.requestDateRange
          : requestDateInitVal(),
        accountingDateRange: advSearchConditions
          ? advSearchConditions.accountingDateRange
          : null,
        amountRange: advSearchConditions
          ? advSearchConditions.amountRange
          : null,
        reportNo: advSearchConditions ? advSearchConditions.reportNo : null,
        reportTypeIds: advSearchConditions
          ? advSearchConditions.reportTypeIds
          : null,
        costCenterBaseIds: advSearchConditions
          ? advSearchConditions.costCenterBaseIds
          : null,
        vendorIds: advSearchConditions ? advSearchConditions.vendorIds : [],
        subject: advSearchConditions ? advSearchConditions.subject : '',
        companyIdList: companyId ? [companyId] : null,
        includeChildCostCenters: true,
      },
    },
  }).then((response: FinanceApprovalRequestIds) => response);
};

/**
 * Get list by requestIds
 *
 * @param {RequestIds} requestIds
 * @returns {Promise<RequestList>}
 */
export const getRequestList = (
  requestIds?: RequestIds
): Promise<RequestList> => {
  const param = requestIds
    ? { requestIds }
    : {
        getByNumberOfReports: PAGE_SIZE,
        searchFilter: {
          financeStatusList: financeStatusListInitParam,
          requestDateRange: requestDateInitVal(),
        },
      };
  return Api.invoke({
    path: '/exp/finance-approval/report/list',
    param,
  }).then((response: { requestList: RequestList }) => response.requestList);
};

/**
 * Get by id
 *
 * @param {?string} [requestId]
 * @returns {Promise<RequestItem>}
 */
export const getRequestItem = (requestId?: string): Promise<RequestItem> => {
  return Api.invoke({
    path: '/exp/finance-approval/report/get',
    param: {
      requestId,
      usedIn: 'REPORT',
    },
  }).then((response: RequestItem) => response);
};

export const getEditHistory = (requestId: string): Promise<EditHistoryList> => {
  return Api.invoke({
    path: '/exp/finance-approval/report/history/get',
    param: {
      requestId,
    },
  }).then(
    (response: { modificationList: EditHistoryList }) =>
      response.modificationList
  );
};

export const reject = (requestIds: string[], comment: string): Promise<any> => {
  return Api.invoke({
    path: '/exp/finance-approval/report/reject',
    param: {
      requestIds,
      comment,
    },
  }).then((response: any) => response);
};

export const approve = (
  requestIds: string[],
  comment: string
): Promise<any> => {
  return Api.invoke({
    path: '/exp/finance-approval/report/approve',
    param: {
      requestIds,
      comment,
    },
  }).then((response: any) => response);
};

export const save = (report: Report): Promise<Report> => {
  // remove records for better API performance.
  const reportCopy = Object.assign({}, report);
  delete reportCopy.records;

  return Api.invoke({
    path: '/exp/finance-approval/report/save',
    param: reportCopy,
  }).then((response: any) => response);
};
