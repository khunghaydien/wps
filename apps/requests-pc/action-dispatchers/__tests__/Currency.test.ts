import ApiMock from '../../../../__tests__/mocks/ApiMock';
import * as actions from '../Currency';
import currencyRes from './mocks/currency.mock';
import exchangeRateRes from './mocks/exchangeRate.mock';
import Store from './mocks/Store';
import taxTypesRes from './mocks/taxTypesRes.mock';

jest.mock('uuid/v4', () => () => 1);

describe('Currency', () => {
  afterEach(() => {
    ApiMock.reset();
  });

  let store;

  beforeEach(() => {
    store = Store.create();
  });

  describe('searchTaxTypeList()', () => {
    it('get tax type list success', async () => {
      ApiMock.mockReturnValue({
        '/exp/tax-type/list': taxTypesRes,
      });

      await store.dispatch(
        actions.searchTaxTypeList('expTypeId1', '2020-02-21')
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('getRateFromId()', () => {
    it('getRateFromId success', async () => {
      ApiMock.mockReturnValue({
        '/exp/exchange-rate/search': exchangeRateRes,
      });

      await store.dispatch(
        actions.getRateFromId('', 'a0S2v000016C9VgEAK', '2020-03-13')
      );

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('searchCurrencyList()', () => {
    it('searchCurrencyList success', async () => {
      ApiMock.mockReturnValue({
        '/currency/search': currencyRes,
      });

      await store.dispatch(actions.searchCurrencyList(''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
