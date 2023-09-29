import {
  calcAmountFromTaxExcluded,
  calculateTax,
  RoundingModeType,
} from '../TaxType';

describe('calculateTax(testParam)', () => {
  const TEST_DATA = [
    // decimalPlaces : 0
    //   tax rate : 0% (tax free)
    {
      decimalPlaces: 0,
      rate: 0,
      amount: 101,
      expectedAmountExclTax: 101,
      expectedTax: 0,
      roundingType: 'Round',
    }, //   tax rate : 8% (Japan)
    {
      decimalPlaces: 0,
      rate: 8,
      amount: 107,
      expectedAmountExclTax: 99,
      expectedTax: 8,
      roundingType: 'RoundUp',
    },
    {
      decimalPlaces: 0,
      rate: 8,
      amount: 107,
      expectedAmountExclTax: 100,
      expectedTax: 7,
      roundingType: 'RoundDown',
    },
    {
      decimalPlaces: 0,
      rate: 8,
      amount: 108,
      expectedAmountExclTax: 100,
      expectedTax: 8,
      roundingType: 'Round',
    },
    {
      decimalPlaces: 0,
      rate: 8,
      amount: 109,
      expectedAmountExclTax: 101,
      expectedTax: 8,
      roundingType: 'Round',
    },
    {
      decimalPlaces: 0,
      rate: 8,
      amount: 109,
      expectedAmountExclTax: 100,
      expectedTax: 9,
      roundingType: 'RoundUp',
    },
    {
      decimalPlaces: 0,
      rate: 10,
      amount: 140,
      expectedAmountExclTax: 128,
      expectedTax: 12,
      roundingType: 'RoundDown',
    },
    {
      decimalPlaces: 0,
      rate: 8,
      amount: 1012,
      expectedAmountExclTax: 937,
      expectedTax: 75,
      roundingType: 'Round',
    },
    {
      decimalPlaces: 0,
      rate: 8,
      amount: 1013,
      expectedAmountExclTax: 938,
      expectedTax: 75,
      roundingType: 'Round',
    }, // decimalPlaces : 2
    //   tax rate : 0% (tax free)
    {
      decimalPlaces: 2,
      rate: 0,
      amount: 10,
      expectedAmountExclTax: 10,
      expectedTax: 0,
      roundingType: 'Round',
    }, //   tax rate : 7% (Singapore)
    // Singapore GST should be rounded off(四捨五入).
    // But now only rounding down is supported. so the results differ from the expectations.
    // Once we support the rounding setting, test below with a 'round off' setting.
    {
      decimalPlaces: 2,
      rate: 7,
      amount: 10.7,
      expectedAmountExclTax: 10,
      expectedTax: 0.7,
      roundingType: 'Round',
    },
    {
      decimalPlaces: 2,
      rate: 7,
      amount: 10.8,
      expectedAmountExclTax: 10.09,
      expectedTax: 0.71,
      roundingType: 'Round',
    },
  ];

  test('Execute calculateTax test with TEST_DATA', () => {
    TEST_DATA.forEach((param) => {
      const ans = calculateTax(
        param.rate,
        param.amount,
        param.decimalPlaces,
        param.roundingType as RoundingModeType
      );
      expect(ans.amountWithoutTax).toBe(param.expectedAmountExclTax);
      expect(ans.gstVat).toBe(param.expectedTax);
    });
  });
});

describe('calcAmountFromTaxExcluded(testParam)', () => {
  const TEST_DATA = [
    // decimalPlaces : 0
    //   tax rate : 0% (tax free)
    {
      decimalPlaces: 0,
      rate: 0,
      amount: 101,
      expectedAmountInclTax: 101,
      expectedTax: 0,
      roundingType: 'Round',
    },
    {
      decimalPlaces: 0,
      rate: 10,
      amount: 100,
      expectedAmountInclTax: 110,
      expectedTax: 10,
      roundingType: 'Round',
    },
    {
      decimalPlaces: 1,
      rate: 10,
      amount: 110,
      expectedAmountInclTax: 121,
      expectedTax: 11,
      roundingType: 'Round',
    },
    {
      decimalPlaces: 1,
      rate: 8,
      amount: 123,
      expectedAmountInclTax: 132.9,
      expectedTax: 9.9,
      roundingType: 'RoundUp',
    },
    {
      decimalPlaces: 1,
      rate: 8,
      amount: 123,
      expectedAmountInclTax: 132.8,
      expectedTax: 9.8,
      roundingType: 'RoundDown',
    },
    {
      decimalPlaces: 2,
      rate: 8,
      amount: 123,
      expectedAmountInclTax: 132.84,
      expectedTax: 9.84,
      roundingType: 'Round',
    },
  ];

  test('Execute calcAmountFromTaxExcluded test with TEST_DATA', () => {
    TEST_DATA.forEach((param) => {
      const ans = calcAmountFromTaxExcluded(
        param.rate,
        param.amount,
        param.decimalPlaces,
        param.roundingType as RoundingModeType
      );
      expect(ans.amountWithTax).toBe(param.expectedAmountInclTax);
      expect(ans.gstVat).toBe(param.expectedTax);
    });
  });
});
