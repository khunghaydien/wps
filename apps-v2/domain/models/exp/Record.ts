import Decimal from 'decimal.js';
import { cloneDeep, get } from 'lodash';

import Api from '../../../commons/api';

import { ExtendedItemExpectedList, getEIsOnly } from './ExtendedItem';
import { FOREIGN_CURRENCY_USAGE } from './foreign-currency/Currency';
import { RouteItem } from './jorudan/Route';
import { StationInfo } from './jorudan/Station';
import { MERCHANT_USAGE } from './Merchant';
import { MileageDestinationInfo } from './Mileage';
import { OcrInfo } from './Receipt';
import {
  AmountInputMode,
  AmountInputModeType,
  calcAmountFromTaxExcluded,
  calcTaxFromGstVat,
  calculateTax,
} from './TaxType';

export const BULK_EDIT_UPLOAD_LOADING_AREA = 'UploadArea';

export const BULK_EDIT_GRID_BODY_LOADING_AREA = 'GridBody';

export type currencyInfo = {
  code: string;
  decimalPlaces: number;
  name: string;
  symbol: string;
};

// Multiple Tax Start
export type TaxItem = {
  amount: number;
  gstVat: number;
  taxManual: boolean;
  taxRate?: number;
  taxTypeBaseId: string;
  taxTypeHistoryId: string;
  taxTypeName?: string;
  withoutTax: number;
};

export type TaxItems = TaxItem[];
// Multiple Tax End

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
  allowNegativeAmount?: boolean;
  amount: number;
  amountPayable?: number;
  costCenterCode?: string;
  costCenterHistoryId?: string;
  costCenterName?: string;
  currencyId?: string;
  currencyInfo: currencyInfo;
  exchangeRate: number;
  exchangeRateManual: boolean;
  expTypeDescription?: string;
  expTypeId: string;
  expTypeItemizationSetting?: string;
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
  // Mileage Related Information
  mileageDistance?: number;
  mileageRate?: number;
  mileageRateBaseId?: string;
  mileageRateHistoryId?: string;
  mileageRateName?: string;
  ocrMerchant?: string; // original ocr data
  originalExchangeRate: number;
  paymentDueDate?: string;
  paymentDueDateUsage?: string;
  recordDate: string;
  remarks: string;
  taxItems?: TaxItems;
  taxManual: boolean;
  taxRate?: number;
  taxTypeBaseId: string;
  taxTypeHistoryId: string;
  taxTypeName?: string;
  tempUUID?: string; // used by FE
  useFixedForeignCurrency: boolean;
  useForeignCurrency: boolean;
  vendorCode?: string;
  vendorId?: string;
  vendorIsJctQualifiedIssuer?: boolean;
  vendorJctRegistrationNumber?: string;
  vendorName?: string;
  withholdingTaxAmount?: number;
  withoutTax: number;
}; // 経費内訳ID // 費目ID // 費目名 // 税込金額 // 摘要

export type ViaList = Array<StationInfo | null>;
// export type ViaList = Array<any>;

export const MAX_LENGTH_VIA_LIST = 4;

export const MAX_BULK_EDIT_RECORDS = 30;

export type RouteInfo = {
  arrival?: StationInfo;
  origin?: StationInfo;
  roundTrip?: boolean;
  selectedRoute?: RouteItem;
  viaList?: ViaList;
};

export type MileageRouteInfo = {
  destinations: Array<MileageDestinationInfo>;
  estimatedDistance?: number;
};

export const RECORD_TYPE = {
  General: 'General',
  TransitJorudanJP: 'TransitJorudanJP',
  TransportICCardJP: 'TransportICCardJP',
  FixedAllowanceSingle: 'FixedAllowanceSingle',
  FixedAllowanceMulti: 'FixedAllowanceMulti',
  Mileage: 'Mileage',
};

