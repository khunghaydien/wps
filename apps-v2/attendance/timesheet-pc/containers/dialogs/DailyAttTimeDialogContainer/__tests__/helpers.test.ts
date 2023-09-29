import cloneDeep from 'lodash/cloneDeep';

import * as helpers from '../helpers';

jest.mock('nanoid', () => {
  let i = 1;
  return {
    __esModule: true,
    default: () => `${i++}`,
  };
});

describe('isChange', () => {
  // Arrange
  const input = {
    dailyAttTime: {
      recordId: 'recordId',
      recordDate: null,
      restTimes: [
        {
          startTime: null,
          endTime: null,
          restReason: null,
        },
      ],
      restHours: null,
      otherRestReason: null,
      dailyObjectivelyEventLog: null,
      remarks: null,
    },
    attRecord: {
      id: 'recordId',
      recordDate: null,
      restList: [],
      restHours: null,
      otherRestReason: null,
      dailyObjectivelyEventLog: null,
      remarks: null,
    },
    dailyObjectivelyEventLog: null,
  } as unknown as Parameters<typeof helpers['isChange']>[0];

  it.each`
    before | after  | expected
    ${'A'} | ${'A'} | ${false}
    ${'A'} | ${'B'} | ${true}
    ${'B'} | ${'A'} | ${true}
    ${'B'} | ${'B'} | ${false}
  `('should execute', ({ before, after, expected }) => {
    // Arrange
    const $input = cloneDeep(input);
    $input.dailyAttTime.remarks = after;
    $input.attRecord.remarks = before;

    // Act
    const result = helpers.isChange($input);

    // Assert
    expect(result).toBe(expected);
  });
});
