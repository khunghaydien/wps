import cloneDeep from 'lodash/cloneDeep';
import drop from 'lodash/drop';
import get from 'lodash/get';
import set from 'lodash/set';

import { ExpenseTypeList } from '@apps/domain/models/exp/ExpenseType';
import { calcAmountFromRate } from '@apps/domain/models/exp/foreign-currency/Currency';
import {
  calcItemsTotalAmount,
  isAmountMatch,
  isItemizedRecord,
  Record,
  RecordItem,
} from '@apps/domain/models/exp/Record';
import { Report } from '@apps/domain/models/exp/Report';
import { ExpRequestRecord } from '@apps/domain/models/exp/request/Report';
import {
  AmountInputMode,
  calcAmountFromTaxExcluded,
  calculateTax,
  ExpTaxByExpType,
  ExpTaxType,
  RoundingModeType,
  TaxRes,
} from '@apps/domain/models/exp/TaxType';

import FormatUtil from '../FormatUtil';
import { toFixedNumber } from '../NumberUtil';
import TextUtil from '../TextUtil';

export const calculateAmountFromExchangeRate = (
  currencyDecimalPlaces: number,
  expRoundingSetting: string,
  localAmount: number,
  rate: number,
  exchangeRateManual: boolean
) => {
  const exchangeRate = rate || 0;
  const amount = Number(
    calcAmountFromRate(
      exchangeRate,
      localAmount,
      currencyDecimalPlaces,
      expRoundingSetting
    )
  );

  return {
    exchangeRate,
    originalExchangeRate: exchangeRate,
    exchangeRateManual,
    amount,
  };
};

/**
 * Calculate amount and get exchange rate info for child items
 * child item exchange rate follows parent item
 * @param currencyDecimalPlaces
 * @param expRoundingSetting
 * @param items
 * @returns a list of updated child item amount
 */
export const calculateFCChildItemListAmount = (
  currencyDecimalPlaces: number,
  expRoundingSetting: string,
  items: RecordItem[]
) => {
  const [firstItem, ...childItemList] = items;
  const {
    currencyId: parentCurrencyId,
    currencyInfo: parentCurrencyInfo,
    exchangeRate: parentExchangeRate,
    exchangeRateManual: parentExchangeRateManual,
  } = firstItem;

  const updatedChildItemList = childItemList.map((item: RecordItem) => {
    const fcDecimalPlaces = get(parentCurrencyInfo, 'decimalPlaces') || 0;
    const localAmount = toFixedNumber(item.localAmount, fcDecimalPlaces);
    const exchangeRateInfo = calculateAmountFromExchangeRate(
      currencyDecimalPlaces,
      expRoundingSetting,
      localAmount,
      parentExchangeRate,
      parentExchangeRateManual
    );
    return {
      ...item,
      localAmount,
      ...exchangeRateInfo,
      currencyId: parentCurrencyId,
      currencyInfo: parentCurrencyInfo,
    };
  });
  return updatedChildItemList;
};

/**
 * Calculate amount from tax for child items on parent date & tax type changed
 * @param baseCurrencyDecimal
 * @param record
 * @param recordDate
 * @param taxRoundingSetting
 * @param taxTypeObj
 * @param parentBaseId passed when parent item's tax type has changed
 * @returns {[key: string]: boolean | number | string}
 */