// record types category used for exp type fetching
export const RECORD_TYPE_CATEGORY = {
  all: 'all', // MOBILE_SUPPORTED_GENERAL_RECORD_TYPES + jorudan
  noJorudan: 'no-jorudan', // MOBILE_SUPPORTED_GENERAL_RECORD_TYPES
};

export const isValidRecordType = (recordType: string) =>
  !!RECORD_TYPE[recordType];

export const getCCExcludedRecordTypes = () =>
  Object.keys(RECORD_TYPE).filter(
    (recordType) => recordType !== RECORD_TYPE.General
  );

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

export const WITHHOLDING_TAX_TYPE = {
  Optional: 'Optional',
  Required: 'Required',
  NotUsed: 'NotUsed',
};

export const ITEMIZATION_SETTING_TYPE = {
  Optional: 'Optional',
  Required: 'Required',
  NotUsed: 'NotUsed',
} as const;

export type ItemizationSetting = keyof typeof ITEMIZATION_SETTING_TYPE;

export const JCT_REGISTRATION_NUMBER_TYPE = {
  Optional: 'Optional',
  Required: 'Required',
  NotUsed: 'NotUsed',
};

export const isWithholdingTaxUsageRequired = (
  withholdingTaxUsage: string
): boolean => withholdingTaxUsage === WITHHOLDING_TAX_TYPE.Required;

export const isUseWithholdingTax = (withholdingTaxUsage: string): boolean =>
  isWithholdingTaxUsageRequired(withholdingTaxUsage) ||
  withholdingTaxUsage === WITHHOLDING_TAX_TYPE.Optional;

export type RecordType =
  | 'General'
  | 'TransitJorudanJP'
  | 'TransportICCardJP'
  | 'FixedAllowanceSingle'
  | 'FixedAllowanceMulti'
  | 'Mileage';

export type ReceiptType = 'Optional' | 'Required' | 'NotUsed';

export type transitIcRecordInfo = {
  category?: string;
  route: string;
};

export type Receipt = {
  receiptCreatedDate?: string;
  receiptDataType?: string;
  receiptFileExtension?: string;
  receiptFileId?: string;
  receiptId?: string;
  receiptTitle?: string;
};

export type Record = {
  amount: number;
  amountInputMode: AmountInputModeType;
  amountPayable?: number;
  creditCardAssociation?: string;
  creditCardNo?: string;
  creditCardTransactionId?: string;
  // 利用日
  currencyName: string;
  empHistoryId?: string;
  empId?: string;
  expPreRequestRecordId?: string;
  fileAttachment: string;
  // 通貨名
  items: Array<RecordItem>;
  jctRegistrationNumberUsage?: string;
  merchantUsage: string;
  // Mileage Route Info
  mileageRouteInfo?: MileageRouteInfo;
  ocrAmount: number;
  ocrDate?: string;
  // 摘要
  order?: number;
  paymentMethodId: string | null;
  paymentMethodName?: string;
  paymentMethodNameL?: string;
  receiptCreatedDate?: string;
  receiptDataType?: string;
  receiptFileId?: string;
  // To support older clients with older structure in approvals module, we still keep the flat receipt properties
  receiptId?: string;
  receiptList?: Array<Receipt>;
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
  transitIcCardName?: string;
  transitIcCardNo?: string;
  transitIcRecordId?: string;
  transitIcRecordInfo?: transitIcRecordInfo;
  useCashAdvance?: boolean;
  withholdingTaxAmount?: number;
  withholdingTaxUsage?: string;
  // 並び順
  withoutTax: number;
}; // 明細ID // 利用日 // 通貨名 // 内訳 // 税込金額 // 摘要 // 並び順

