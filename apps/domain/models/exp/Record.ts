import Decimal from 'decimal.js';
import { cloneDeep, get } from 'lodash';

import Api from '../../../commons/api';

import { ExtendedItemExpectedList, getEIsOnly } from './ExtendedItem';
import { FOREIGN_CURRENCY_USAGE } from './foreign-currency/Currency';
import { RouteItem } from './jorudan/Route';
import { StationInfo } from './jorudan/Station';
import { MERCHANT_USAGE } from './Merchant';
import { OcrInfo } from './Receipt';
import { AmountInputMode, AmountInputModeType } from './TaxType';

export type currencyInfo = {
  code: string;
  decimalPlaces: number;
  name: string;
  symbol: string;
};

export const NEW_RECORD_OPTIONS = {
  MANUAL: 'manualRecord',
  OCR_RECORD: 'ocrRecord',
  CREDIT_CARD: 'creditCardRecord',
  IC_CARD: 'icCardRecord',
  RECORD_LIST: 'recordList',
};

export const CLONE_RECORD_OPTIONS = {
  SINGLE_CLONE: 'singleClone',
  MULTIPLE_CLONE: 'multipleClone',
  SPECIFIED_CLONE: 'specifiedClone',
};

// 内訳
export type RecordItem = ExtendedItemExpectedList & {
  amount: number;
  costCenterCode?: string;
  costCenterHistoryId?: string;
  costCenterName?: string;
  currencyId?: string;
  currencyInfo: currencyInfo;
  exchangeRate: number;
  exchangeRateManual: boolean;
  expTypeDescription?: string;
  expTypeId: string;
  expTypeName: string;
  fixedAllowanceOptionId: string | null;
  fixedAllowanceOptionLabel: string | null;
  fixedForeignCurrencyId: string;
  gstVat: number;
  itemId?: string | null;
  jctInvoiceOption?: string;
  jctRegistrationNumber?: string;
  jobCode?: string;
  jobId?: string;
  jobName?: string;
  localAmount: number;
  merchant?: string; // user input merchant
  ocrMerchant?: string; // original ocr data
  originalExchangeRate: number;
  recordDate: string;
  remarks: string;
  taxManual: boolean;
  taxRate?: number;
  taxTypeBaseId: string;
  taxTypeHistoryId: string;
  taxTypeName?: string;
  useFixedForeignCurrency: boolean;
  useForeignCurrency: boolean;
  withoutTax: number;
}; // 経費内訳ID // 費目ID // 費目名 // 税込金額 // 摘要

export type ViaList = Array<StationInfo | null>;
// export type ViaList = Array<any>;

export const MAX_LENGTH_VIA_LIST = 4;

export type RouteInfo = {
  arrival?: StationInfo;
  origin?: StationInfo;
  roundTrip: boolean;
  selectedRoute?: RouteItem;
  viaList: ViaList;
};

export const RECORD_TYPE = {
  General: 'General',
  TransitJorudanJP: 'TransitJorudanJP',
  TransportICCardJP: 'TransportICCardJP',
  HotelFee: 'HotelFee',
  FixedAllowanceSingle: 'FixedAllowanceSingle',
  FixedAllowanceMulti: 'FixedAllowanceMulti',
};

// record types category used for exp type fetching
export const RECORD_TYPE_CATEGORY = {
  all: 'all', // MOBILE_SUPPORTED_GENERAL_RECORD_TYPES + jorudan
  noJorudan: 'no-jorudan', // MOBILE_SUPPORTED_GENERAL_RECORD_TYPES
};

export const isValidRecordType = (recordType: string) =>
  !!RECORD_TYPE[recordType];

export const RECEIPT_TYPE = {
  Optional: 'Optional',
  Required: 'Required',
  NotUsed: 'NotUsed',
};

export const MERCHANT_TYPE = {
  Optional: 'Optional',
  Required: 'Required',
  NotUsed: 'NotUsed',
};

export const JCT_REGISTRATION_NUMBER_TYPE = {
  Optional: 'Optional',
  Required: 'Required',
  NotUsed: 'NotUsed',
};

