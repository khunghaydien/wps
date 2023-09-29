import get from 'lodash/get';
import maxBy from 'lodash/maxBy';

import Api from '../../../commons/api';
import msg from '../../../commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';

import { ExpenseType } from '@apps/domain/models/exp/ExpenseType';
import { RoundingType } from '@apps/domain/models/exp/foreign-currency/Currency';
import { newRecord, Record } from '@apps/domain/models/exp/Record';
import {
  calculateTax,
  ExpTaxByDate,
  ExpTaxType,
} from '@apps/domain/models/exp/TaxType';

import { isUseJctNo, JCT_NUMBER_INVOICE } from './JCTNo';

export type IcTransaction = {
  amount: number;
  category?: string;
  entryStationName: string;
  entryStationOperator: string;
  exitStationName: string;
  exitStationOperator: string;
  isHidden: boolean;
  isUsed: boolean;
  paymentDate: string;
  recordId: string;
};

export type IcTransactionWithCardNo = IcTransaction & {
  cardName: string;
  cardNo: string;
};

type IcTransactionsByCard = {
  cardNumber: string;
  records: Array<IcTransaction>;
};

export type IcTransactionsByCards = Array<IcTransactionsByCard>;

export const STATUS_LIST = {
  INCLUDED_ARCHIVED: 'INCLUDED_ARCHIVED',
  INCLUDED_CLAIMED: 'INCLUDED_CLAIMED',
};

export const STATUS_MAP = {
  [STATUS_LIST.INCLUDED_ARCHIVED]: 'Exp_Lbl_IncludeArchived',
  [STATUS_LIST.INCLUDED_CLAIMED]: 'Exp_Lbl_InclClaimed',
};

type IcCard = {
  cancelledDate?: string;
  cardName: string;
  cardNo: string;
  cardOwner: string;
  registeredDate: string;
};

export type IcCards = Array<IcCard>;

export const CATEGORY_MAP = {
  '1': 'Exp_Lbl_TransitCardCategoryRailway',
  '2': 'Exp_Lbl_TransitCardCategoryBus',
  '3': 'Exp_Lbl_TransitCardCategoryProductSales',
  '4': 'Exp_Lbl_TransitCardCategoryRailwayTicketPurchase',
  '5': 'Exp_Lbl_TransitCardCategoryRailwaySuicaGreenTicket',
  '6': 'Exp_Lbl_TransitCardCategoryRailwayGoShinkansenByTouch',
};

export type TransitIcRecordInfo = {
  category?: string;
  route: string;
};

type TransitIcRouteInfo = {
  category?: string;
  entryStationName: string;
  entryStationOperator: string;
  exitStationName: string;
  exitStationOperator: string;
};

/**
 * Default dates for search mobile IC transactions
 *
 * @returns {startDate: string, endDate:string}
 */
export const getMobileInitDates = () => {
  const today = DateUtil.getToday();
  const dates = {
    startDate: DateUtil.addDays(today, -180),
    endDate: today,
  };
  return dates;
};

/**
 * if multi transaction selected, return the latest date
 */
export const getLatestICDate = (selectedICTransactions: IcTransaction[]) => {
  const latestTrans = maxBy(selectedICTransactions, (trans) => {
    return new Date(trans.paymentDate);
  });
  return latestTrans && latestTrans.paymentDate;
};

/**
 * Get ic info necessary for individual record
 *
 * @returns {recordLevelInfo: {}, itemLevelInfo:{}}
 */
export const getICTransInfo = (transaction: IcTransactionWithCardNo) => {
  const {
    cardName,
    cardNo,
    recordId,
    category,
    paymentDate: recordDate,
    amount,
  } = transaction;
  const route = getRouteInfo(transaction);
  const transitIcRecordInfo = {
    category,
    route,
  };
  const recordLevelInfo = {
    transitIcCardName: cardName,
    transitIcCardNo: cardNo,
    transitIcRecordId: recordId,
    transitIcRecordInfo,
    recordDate,
    amount,
  };
  const itemLevelInfo = {
    recordDate,
    amount,
  };
  return { recordLevelInfo, itemLevelInfo };
};

/**
 * Build multiple records from multiple ic transactions
 *
 * @returns Record[]
 */
