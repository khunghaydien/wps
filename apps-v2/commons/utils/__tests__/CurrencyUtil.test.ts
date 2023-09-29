import CurrencyUtil from '../CurrencyUtil';

describe('findActiveCurrencyList()', () => {
  const assert = (given, expected) => {
    expect(
      CurrencyUtil.findActiveCurrencyList(given.currencyList, given.date)
    ).toEqual(expected);
  };

  const getMsec = (yyyymmdd) => {
    return new Date(yyyymmdd).getTime();
  };

  // fixture
  const JPY = {
    code: 'JPY',
    validFrom: getMsec('2017-06-01'),
    validTo: getMsec('2017-09-30'),
  };
  const USD = {
    code: 'USD',
    validFrom: getMsec('2017-06-01'),
    validTo: getMsec('2017-06-30'),
  };

  test('有効期限切れの通貨が除かれること', () => {
    const currencyList = [JPY, USD];
    const date = getMsec('2017-07-01');
    const expected = [JPY];
    assert({ currencyList, date }, expected);
  });

  // TODO
  describe('validFrom, validTo が設定されていなくてもエラーにならないこと', () => {
    test('validFrom が null', () => {
      const currency = Object.assign({}, JPY);
      currency.validFrom = null;

      const currencyList = [currency];
      const date = getMsec('2017-07-01');
      const expected = [currency];
      assert({ currencyList, date }, expected);
    });
    test('validFrom が undefined', () => {
      const currency = Object.assign({}, JPY);
      delete currency.validFrom;

      const currencyList = [currency];
      const date = getMsec('2017-07-01');
      const expected = [currency];
      assert({ currencyList, date }, expected);
    });

    test('validTo が null', () => {
      const currency = Object.assign({}, JPY);
      currency.validTo = null;

      const currencyList = [currency];
      const date = getMsec('2017-07-01');
      const expected = [currency];
      assert({ currencyList, date }, expected);
    });
    test('validTo が undefined', () => {
      const currency = Object.assign({}, JPY);
      delete currency.validTo;

      const currencyList = [currency];
      const date = getMsec('2017-07-01');
      const expected = [currency];
      assert({ currencyList, date }, expected);
    });

    test('validFrom, validTo が null', () => {
      const currency = Object.assign({}, JPY);
      currency.validFrom = null;
      currency.validTo = null;

      const currencyList = [currency];
      const date = getMsec('2017-07-01');
      const expected = [currency];
      assert({ currencyList, date }, expected);
    });
    test('validFrom, validTo が undefined', () => {
      const currency = Object.assign({}, JPY);
      delete currency.validFrom;
      delete currency.validTo;

      const currencyList = [currency];
      const date = getMsec('2017-07-01');
      const expected = [currency];
      assert({ currencyList, date }, expected);
    });
  });

  describe('境界値テスト', () => {
    test('validFrom < date(OK)', () => {
      const currencyList = [JPY];
      const date = getMsec('2017-06-02');
      const expected = [JPY];

      assert({ currencyList, date }, expected);
    });
    test('validFrom = date(OK)', () => {
      const currencyList = [JPY];
      const date = getMsec('2017-06-01');
      const expected = [JPY];
      assert({ currencyList, date }, expected);
    });
    test('validFrom > date(NG)', () => {
      const currencyList = [JPY];
      const date = getMsec('2017-05-31');
      const expected = [];
      assert({ currencyList, date }, expected);
    });

    test('validTo < date(NG)', () => {
      const currencyList = [JPY];
      const date = getMsec('2017-10-01');
      const expected = [];
      assert({ currencyList, date }, expected);
    });
    test('validTo = date(OK)', () => {
      const currencyList = [JPY];
      const date = getMsec('2017-09-30');
      const expected = [JPY];
      assert({ currencyList, date }, expected);
    });
    test('validTo > date(OK)', () => {
      const currencyList = [JPY];
      const date = getMsec('2017-09-29');
      const expected = [JPY];
      assert({ currencyList, date }, expected);
    });
  });

  test('date を省略または null を渡しても問題なく動く', () => {
    const currencyList = [JPY];
    const expected = [JPY];
    assert({ currencyList }, expected);
    assert({ currencyList, date: null }, expected);
  });
});
