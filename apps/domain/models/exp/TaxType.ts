import Decimal from 'decimal.js';
import { $Values } from 'utility-types';

import Api from '../../../commons/api';

export type TaxDetailType =
  | 'NotUsed'
  | 'DisplaysTaxIncludedAmount'
  | 'DisplaysTaxExcludedAmount';

export const TAX_DETAILS_TYPE = {
  NotUsed: 'NotUsed',
  IncludedAmount: 'DisplaysTaxIncludedAmount',
  ExcludedAmount: 'DisplaysTaxExcludedAmount',
};
// 経費税区分 / expense tax type
/* eslint-disable camelcase */
export type ExpenseTaxType = {
  id: string;
  code: string;
  companyId: string;
  name: string;
  name_L0: string;
  name_L1?: string;
  name_L2?: string;
  rate: number;
  validDateFrom: string;
  validDateTo: string;
};

export type ExpTaxType = {
  baseId: string;
  historyId: string;
  name: string;
  rate: number;
};

export type ExpTaxTypeList = Array<ExpTaxType>;

export type ExpTaxTypeListApiReturn = {
  payload: ExpTaxTypeList;
};

export type ExpenseTaxTypeList = Array<ExpenseTaxType>;

/*
 * {'2020-01-01': [{taxType1}, {taxType2}]}
 */
export type ExpTaxByDate = {
  [key: string]: ExpTaxTypeList;
};

export type TaxRes = {
  amountWithTax?: number;
  amountWithoutTax?: number;
  gstVat: number;
};
// export type TaxRes = {
//   gstVat: number;
// } & ({ amountWithoutTax: number } | { amountWithTax: number });

export const AmountInputMode = {
  TaxIncluded: 'InputWithTax',
  TaxExcluded: 'InputWithoutTax',
} as const;

export type AmountInputModeType = $Values<typeof AmountInputMode>;

const RoundingMode = {
  Round: Decimal.ROUND_HALF_UP,
  RoundDown: Decimal.ROUND_DOWN,
  RoundUp: Decimal.ROUND_UP,
};
export type RoundingModeType = keyof typeof RoundingMode;
/**
 * Calculate gst based on amount and rate
 *
 * @param {number} rateNum tax rate number without %
 * @param {number} amountNum total amount to calculate on
 * @param {number} decimalPlaces
 * @param {keyof typeof RoundingMode} roundingType
 * @returns {TaxRes} gst values
 */

export const calculateTax = (
  rateNum: number,
  amountNum: number,
  decimalPlaces: number,
  roundingType: RoundingModeType
) => {
  const taxRate = new Decimal(rateNum);
  const calcRate = new Decimal(rateNum + 100);
  const amount = new Decimal(amountNum);
  const gstVat = amount
    .div(calcRate)
    .mul(taxRate)
    .toDecimalPlaces(decimalPlaces, RoundingMode[roundingType]);
  const amountWithoutTax = amount.minus(gstVat);

  // e.g) amount: 108, rate: 8, decimalPlaces: 0
  // const gstVat = amount / (100 + rate) * rate;
  // const gstVat = 108 / (100 + 8) * 8;
  //       gstVat = 8
  // const amountWithoutTax = amount - gstVat;
  // const amountWithoutTax = 108 - 8;
  //       amountWithoutTax = 100;
  return {
    gstVat: Number(gstVat.toFixed(decimalPlaces)),
    amountWithoutTax: Number(amountWithoutTax.toFixed(decimalPlaces)),
  };
};
/**
 * Calculate gst based on tax excluded amount and rate
 *
 * @param {number} rateNum tax rate number without %
 * @param {number} amountNum amount without tax
 * @param {number} decimalPlaces
 * @param {keyof typeof RoundingMode} roundingType
 * @returns {TaxRes} gst values
 */

export const calcAmountFromTaxExcluded = (
  rateNum: number,
  amountNum: number,
  decimalPlaces: number,
  roundingType: RoundingModeType
) => {
  const taxRate = new Decimal(rateNum).div(100);
  const amount = new Decimal(amountNum);
  const gstVat = amount
    .mul(taxRate)
    .toDecimalPlaces(decimalPlaces, RoundingMode[roundingType]);
  const amountWithTax = amount.add(gstVat);

  return {
    gstVat: Number(gstVat.toFixed(decimalPlaces)),
    amountWithTax: Number(amountWithTax.toFixed(decimalPlaces)),
  };
};

/**
 * Calculate amount(Excl.Tax) based on amount and gst
 *
 * @param {number} gstVat
 * @param {number} amount
 * @param {number} decimalPlaces
 * @returns {Object} contains amountWithoutTax
 */
export const calcTaxFromGstVat = (
  gstVat: number,
  amount: number,
  decimalPlaces: number,
  isTaxIncluded?: boolean
) => {
  const amountWithTax = Decimal.add(amount, gstVat).toFixed(
    decimalPlaces,
    Decimal.ROUND_DOWN
  );
  const amountWithoutTax = Decimal.sub(amount, gstVat).toFixed(
    decimalPlaces,
    Decimal.ROUND_DOWN
  );
  return {
    amountWithTax: isTaxIncluded ? amount : amountWithTax,
    amountWithoutTax: isTaxIncluded ? amountWithoutTax : amount,
  };
};

export const searchTaxType = (
  targetDate: string
): Promise<{ taxTypes: ExpenseTaxTypeList }> => {
  return Api.invoke({
    path: '/exp/tax-type/search',
    param: { targetDate },
  });
};

/**
 * Search tax list based on exp type and date
 *
 * @param {string} expTypeId
 * @param {string} targetDate
 * @returns {Promise<{ taxTypes: ExpTaxTypeList }>}
 */
export const searchTaxTypeList = (
  expTypeId: string,
  targetDate: string
): Promise<{ taxTypes: ExpTaxTypeList }> => {
  return Api.invoke({
    path: '/exp/tax-type/list',
    param: { expTypeId, targetDate },
  });
};

export const taxSelectField = 'TaxSelection';
