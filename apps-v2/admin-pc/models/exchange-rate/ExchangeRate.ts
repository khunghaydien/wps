import Api from '../../../commons/api';
import DateUtil from '../../../commons/utils/DateUtil';

export type ExchangeRate = {
  id: string;
  companyId: string;
  code: string;
  currencyId: string;
  currencyCode: string;
  currencyName: string;
  baseCurrencyId: string;
  baseCurrencyCode: string;
  baseCurrencyName: string;
  currencyPair: string;
  currencyPairLabel: string;
  rate: number;
  reverseRate: number;
  calculationRate: number;
  validDateFrom: string;
  validDateTo: string;
};

export const create = (): ExchangeRate => ({
  id: '',
  companyId: '',
  code: '',
  currencyId: '',
  currencyCode: '',
  currencyName: '',
  baseCurrencyId: '',
  baseCurrencyCode: '',
  baseCurrencyName: '',
  currencyPair: '',
  currencyPairLabel: '',
  rate: 0,
  reverseRate: 0,
  calculationRate: 0,
  validDateFrom: '',
  validDateTo: '',
});

export const save = (exchangeRate: ExchangeRate): Promise<string> =>
  Api.invoke({
    path: '/exp/exchange-rate/create',
    param: {
      ...exchangeRate,
      validDateTo: DateUtil.addDays(exchangeRate.validDateTo, 1),
    },
  });

export const update = (exchangeRate: ExchangeRate): Promise<string> =>
  Api.invoke({
    path: '/exp/exchange-rate/update',
    param: {
      ...exchangeRate,
      validDateTo: DateUtil.addDays(exchangeRate.validDateTo, 1),
    },
  });

export const del = (exchangeRate: ExchangeRate): Promise<string> =>
  Api.invoke({
    path: '/exp/exchange-rate/delete',
    param: { id: exchangeRate.id },
  });

export const fetch = (
  companyId: string,
  baseCurrencyCode: string,
  baseCurrencyName: string
): Promise<ExchangeRate[]> => {
  return Api.invoke({
    path: '/exp/exchange-rate/search',
    param: { companyId },
  }).then((resultList) =>
    resultList.records.map((rec) => ({
      ...rec,
      companyId,
      baseCurrencyCode,
      baseCurrencyName,
    }))
  );
};