export type RecordType =
  | 'General'
  | 'TransitJorudanJP'
  | 'TransportICCardJP'
  | 'HotelFee'
  | 'FixedAllowanceSingle'
  | 'FixedAllowanceMulti';

export type ReceiptType = 'Optional' | 'Required' | 'NotUsed';

export type transitIcRecordInfo = {
  category?: string;
  route: string;
};

export type Record = {
  amount: number;
  amountInputMode: AmountInputModeType;
  creditCardTransactionId?: string; // 利用日
  currencyName: string;
  empId?: string;
  fileAttachment: string;
  // 通貨名
  items: Array<RecordItem>;
  jctRegistrationNumberUsage?: string;
  merchantUsage: string;
  ocrAmount: number;
  ocrDate?: string;
  // 摘要
  order?: number;
  receiptCreatedDate?: string;
  receiptDataType?: string;
  receiptFileId?: string;
  receiptId?: string;
  receiptTitle?: string;
  // 明細ID
  recordDate: string;
  recordId?: string;
  // 内訳
  recordType: string;
  // 税込金額
  remarks?: string;
  // for saving single record, we need report/requestId to link it with its parent Report
  reportId?: string;
  requestId?: string;
  routeInfo?: RouteInfo;
  transitIcCardNo?: string;
  transitIcRecordId?: string;
  transitIcRecordInfo?: transitIcRecordInfo;
  // 並び順
  withoutTax: number;
}; // 明細ID // 利用日 // 通貨名 // 内訳 // 税込金額 // 摘要 // 並び順

export type RecordUpdateInfo = {
  expenseTypeName: string;
  isForeignCurrency: string;
  recordDate: string;
};

export type RecordUpdateInfoList = Array<RecordUpdateInfo>;

export const newRouteInfo = {
  roundTrip: false,
  origin: null,
  viaList: [],
  arrival: null,
  selectedRoute: null,
};

const newIcTransitInfo = {
  category: null,
  route: '',
};

export const isIcRecord = (recordType: string) =>
  recordType === RECORD_TYPE.TransportICCardJP;

export const isCCRecord = (record: Record) => !!record.creditCardTransactionId;

export const newRecordItem = (
  expTypeId: string,
  expTypeName: string,
  useForeignCurrency: boolean,
  expType: any,
  initTaxTypeBaseIdIsBlank: boolean,
  fixedForeignCurrencyId?: string,
  foreignCurrencyUsage?: string,
  amount = 0,
  recordDate?: string
) => ({
  itemId: null,
  expTypeName, // 費目名
  expTypeId, // 費目ID
  useForeignCurrency,
  amount, // 税込金額
  remarks: '', // 摘要
  withoutTax: 0,
  taxManual: false,
  gstVat: 0,
  taxTypeBaseId: initTaxTypeBaseIdIsBlank ? '' : 'noIdSelected',
  taxTypeHistoryId: '',
  taxTypeName: '',
  currencyId: null,
  localAmount: 0,
  exchangeRate: 0,
  originalExchangeRate: 0,
  exchangeRateManual: false,
  fixedAllowanceOptionId: null,
  fixedAllowanceOptionLabel: null,
  recordDate,
  merchant: null,
  currencyInfo: {
    code: '',
    decimalPlaces: 0,
    name: '',
    symbol: '',
  },
  useFixedForeignCurrency:
    foreignCurrencyUsage === FOREIGN_CURRENCY_USAGE.Fixed,
  fixedForeignCurrencyId,
  jctInvoiceOption: null,
  jctRegistrationNumber: null,
  ...getEIsOnly(expType),
});

