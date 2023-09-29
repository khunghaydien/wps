import Decimal from 'decimal.js';

import Api from '../../../../commons/api';

export const FOREIGN_CURRENCY_USAGE = {
  NotUsed: 'NOT_USED',
  Fixed: 'FIXED',
  Flexible: 'FLEXIBLE',
};

/* eslint-disable camelcase */
export type Currency = {
  id: string;
  decimalPlaces: string;
  isoCurrencyCode: string;
  name: string;
  name_L0: string;
  name_L1: string;
  name_L2: string;
  symbol: string;
};

export type CurrencyList = Array<Currency>;

export const ROUNDING_TYPE = {
  Round: 'Round',
  RoundUp: 'RoundUp',
  RoundDown: 'RoundDown',
};

export type RoundingType = 'Round' | 'RoundUp' | 'RoundDown';

const RoundingMode = {
  Round: Decimal.ROUND_HALF_UP,
  RoundDown: Decimal.ROUND_DOWN,
  RoundUp: Decimal.ROUND_UP,
};

/**
 * Calculate amount from exchange rate
 *
 * @param {number} rate
 * @param {number} localAmount
 * @param {number} decimal
 * @param {string} roundingType
 * @returns
 */
export const calcAmountFromRate = (
  rate: number,
  localAmount: number,
  decimal: number,
  roundingType: string
) => {
  return Decimal.mul(rate, localAmount).toFixed(
    decimal,
    RoundingMode[roundingType]
  );
};

export const searchCurrency = (companyId: string): Promise<CurrencyList> => {
  return Api.invoke({
    path: '/currency/search',
    param: {
      companyId,
    },
  });
};

type CurrencyCode = {
  label: string;
  value: string;
};
export type CurrencyCodeList = CurrencyCode[];
export const searchCurrencyCodeList = (): Promise<{
  records: CurrencyCodeList;
}> => {
  return Api.invoke({
    path: '/currency/iso-code-list/search',
    param: {},
  });
};