export const calculateBCChildItemListAmount = (
  amountInputMode: string,
  baseCurrencyDecimal: number,
  childItemList: RecordItem[],
  recordDate: string,
  taxRoundingSetting: RoundingModeType,
  taxTypeObj: ExpTaxByExpType,
  parentBaseId?: string
): {
  [key: string]: boolean | number | string;
} => {
  const clonedChildItemList = cloneDeep(childItemList);
  const isTaxIncluded = amountInputMode === AmountInputMode.TaxIncluded;
  const updateChildItemObj = {};

  clonedChildItemList.forEach((item: RecordItem, idx: number) => {
    const { amount, expTypeId, taxManual, taxRate, taxTypeBaseId, withoutTax } =
      item;

    const finalTaxBaseId = parentBaseId || taxTypeBaseId;
    const taxTypeList = get(
      taxTypeObj,
      `${expTypeId}.${recordDate}`,
      []
    ) as ExpTaxType[];
    const selectedTaxType =
      taxTypeList.find(({ baseId }) => baseId === finalTaxBaseId) || {};
    const { baseId, historyId, name, rate } = selectedTaxType as ExpTaxType;

    const childItemIdx = idx + 1;
    const isParentTaxTypeChanged = !!parentBaseId;

    const updatedTaxRateInfo = {
      [`items.${childItemIdx}.taxTypeBaseId`]: baseId,
      [`items.${childItemIdx}.taxTypeHistoryId`]: historyId,
      [`items.${childItemIdx}.taxTypeName`]: name,
      [`items.${childItemIdx}.taxRate`]: rate,
    };

    if (taxManual && !isParentTaxTypeChanged) {
      Object.assign(updateChildItemObj, updatedTaxRateInfo);
      return;
    }

    if (taxRate === rate) return;

    const finalAmount = isTaxIncluded ? amount : withoutTax;

    const calcTaxAction = isTaxIncluded
      ? calculateTax
      : calcAmountFromTaxExcluded;
    const taxRes: TaxRes = calcTaxAction(
      rate || 0,
      finalAmount || 0,
      baseCurrencyDecimal,
      taxRoundingSetting
    );

    Object.assign(updateChildItemObj, {
      [`items.${childItemIdx}.amount`]:
        (isTaxIncluded ? finalAmount : taxRes.amountWithTax) || 0,
      [`items.${childItemIdx}.withoutTax`]:
        (isTaxIncluded ? taxRes.amountWithoutTax : finalAmount) || 0,
      [`items.${childItemIdx}.gstVat`]: taxRes.gstVat,
      [`items.${childItemIdx}.taxManual`]: false,
      ...updatedTaxRateInfo,
    });
  });

  return updateChildItemObj;
};

/**
 * Update each child item object with new info
 * @param updateObj new info
 * @param itemList current items data
 * @returns RecordItem[]
 */
export const updateChildItemInfo = (
  updateObj: {
    [key: string]: boolean | number | string;
  },
  itemList: RecordItem[]
) => {
  const updatedItemList = cloneDeep(itemList);

  Object.keys(updateObj).forEach((key) => {
    const path = key.replace('items.', '');
    set(updatedItemList, path, updateObj[key]);
  });

  return updatedItemList;
};

/**
 * Reset exp type and tax type info if exp type is not valid on parent date change
 * @param childItemList
 * @param expTypeList
 * @returns {[key: string]: boolean | number | string}
 */
export const updateChildItemExpType = (
  childItemList: RecordItem[],
  expTypeList: ExpenseTypeList,
  isResetExpTypeName = true
): {
  [key: string]: boolean | number | string;
} => {
  const updateChildItemObj = {};
  const expTypeIdList = expTypeList.map(({ id }) => id);

  if (expTypeIdList.length === 0) return updateChildItemObj;

  childItemList.forEach((item: RecordItem, idx: number) => {
    const { amount, expTypeId, expTypeName } = item;
    const isValid = expTypeIdList.includes(expTypeId);

    if (isValid) return;

    const childItemIdx = idx + 1;
    const resetExpTypeName = isResetExpTypeName ? '' : expTypeName;

    Object.assign(updateChildItemObj, {
      [`items.${childItemIdx}.expTypeDescription`]: '',
      [`items.${childItemIdx}.expTypeId`]: '',
      [`items.${childItemIdx}.expTypeName`]: resetExpTypeName,
      [`items.${childItemIdx}.taxTypeBaseId`]: '',
      [`items.${childItemIdx}.taxTypeHistoryId`]: '',
      [`items.${childItemIdx}.taxTypeName`]: '',
      [`items.${childItemIdx}.taxRate`]: 0,
      [`items.${childItemIdx}.gstVat`]: 0,
      [`items.${childItemIdx}.withoutTax`]: amount,
    });
  });
  return updateChildItemObj;
};

export const updateChildItemCC = (
  itemList: RecordItem[],
  reportCCHistoryId: string
) => {
  const [parentItem] = itemList;
  const { costCenterHistoryId: parentCostCenterHistoryId } = parentItem;

  return itemList.map((item: RecordItem, idx: number) => {
    const isChildItem = idx > 0;
    const costCenterHistoryId = parentCostCenterHistoryId || reportCCHistoryId;
    const isCCSame = item.costCenterHistoryId === costCenterHistoryId;

    if (isChildItem && isCCSame) {
      return {
        ...item,
        costCenterCode: null,
        costCenterHistoryId: null,
        costCenterName: null,
      };
    }
    return item;
  });
};

export const updateChildItemJob = (itemList: RecordItem[], jobId: string) => {
  const [parentItem] = itemList;
  const { jobId: parentJobId } = parentItem;

  return itemList.map((item: RecordItem, idx: number) => {
    const isChildItem = idx > 0;
    const parentReportJobId = parentJobId || jobId;
    const isJobSame = item.jobId === parentReportJobId;

    if (isChildItem && isJobSame) {
      return {
        ...item,
        jobCode: null,
        jobId: null,
        jobName: null,
      };
    }
    return item;
  });
};