export const generateRecordsFromICTrans = (
  transactions: IcTransactionWithCardNo[],
  expenseType: ExpenseType,
  empId: string,
  reportId: string,
  taxTypesByDates: ExpTaxByDate,
  taxRoundingSetting: RoundingType,
  baseCurrencyDecimal: number,
  useCashAdvance = false,
  empHistoryId?: string,
  paymentMethodId = null,
  useJctRegistrationNumber = false
): Record[] => {
  const records = transactions.map((trans) => {
    let record = newRecord(
      expenseType.id,
      expenseType.name,
      expenseType.recordType,
      expenseType.useForeignCurrency,
      expenseType,
      true,
      expenseType.fileAttachment,
      expenseType.fixedForeignCurrencyId,
      expenseType.foreignCurrencyUsage
    ) as Record;
    // build transaction info
    const { recordLevelInfo, itemLevelInfo } = getICTransInfo(trans);
    // build tax info
    const tax = get(
      taxTypesByDates,
      `${recordLevelInfo.recordDate}.0`,
      {}
    ) as ExpTaxType;
    const rate = tax.rate || 0;
    const baseId = tax.baseId || null;
    const historyId = tax.historyId || null;
    const name = tax.name || null;
    const taxRes = calculateTax(
      rate,
      recordLevelInfo.amount || 0,
      baseCurrencyDecimal,
      taxRoundingSetting
    );
    const recordTax = { withoutTax: taxRes.amountWithoutTax };
    const itemTax = {
      withoutTax: taxRes.amountWithoutTax,
      gstVat: taxRes.gstVat,
      taxTypeBaseId: baseId,
      taxTypeHistoryId: historyId,
      taxTypeName: name,
      taxRate: rate,
    };
    // set jct no usage and jct invoice option
    if (expenseType.jctRegistrationNumberUsage && useJctRegistrationNumber) {
      (record as Record).jctRegistrationNumberUsage =
        expenseType.jctRegistrationNumberUsage;
      if (isUseJctNo(expenseType.jctRegistrationNumberUsage)) {
        (record as Record).items[0].jctInvoiceOption =
          JCT_NUMBER_INVOICE.Invoice;
      }
    }
    record = {
      ...record,
      ...recordLevelInfo,
      ...recordTax,
      empId,
      reportId,
      useCashAdvance,
      empHistoryId,
      paymentMethodId,
    };
    record.items[0] = { ...record.items[0], ...itemLevelInfo, ...itemTax };
    return record;
  });

  return records;
};

/**
 * Generate route display using route info object
 *
 * @param {(?TransitIcRouteInfo | TransitIcRecordInfo)} info
 * @returns {string} e.g. 京橋(東京メトロ) - 末広町(東京メトロ)
 */
export const getRouteInfo = (
  info: (TransitIcRouteInfo | null | undefined) | TransitIcRecordInfo
) => {
  if (!info) {
    return '';
  }

  const entryName = get(info, 'entryStationName', '');
  let entryOp = get(info, 'entryStationOperator', '');
  entryOp = entryOp ? `(${entryOp})` : '';
  const entry = entryName + entryOp;

  const exitName = get(info, 'exitStationName', '');
  let exitOp = get(info, 'exitStationOperator', '');
  exitOp = exitOp ? `(${exitOp})` : '';
  const exit = exitName + exitOp;

  const divider = entry && exit ? ' - ' : '';
  const route = entry + divider + exit;

  return route;
};

/**
 * Generate detail display using route info object
 *
 * @param {(?TransitIcRouteInfo | TransitIcRecordInfo)} transitInfo
 * @returns {string} e.g. Railway: 京橋(東京メトロ) - 末広町(東京メトロ)
 */
export const getDetailDisplay = (
  transitInfo: (TransitIcRouteInfo | null | undefined) | TransitIcRecordInfo
) => {
  if (!transitInfo) {
    return '';
  }
  const { category } = transitInfo;
  const msgKey = category ? CATEGORY_MAP[category] : '';
  const categoryName = msg()[msgKey];
  const routeDisplay = get(transitInfo, 'route') || getRouteInfo(transitInfo);
  const divider = categoryName && routeDisplay ? ': ' : '';
  const detailDisplay = categoryName + divider + routeDisplay;
  return detailDisplay;
};

export const getTransitCards = (
  salesId: string,
  customerId: string,
  companyId: string,
  employeeCode: string
): Promise<IcCards> => {
  return Api.invoke({
    path: '/exp/transit-card/card/list',
    param: {
      salesId,
      customerId,
      companyId,
      userNo: employeeCode,
    },
  }).then(({ cards }) => {
    return cards;
  });
};

export const getIcCardTransactionHistory = (
  salesId: string,
  customerId: string,
  companyId: string,
  employeeCode: string,
  paymentDateFrom?: string,
  paymentDateTo?: string,
  includeHidden?: boolean,
  includeUsed?: boolean
): Promise<IcTransactionsByCards> => {
  return Api.invoke({
    path: '/exp/transit-card/record/list',
    param: {
      salesId,
      customerId,
      userNo: employeeCode,
      companyId,
      paymentDateFrom,
      paymentDateTo,
      includeHidden,
      includeUsed,
    },
  }).then((response) => {
    return response.transitCards;
  });
};

export const hideIcCardTransaction = (
  salesId: string,
  customerId: string,
  employeeCode: string,
  companyId: string,
  userCardNo: string,
  icRecordId: string,
  isHidden: boolean
): Promise<null> =>
  Api.invoke({
    path: '/exp/transit-card/hide',
    param: {
      salesId,
      customerId,
      userNo: employeeCode,
      companyId,
      userCardNo,
      icRecordId,
      isHidden,
    },
  }).then((response) => response);
