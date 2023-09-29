import TAX_TYPE from '../../constants/taxType';

import TaxUtil from '../TaxUtil';

const ROUNDING = {
  CEIL: 'Ceil',
  FLOOR: 'Floor',
  ROUND: 'Round',
};
const taxRate = 8;
const amount = '10,000';
const expTaxTypeList = [
  { id: '012345', rate: 8, name: '消費税 8%' },
  { id: '012346', rate: 10, name: '消費税 10%' },
];

describe('calcGstVat() のテスト', () => {
  test('rounding が Ceil(切り上げ)', () => {
    expect(TaxUtil.calcGstVat(amount, taxRate, ROUNDING.CEIL, 0)).toBe(741);
  });

  test('rounding が Floor(切り捨て)', () => {
    expect(TaxUtil.calcGstVat(amount, taxRate, ROUNDING.FLOOR, 0)).toBe(740);
  });

  test('rounding が Round(四捨五入)', () => {
    expect(TaxUtil.calcGstVat(amount, taxRate, ROUNDING.ROUND, 0)).toBe(741);
  });
});

describe('isTaxTypeTotal() のテスト', () => {
  test('type が Total', () => {
    expect(TaxUtil.isTaxTypeTotal(TAX_TYPE.TOTAL)).toBeTruthy();
  });

  test('type が PerRecordItem', () => {
    expect(TaxUtil.isTaxTypeTotal(TAX_TYPE.PER_RECORD_ITEM)).toBeFalsy();
  });

  test('type が Nontaxable', () => {
    expect(TaxUtil.isTaxTypeTotal(TAX_TYPE.NONTAXABLE)).toBeFalsy();
  });
});

describe('isTaxTypePerRecordItem() のテスト', () => {
  test('type が Total', () => {
    expect(TaxUtil.isTaxTypePerRecordItem(TAX_TYPE.TOTAL)).toBeFalsy();
  });

  test('type が PerRecordItem', () => {
    expect(
      TaxUtil.isTaxTypePerRecordItem(TAX_TYPE.PER_RECORD_ITEM)
    ).toBeTruthy();
  });

  test('type が Nontaxable', () => {
    expect(TaxUtil.isTaxTypePerRecordItem(TAX_TYPE.NONTAXABLE)).toBeFalsy();
  });
});

describe('isTaxTypeNonTaxable() のテスト', () => {
  test('type が Total', () => {
    expect(TaxUtil.isTaxTypeNonTaxable(TAX_TYPE.TOTAL)).toBeFalsy();
  });

  test('type が PerRecordItem', () => {
    expect(TaxUtil.isTaxTypeNonTaxable(TAX_TYPE.PER_RECORD_ITEM)).toBeFalsy();
  });

  test('type が Nontaxable', () => {
    expect(TaxUtil.isTaxTypeNonTaxable(TAX_TYPE.NONTAXABLE)).toBeTruthy();
  });
});

// このメソッドの役割が不明
describe('setInitialExpTaxLabel() のテスト', () => {});

describe('findSelectedExpTax() のテスト', () => {
  test('税率一覧からデータを取得する際に取得したい ID を渡さない', () => {
    expect(TaxUtil.findSelectedExpTax(expTaxTypeList)).toBeNull();
  });

  test('税率一覧が null の場合', () => {
    expect(TaxUtil.findSelectedExpTax(null, '012346')).toBeNull();
  });

  test('税率一覧が空配列の場合', () => {
    expect(TaxUtil.findSelectedExpTax([], '012346')).toBeNull();
  });

  test('税率一覧から指定した ID のデータを取得', () => {
    expect(TaxUtil.findSelectedExpTax(expTaxTypeList, '012346')).toEqual({
      id: '012346',
      rate: 10,
      name: '消費税 10%',
    });
  });
});

describe('hasMultipleTaxRecord() のテスト', () => {
  const listHasSingleTaxRecord = [
    { rate: 8, name: '消費税 8%' },
    { rate: 0, name: '課税なし' },
  ];

  const listHasMultipleTaxRecord = [
    { rate: 8, name: '消費税 8%' },
    { rate: 10, name: '消費税 10%' },
  ];

  test('課税のレコードが 1 件存在', () => {
    expect(TaxUtil.hasMultipleTaxRecord(listHasSingleTaxRecord)).toBeFalsy();
  });

  test('課税のレコードが 2 件存在', () => {
    expect(TaxUtil.hasMultipleTaxRecord(listHasMultipleTaxRecord)).toBeTruthy();
  });
});