/**
 * Calculate the sum of child items amount
 * @param decimalPlaces
 * @param expRecord
 * @param useForeignCurrency
 * @returns totalAmount
 */
export const calculateTotalAmountForItems = (
  decimalPlaces: number,
  expRecord: Record | ExpRequestRecord,
  useForeignCurrency: boolean,
  fieldKey?: string
) => {
  const inputMode = get(expRecord, 'amountInputMode');
  const isTaxIncluded = inputMode === AmountInputMode.TaxIncluded;
  // recordItems[0] is parent record
  const recordItems = drop(cloneDeep(expRecord.items), 1);
  const key =
    fieldKey ||
    (useForeignCurrency && 'localAmount') ||
    (isTaxIncluded && 'amount') ||
    'withoutTax';
  const totalAmount = calcItemsTotalAmount(recordItems, key, decimalPlaces);
  return totalAmount;
};

/**
 * Generate itemize amount or tax amount warning message
 * @param baseCurrencyDecimal
 * @param baseCurrencySymbol
 * @param expRecord
 * @param key
 * @param message
 * @param taxTypeBaseId
 * @param total
 * @returns warningMessage
 */
export const getItemizeWarningMessage = (
  currencyDecimal: number,
  currencySymbol: string,
  expRecord: Record | ExpRequestRecord,
  key: string,
  message: string,
  taxTypeBaseId: string,
  total: number
) => {
  const [_, ...childItemList] = expRecord.items;

  const taxTypeChildItemList = childItemList.filter(
    (item) => item.taxTypeBaseId === taxTypeBaseId
  );
  const itemTotal = calcItemsTotalAmount(
    taxTypeChildItemList,
    key,
    currencyDecimal
  );
  const hasWarning = childItemList.length > 0 && total !== itemTotal;
  return hasWarning
    ? TextUtil.template(
        message,
        `${currencySymbol}${FormatUtil.formatNumber(
          itemTotal,
          currencyDecimal
        )}`
      )
    : '';
};

export const getItemCCJobObj = (
  itemIdx: number,
  record: Record,
  report?: Report
) => {
  const parentItem = get(record, 'items.0', {});
  const item = get(record, `items.${itemIdx}`, {});

  return {
    costCenterCode:
      item.costCenterCode ||
      parentItem.costCenterCode ||
      report?.costCenterCode,
    costCenterName:
      item.costCenterName ||
      parentItem.costCenterName ||
      report?.costCenterName,
    jobCode: item.jobCode || parentItem.jobCode || report?.jobCode,
    jobName: item.jobName || parentItem.jobName || report?.jobName,
  };
};

export const getTotalAmountMatch = (
  baseCurrencyDecimal: number,
  expRecord: Record
) => {
  if (!isItemizedRecord(expRecord.items.length)) {
    return true;
  }

  const { amountInputMode } = expRecord;
  const [parentItem, ...childItemList] = expRecord.items;
  const {
    amount,
    currencyInfo,
    localAmount,
    taxItems,
    useForeignCurrency,
    withoutTax,
  } = parentItem;
  const isMultiTax = taxItems?.length > 0;
  const isTaxIncludedMode = amountInputMode === AmountInputMode.TaxIncluded;

  const foreignDecimalPlaces = get(currencyInfo, 'decimalPlaces') || 0;
  const decimalPlaces = useForeignCurrency
    ? foreignDecimalPlaces
    : baseCurrencyDecimal;
  const fieldKey = useForeignCurrency
    ? undefined
    : isTaxIncludedMode
    ? 'amount'
    : 'withoutTax';
  const totalAmount = useForeignCurrency
    ? localAmount
    : isTaxIncludedMode
    ? amount
    : withoutTax;

  if (isMultiTax) {
    const amountMatchList = taxItems.map((taxItem) => {
      const itemList = childItemList.filter(
        (item) => item.taxTypeHistoryId === taxItem.taxTypeHistoryId
      );
      const childItemTotalAmount = calcItemsTotalAmount(
        itemList,
        fieldKey,
        baseCurrencyDecimal
      );
      const totalAmount = isTaxIncludedMode
        ? taxItem.amount
        : taxItem.withoutTax;
      return isAmountMatch(totalAmount || 0, childItemTotalAmount);
    });
    return amountMatchList.every((isAmountMatch) => isAmountMatch);
  }

  const childItemTotalAmount = calculateTotalAmountForItems(
    decimalPlaces,
    expRecord,
    useForeignCurrency,
    fieldKey
  );
  return isAmountMatch(totalAmount || 0, childItemTotalAmount);
};