export const newRecord = (
  expTypeId = '',
  expTypeName = '',
  recordType = '',
  useForeignCurrency = false,
  item: any = null,
  initTaxTypeBaseIdIsBlank = false,
  fileAttachment = '',
  fixedForeignCurrencyId = '',
  foreignCurrencyUsage: string = FOREIGN_CURRENCY_USAGE.NotUsed,
  amount = 0,
  recordDate = '',
  ocrAmount = null,
  ocrDate: string | null = null,
  receiptId: string | null = null,
  receiptFileId: string | null = null,
  receiptDataType: string | null = null,
  receiptTitle: string | null = null,
  receiptCreatedDate: string | null = null,
  merchantUsage: string = MERCHANT_USAGE.NotUsed
) => ({
  recordId: null,
  recordDate,
  currencyName: 'JPY', // 通貨名
  items: [
    newRecordItem(
      expTypeId,
      expTypeName,
      useForeignCurrency,
      item,
      initTaxTypeBaseIdIsBlank,
      fixedForeignCurrencyId,
      foreignCurrencyUsage,
      amount,
      recordDate
    ),
  ], // 内訳
  remarks: '', // 摘要
  creditCardTransactionId: null,
  routeInfo: recordType === 'TransitJorudanJP' ? newRouteInfo : null,
  recordType, // 明細種別
  fileAttachment,
  merchantUsage,
  amount, // 税込金額
  amountInputMode: AmountInputMode.TaxIncluded,
  withoutTax: 0,
  receiptId,
  receiptFileId,
  receiptDataType,
  receiptTitle,
  receiptCreatedDate,
  transitIcCardNo: null,
  transitIcRecordId: null,
  transitIcRecordInfo: isIcRecord(recordType) ? newIcTransitInfo : null,
  ocrAmount,
  ocrDate,
  reportId: '',
});

export const newRecordTouched = {
  recordId: false, // 明細ID
  recordDate: false,
  expTypeId: false, // 費目ID
  amount: false, // 税込金額
  remarks: false, // 摘要
  taxTypeBaseId: false,
  taxTypeHistoryId: false,
  withoutTax: false,
  gstVat: false,
  taxManual: false,
};

export const newRecordItemTouched = {
  amount: false,
  remarks: false,
  withoutTax: false,
};

/**
 * Check if record can be itemized
 *
 * @param {string} recordType
 * @param {boolean} [isChildRecord]
 * @returns
 */
export const isRecordItemized = (
  recordType: string,
  isChildRecord?: boolean
) => {
  return recordType === 'HotelFee' && !isChildRecord;
};

export const isFixedAllowanceSingle = (recordType: string) =>
  recordType === RECORD_TYPE.FixedAllowanceSingle;

export const isFixedAllowanceMulti = (recordType: string) =>
  recordType === RECORD_TYPE.FixedAllowanceMulti;

export const isHotelFee = (recordType: string) =>
  recordType === RECORD_TYPE.HotelFee;

/**
 * Calculate total for array items
 *
 * @param {Array<any>} items
 * @param {string} key
 * @param {number} [decimalPlaces=6]
 * @returns {number}
 */
export const calcItemsTotalAmount = (
  items: Array<any>,
  key: string,
  decimalPlaces = 6
): number => {
  const totalAmount: Decimal = items.reduce(
    (total: Decimal, item): Decimal => Decimal.add(total, get(item, key) || 0),
    new Decimal(0)
  );
  return Number(totalAmount.toFixed(decimalPlaces, Decimal.ROUND_DOWN));
};

export const isAmountMatch = (
  amountA: string | number,
  amountB: string | number
) => {
  return new Decimal(amountA).equals(amountB);
};

export type RecordSaveResponseType = {
  recordId: string;
  updatedReportAmount: number;
};

export type RecordListSaveResponseType = {
  recordIds: string[];
  updatedReportAmount: number;
};

export const saveRecord = (
  values: Record,
  reportId?: string,
  reportTypeId?: string,
  empId?: string
): Promise<RecordSaveResponseType> => {
  const record = cloneDeep(values);
  if (!record.reportId) {
    record.reportId = reportId;
  }

  return Api.invoke({
    path: '/exp/report/record/save',
    param: { ...record, reportTypeId, empId },
  }).then((response: any) => response);
};

export type LinkRecordResponse = {
  recordId: string;
  updatedReportAmount: number;
};

/**
 * Save multiple records
 *
 * @param {Array<Record>} records
 * @param {string} [reportId]
 * @param {string} [reportTypeId]
 */
export const saveRecordList = (
  records: Record[],
  reportId?: string,
  reportTypeId?: string
): Promise<RecordListSaveResponseType> => {
  return Api.invoke({
    path: '/exp/report/record/save-list',
    param: { records, reportId, reportTypeId },
  }).then((response: RecordListSaveResponseType) => {
    return response;
  });
};

