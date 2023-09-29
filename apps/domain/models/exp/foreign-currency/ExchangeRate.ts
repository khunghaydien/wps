import Api from '../../../../commons/api';

// Expense Exchange Rate
export type ExchangeRate = {
  Id: string;
  calculationRate: number;
  code: number;
  companyId: string;
  currencyCode: string;
  currencyId: string;
  currencyName: string;
  currencyPair: string;
  rate: number;
  reverseRate: number;
  validDateFrom: string;
  validDateTo: string;
};

export type ExchangeRateList = Array<ExchangeRate>;

// eslint-disable-next-line import/prefer-default-export
export const searchExchangeRate = (
  companyId: string,
  currencyId: string,
  targetDate: string
): Promise<ExchangeRateList> => {
  return Api.invoke({
    path: '/exp/exchange-rate/search',
    param: {
      currencyId,
      companyId,
      targetDate,
    },
  });
};

export const exchangeRateField = 'ExchangeRateField';