export type RecordUpdateInfo = {
  expenseTypeName: string;
  isForeignCurrency: string;
  recordDate: string;
  recordType?: keyof typeof RECORD_TYPE;
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
  recordDate?: string,
  expTypeItemizationSetting: ItemizationSetting = ITEMIZATION_SETTING_TYPE.NotUsed
) => ({
  itemId: null,
  expTypeItemizationSetting,
  expTypeName, // 費目名
  expTypeId, // 費目ID
  useForeignCurrency,
  amount, // 税込金額
  amountPayable: 0,
  remarks: '', // 摘要
  withoutTax: 0,
  taxManual: false,
  gstVat: 0,
  taxTypeBaseId: initTaxTypeBaseIdIsBlank ? '' : 'noIdSelected',
  taxTypeHistoryId: '',
  taxTypeName: '',
  taxRate: null,
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
  withholdingTaxAmount: 0,
  mileageRateHistoryId: undefined,
  mileageDistance: 0,
  jctInvoiceOption: null,
  jctRegistrationNumber: null,
  vendorId: null,
  vendorName: null,
  vendorCode: null,
  paymentDueDate: null,
  allowNegativeAmount: false,
  ...getEIsOnly(expType),
  // multiple tax
  taxItems: expType?.taxItems,
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
  merchantUsage: string = MERCHANT_USAGE.NotUsed,
  withholdingTaxUsage: string = WITHHOLDING_TAX_TYPE.NotUsed,
  receiptList: Array<Receipt> = [],
  creditCardAssociation: string = null,
  creditCardNo: string = null,
  transitIcCardName: string = null,
  paymentMethodId: string | null = null
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
      recordDate,
      item?.itemizationSetting
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
  paymentMethodId,
  receiptList,
  transitIcCardNo: null,
  transitIcRecordId: null,
  transitIcRecordInfo: isIcRecord(recordType) ? newIcTransitInfo : null,
  ocrAmount,
  ocrDate,
  reportId: '',
  withholdingTaxUsage,
  creditCardAssociation,
  creditCardNo,
  transitIcCardName,
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

export const isFixedAllowanceSingle = (recordType: string) =>
  recordType === RECORD_TYPE.FixedAllowanceSingle;

export const isFixedAllowanceMulti = (recordType: string) =>
  recordType === RECORD_TYPE.FixedAllowanceMulti;

export const isMileageRecord = (recordType: string) =>
  recordType === RECORD_TYPE.Mileage;

export const isJorudanRecord = (recordType: string) =>
  recordType === RECORD_TYPE.TransitJorudanJP;

export const isGeneralRecord = (recordType: string) =>
  recordType === RECORD_TYPE.General;

export const isItemizedRecord = (itemCount = 0) => itemCount > 1;

/**
 * Determine if amount/tax calculation is necessary and
 * hide certain fields e.g. tax / exchange rate
 * @param itemizationSetting
 * @param itemCount
 * @returns {boolean}
 */
export const isRequiredOrItemizedRecord = (
  itemizationSetting: ItemizationSetting | string,
  itemCount = 0
) => itemizationSetting === ITEMIZATION_SETTING_TYPE.Required || itemCount > 1;

export const isShowItemizationTab = (itemizationSetting = '') => {
  const itemizationSettingList: readonly string[] = [
    ITEMIZATION_SETTING_TYPE.Optional,
    ITEMIZATION_SETTING_TYPE.Required,
  ];
  return itemizationSettingList.includes(itemizationSetting);
};

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
  empId?: string,
  empHistoryId?: string
): Promise<RecordSaveResponseType> => {
  const record = cloneDeep(values);
  if (!record.reportId) {
    record.reportId = reportId;
  }

  return Api.invoke({
    path: '/exp/report/record/save',
    param: { ...record, reportTypeId, empId, empHistoryId },
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
  empId: string,
  empHistoryId?: string
): Promise<any> => {
  const record = cloneDeep(values);
  record.requestId = reportId;
  return Api.invoke({
    path: '/exp/pre-request/record/save',
    param: { ...record, reportTypeId, empId, empHistoryId },
  }).then((response: any) => response);
};

/**
 * Save multiple request records
 *
 * @param {Array<Record>} records
 * @param {string} [reportId]
 * @param {string} [reportTypeId]
 */
export const savePreRrequestRecordList = (
  records: Record[],
  reportId?: string,
  reportTypeId?: string
): Promise<RecordListSaveResponseType> => {
  return Api.invoke({
    path: '/exp/pre-request/record/save-list',
    param: { records, requestId: reportId, reportTypeId },
  }).then((response: RecordListSaveResponseType) => {
    return response;
  });
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

export const saveFAPreRequestRecord = (
  values: Record,
  reportId: string,
  requestId: string,
  reportTypeId: string,
  empId: string
): Promise<Record> => {
  const record = cloneDeep(values);
  record.requestId = reportId;
  const requestApprovalId = requestId;

  return Api.invoke({
    path: '/exp/finance-approval/request-record/save',
    param: { ...record, reportTypeId, empId, requestApprovalId },
  }).then((response: Record) => response);
};

export const deleteRecord = (
  recordIds: Array<string>,
  empId?: string,
  useCashAdvance?: boolean
): Promise<any> => {
  return Api.invoke({
    path: '/exp/report/record/delete',
    param: {
      recordIds,
      empId,
      useCashAdvance,
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
  empId?: string,
  useCashAdvance?: boolean
): Promise<RecordCloneResponseType> => {
  return Api.invoke({
    path: '/exp/report/record/clone',
    param: {
      recordIds,
      targetDates,
      numberOfDays,
      empId,
      useCashAdvance,
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

/**
 * Calculate amount payable for tax withholding
 * Amount (incl. Tax) - Withholding Tax Amount = Amount Payable
 *
 * @param {number} amount
 * @param {number} decimalPlaces
 * @param {number} withholdingAmount
 * @returns {number} amountPayable
 */
export const calculateAmountPayable = (
  amount: number,
  decimalPlaces: number,
  withholdingAmount?: number
): number => {
  const amountPayable = Decimal.sub(
    amount,
    Math.abs(withholdingAmount) || 0
  ).toFixed(decimalPlaces, Decimal.ROUND_DOWN);
  return Number(amountPayable);
};

/**
 * Calculate amount (incl. tax) for tax withholding credit card transaction
 * Amount Payable + Withholding Tax Amount =  Amount (incl. Tax)
 *
 * @param {number} amount
 * @param {number} decimalPlaces
 * @param {number} withholdingTaxAmount
 * @returns {number} amount
 */
export const calculateAmountForCCTrans = (
  amount: number,
  decimalPlaces: number,
  withholdingTaxAmount?: number
): number => {
  const newAmount = Decimal.add(
    amount,
    Math.abs(withholdingTaxAmount) || 0
  ).toFixed(decimalPlaces, Decimal.ROUND_DOWN);
  return Number(newAmount);
};

export const OCR_RECORD_MAX = 10;
export const RECORD_ATTACHMENT_MAX_COUNT = 3;

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

// calculates taxes total amount incl and excl
export const calculateTotalTaxes = (
  updatedTaxItems: TaxItems,
  decimalPlaces: number
) => {
  const { totalAmountInclTax, totalAmountExclTax, totalGstVat } =
    updatedTaxItems.reduce(
      (acc, { amount, withoutTax, gstVat }) => ({
        ...acc,
        totalAmountInclTax: Decimal.add(amount, acc.totalAmountInclTax),
        totalAmountExclTax: Decimal.add(withoutTax, acc.totalAmountExclTax),
        totalGstVat: Decimal.add(gstVat, acc.totalGstVat),
      }),
      {
        totalAmountInclTax: new Decimal(0),
        totalAmountExclTax: new Decimal(0),
        totalGstVat: new Decimal(0),
      }
    );

  return {
    totalAmountInclTax: Number(
      totalAmountInclTax.toFixed(decimalPlaces, Decimal.ROUND_DOWN)
    ),
    totalAmountExclTax: Number(
      totalAmountExclTax.toFixed(decimalPlaces, Decimal.ROUND_DOWN)
    ),
    totalGstVat: Number(totalGstVat.toFixed(decimalPlaces, Decimal.ROUND_DOWN)),
  };
};

export const updateTaxItemFieldValues = ({
  field,
  value,
  taxItem,
  baseCurrencyDecimal,
  taxRoundingSetting,
  isTaxIncludedMode,
}) => {
  const { taxRate, amount, withoutTax, taxManual } = taxItem;

  // when amount incl tax is amended
  if (field === 'amount') {
    const { gstVat, amountWithoutTax } = calculateTax(
      taxRate,
      value,
      baseCurrencyDecimal,
      taxRoundingSetting
    );

    const withoutTax = (() => {
      if (taxManual) {
        const { amountWithoutTax: withoutTax } = calcTaxFromGstVat(
          gstVat,
          value,
          baseCurrencyDecimal,
          isTaxIncludedMode
        );

        return withoutTax;
      }

      return amountWithoutTax;
    })();

    return {
      ...taxItem,
      amount: value,
      withoutTax,
      gstVat,
      taxManual: false,
    };
  }

  if (field === 'withoutTax') {
    const { gstVat, amountWithTax } = calcAmountFromTaxExcluded(
      taxRate,
      value,
      baseCurrencyDecimal,
      taxRoundingSetting
    );

    const amount = (() => {
      if (taxManual) {
        const { amountWithTax: amount } = calcTaxFromGstVat(
          gstVat,
          value,
          baseCurrencyDecimal,
          isTaxIncludedMode
        );

        return amount;
      }

      return amountWithTax;
    })();

    return {
      ...taxItem,
      amount,
      gstVat,
      withoutTax: value,
      taxManual: false,
    };
  }

  if (field === 'gstVat') {
    let taxAmount = value;
    const baseAmount = isTaxIncludedMode ? amount : withoutTax;

    if (amount * taxAmount < 0) {
      taxAmount = taxAmount * -1;
    }

    const modifiedGstVat = isTaxIncludedMode
      ? baseAmount >= 0
        ? Math.min(baseAmount, taxAmount)
        : Math.max(baseAmount, taxAmount)
      : taxAmount;

    const { amountWithoutTax, amountWithTax } = calcTaxFromGstVat(
      modifiedGstVat,
      baseAmount,
      baseCurrencyDecimal,
      isTaxIncludedMode
    );

    return {
      ...taxItem,
      amount: Number(amountWithTax),
      withoutTax: Number(amountWithoutTax),
      gstVat: modifiedGstVat,
      taxManual: true,
    };
  }

  return false;
};

export const updateTaxItemRates = ({
  taxItems,
  taxTypeList,
  baseCurrencyDecimal,
  taxRoundingSetting,
  isTaxIncludedMode,
}) => {
  const updatedTaxItems = taxTypeList.map(
    (
      {
        baseId: taxTypeBaseId,
        historyId: taxTypeHistoryId,
        name: taxTypeName,
        rate: taxRate,
      },
      index
    ) => {
      const taxItem = taxItems[index];
      const updatedTaxItem = {
        ...taxItem,
        taxTypeBaseId,
        taxTypeHistoryId,
        taxTypeName,
        taxRate,
      };

      if (!taxItem) {
        return {
          amount: 0,
          withoutTax: 0,
          gstVat: 0,
          taxManual: false,
          ...updatedTaxItem,
        };
      }

      const recalcTaxItem = updateTaxItemFieldValues({
        field: taxItem.taxManual
          ? 'gstVat'
          : isTaxIncludedMode
          ? 'amount'
          : 'withoutTax',
        value: taxItem.taxManual
          ? taxItem.gstVat
          : isTaxIncludedMode
          ? taxItem.amount
          : taxItem.withoutTax,
        taxItem: updatedTaxItem,
        baseCurrencyDecimal,
        taxRoundingSetting,
        isTaxIncludedMode,
      });

      return recalcTaxItem;
    }
  );

  return updatedTaxItems;
};