export const savePreRequestRecord = (
  values: Record,
  reportId: string | undefined,
  reportTypeId: string,
  empId: string
): Promise<any> => {
  const record = cloneDeep(values);
  record.requestId = reportId;
  return Api.invoke({
    path: '/exp/pre-request/record/save',
    param: { ...record, reportTypeId, empId },
  }).then((response: any) => response);
};

export const saveFARecord = (
  values: Record,
  reportId: string | undefined,
  requestId: string | undefined,
  reportTypeId: string,
  empId: string
): Promise<any> => {
  const record = cloneDeep(values);
  record.reportId = reportId;
  record.requestId = requestId;

  return Api.invoke({
    path: '/exp/finance-approval/record/save',
    param: { ...record, reportTypeId, empId },
  }).then((response: any) => response);
};

export const deleteRecord = (
  recordIds: Array<string>,
  empId?: string
): Promise<any> => {
  return Api.invoke({
    path: '/exp/report/record/delete',
    param: {
      recordIds,
      empId,
    },
  }).then((response: any) => response);
};

export const deletePreRequestRecord = (
  recordIds: Array<string>
): Promise<any> => {
  return Api.invoke({
    path: '/exp/pre-request/record/delete',
    param: {
      recordIds,
    },
  }).then((response: any) => response);
};

/**
 * Get record list, currently only used by mobile
 *
 * @param {string} [empId='']
 * @param {?Array<string>} expTypeIdList
 * @param {?string} startDate
 * @param {?string} endDate
 * @returns {Promise<Object>}
 */
export const getRecordList = (
  empId = '',
  expTypeIdList?: Array<string>,
  startDate?: string,
  endDate?: string
) => {
  return Api.invoke({
    path: '/exp/report/record/list',
    param: {
      empId,
      expTypeIdList,
      startDate,
      endDate,
    },
  });
};

export const uploadReceipt = (
  fileName: string,
  fileBody: ArrayBuffer
): Promise<any> => {
  return Api.invoke({
    path: '/exp/receipt/save',
    param: {
      fileName,
      fileBody,
      type: 'Receipt',
    },
  });
};

export type RecordCloneResponseType = {
  recordIds: Array<string>;
  updatedRecords: RecordUpdateInfoList;
};

export const cloneRecord = (
  recordIds: Array<string>,
  targetDates?: Array<string>,
  numberOfDays?: number,
  empId?: string
): Promise<RecordCloneResponseType> => {
  return Api.invoke({
    path: '/exp/report/record/clone',
    param: {
      recordIds,
      targetDates,
      numberOfDays,
      empId,
    },
  });
};

export const clonePreRequestRecord = (
  recordIds: Array<string>,
  targetDates: Array<string>,
  numberOfDays: number,
  empId: string
): Promise<any> => {
  return Api.invoke({
    path: '/exp/pre-request/record/clone',
    param: {
      recordIds,
      targetDates,
      numberOfDays,
      empId,
    },
  });
};

export const OCR_RECORD_MAX = 10;

export const getOriginalOCRInfo = (originalOCR: OcrInfo, isMobile = false) => {
  /*
   * OCR record: ocrAmount = 0, ocrDate = '' if no scanned result
   * Normal record: ocrAmount = null, ocrDate = null
   */

  if (isMobile) {
    const { amount, recordDate, merchant, jctRegistrationNumber } =
      originalOCR || {};

    return {
      originalOCRAmount: amount || 0,
      originalOCRDate: recordDate || '',
      originalOCRMerchant: merchant || '',
      originalOCRJctRegistrationNumber: jctRegistrationNumber || '',
    };
  }

  const originalOCRAmount =
    originalOCR && (get(originalOCR, 'result.amount') || 0);
  const originalOCRDate =
    originalOCR && (get(originalOCR, 'result.recordDate') || '');
  const originalOCRMerchant =
    originalOCR && (get(originalOCR, 'result.merchant') || '');
  const originalOCRJctRegistrationNumber =
    originalOCR && (get(originalOCR, 'result.jctRegistrationNumber') || '');

  return {
    originalOCRAmount,
    originalOCRDate,
    originalOCRMerchant,
    originalOCRJctRegistrationNumber,
  };
};
