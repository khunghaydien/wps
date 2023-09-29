import { calculateAmountForCCTrans, calculateAmountPayable } from '../Record';

describe('calculateAmountPayable(testParam)', () => {
  const TEST_DATA = [
    {
      amount: 500,
      decimalPlaces: 0,
      withholdingAmount: 0,
      expectedAmountPayable: 500,
    },
    {
      amount: 500,
      decimalPlaces: 0,
      withholdingAmount: 50,
      expectedAmountPayable: 450,
    },
    {
      amount: 501,
      decimalPlaces: 0,
      withholdingAmount: 50,
      expectedAmountPayable: 451,
    },
    {
      amount: 600,
      decimalPlaces: 2,
      withholdingAmount: 0,
      expectedAmountPayable: 600,
    },
    {
      amount: 600,
      decimalPlaces: 2,
      withholdingAmount: 60,
      expectedAmountPayable: 540,
    },
    {
      amount: 601.55,
      decimalPlaces: 2,
      withholdingAmount: 60,
      expectedAmountPayable: 541.55,
    },
  ];

  test('Execute calculateAmountPayable test with TEST_DATA', () => {
    TEST_DATA.forEach((param) => {
      const amountPayable = calculateAmountPayable(
        param.amount,
        param.decimalPlaces,
        param.withholdingAmount
      );
      expect(amountPayable).toBe(param.expectedAmountPayable);
    });
  });
});

describe('calculateAmountForCCTrans(testParam)', () => {
  const TEST_DATA = [
    {
      amount: 500,
      decimalPlaces: 0,
      withholdingAmount: 0,
      expectedAmount: 500,
    },
    {
      amount: 500,
      decimalPlaces: 0,
      withholdingAmount: 50,
      expectedAmount: 550,
    },
    {
      amount: 501,
      decimalPlaces: 0,
      withholdingAmount: 50,
      expectedAmount: 551,
    },
    {
      amount: 600.01,
      decimalPlaces: 2,
      withholdingAmount: 0,
      expectedAmount: 600.01,
    },
    {
      amount: 601.25,
      decimalPlaces: 2,
      withholdingAmount: 60.3,
      expectedAmount: 661.55,
    },
    {
      amount: 602.05,
      decimalPlaces: 2,
      withholdingAmount: 60.0,
      expectedAmount: 662.05,
    },
  ];

  test('Execute calculateAmountForCCTrans test with TEST_DATA', () => {
    TEST_DATA.forEach((param) => {
      const amount = calculateAmountForCCTrans(
        param.amount,
        param.decimalPlaces,
        param.withholdingAmount
      );
      expect(amount).toBe(param.expectedAmount);
    });
  });
});
