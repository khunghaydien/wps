import * as RestTime from '../RestTime';

describe('create', () => {
  it('should create new restTime', () => {
    expect(RestTime.create()).toEqual({
      startTime: null,
      endTime: null,
      restReason: null,
    });
  });
  it('should create new restTime with param', () => {
    expect(
      RestTime.create({
        startTime: 0,
        endTime: 0,
        restReason: null,
        other: 'test',
      })
    ).toEqual({
      startTime: 0,
      endTime: 0,
      restReason: null,
    });
  });
});

describe('convert', () => {
  it('should a given restTimes be unchanged', () => {
    // Arrange
    const restTime = {
      startTime: 540,
      endTime: 600,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    };
    const expectRestTime = restTime;
    // Act
    const actual = RestTime.convert(restTime);
    // Assert
    expect(actual).toStrictEqual(expectRestTime);
  });
  it('should be converted from a string to an int', () => {
    // Arrange
    const restTime = {
      startTime: '540',
      endTime: '600',
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    };
    const expectRestTime = {
      startTime: 540,
      endTime: 600,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    };
    // Act
    const actual = RestTime.convert(restTime);
    // Assert
    expect(actual).toStrictEqual(expectRestTime);
  });
  it('should change the value of it to null if there is an invalid value in the given restTimes', () => {
    // Arrange
    const restTime = {
      startTime: 'ああああああ',
      endTime: 'Invalid Time',
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    };
    const expectRestTime = {
      startTime: null,
      endTime: null,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    };
    // Act
    const actual = RestTime.convert(restTime);
    // Assert
    expect(actual).toStrictEqual(expectRestTime);
  });
});

describe('convertRestTimes', () => {
  it('should a given restTimes be unchanged', () => {
    // Arrange
    const restTimes = [
      {
        startTime: 540,
        endTime: 600,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 660,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 840,
        endTime: 1020,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1080,
        endTime: 1200,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1380,
        endTime: 1560,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ];
    const expectRestTime = restTimes;
    // Act
    const actual = RestTime.convertRestTimes(restTimes);
    // Assert
    expect(actual).toStrictEqual(expectRestTime);
  });
  it('should be converted from a string to an int', () => {
    // Arrange
    const restTimes = [
      {
        startTime: '540',
        endTime: '600',
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: '660',
        endTime: '780',
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: '840',
        endTime: '1020',
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: '1080',
        endTime: '1200',
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: '1380',
        endTime: '1560',
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ];
    const expectRestTime = [
      {
        startTime: 540,
        endTime: 600,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 660,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 840,
        endTime: 1020,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1080,
        endTime: 1200,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 1380,
        endTime: 1560,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ];
    // Act
    const actual = RestTime.convertRestTimes(restTimes);
    // Assert
    expect(actual).toStrictEqual(expectRestTime);
  });
  it('should change the value of it to null if there is an invalid value in the given restTimes', () => {
    // Arrange
    const restTimes = [
      {
        startTime: 'ああああああ',
        endTime: 'Invalid Time',
        restReason: null,
      },
      {
        startTime: 660,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: {},
        endTime: {},
        restReason: null,
      },
      {
        startTime: 1080,
        endTime: 1200,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: undefined,
        endTime: undefined,
        restReason: null,
      },
    ];
    const expectRestTime = [
      {
        startTime: null,
        endTime: null,
        restReason: null,
      },
      {
        startTime: 660,
        endTime: 780,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: null,
        endTime: null,
        restReason: null,
      },
      {
        startTime: 1080,
        endTime: 1200,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: null,
        endTime: null,
        restReason: null,
      },
    ];
    // Act
    const actual = RestTime.convertRestTimes(restTimes);
    // Assert
    expect(actual).toStrictEqual(expectRestTime);
  });
});

describe('isLast', () => {
  it.each`
    idx                                          | length                                   | expected
    ${-1}                                        | ${0}                                     | ${true}
    ${0}                                         | ${0}                                     | ${false}
    ${0}                                         | ${1}                                     | ${true}
    ${0}                                         | ${RestTime.MAX_STANDARD_REST_TIME_COUNT} | ${false}
    ${RestTime.MAX_STANDARD_REST_TIME_COUNT - 1} | ${RestTime.MAX_STANDARD_REST_TIME_COUNT} | ${true}
  `(
    'should return $expected when [idx=$idx, length=$length]',
    ({ idx, length, expected }) => {
      expect(
        RestTime.isLast(idx)(new Array(length) as RestTime.RestTimes)
      ).toBe(expected);
    }
  );
});

describe('isAddable', () => {
  it.each`
    idx                                          | length                                   | maxLength                                | expected
    ${-1}                                        | ${0}                                     | ${RestTime.MAX_STANDARD_REST_TIME_COUNT} | ${true}
    ${0}                                         | ${0}                                     | ${RestTime.MAX_STANDARD_REST_TIME_COUNT} | ${true}
    ${0}                                         | ${1}                                     | ${RestTime.MAX_STANDARD_REST_TIME_COUNT} | ${true}
    ${0}                                         | ${RestTime.MAX_STANDARD_REST_TIME_COUNT} | ${RestTime.MAX_STANDARD_REST_TIME_COUNT} | ${true}
    ${RestTime.MAX_STANDARD_REST_TIME_COUNT - 1} | ${RestTime.MAX_STANDARD_REST_TIME_COUNT} | ${RestTime.MAX_STANDARD_REST_TIME_COUNT} | ${false}
    ${RestTime.MAX_STANDARD_REST_TIME_COUNT - 1} | ${RestTime.MAX_STANDARD_REST_TIME_COUNT} | ${10}                                    | ${true}
  `(
    'should return $expected when [idx=$idx, length=$length, maxLength=$maxLength]',
    ({ idx, length, maxLength, expected }) => {
      expect(
        RestTime.isAddable(maxLength)(idx)(
          new Array(length) as RestTime.RestTimes
        )
      ).toBe(expected);
    }
  );
});

describe('isDeletable', () => {
  it.each`
    idx                                          | length                                   | expected
    ${-1}                                        | ${0}                                     | ${false}
    ${0}                                         | ${0}                                     | ${false}
    ${0}                                         | ${1}                                     | ${false}
    ${0}                                         | ${RestTime.MAX_STANDARD_REST_TIME_COUNT} | ${true}
    ${RestTime.MAX_STANDARD_REST_TIME_COUNT - 1} | ${RestTime.MAX_STANDARD_REST_TIME_COUNT} | ${true}
  `(
    'should return $expected when [idx=$idx, length=$length]',
    ({ idx, length, expected }) => {
      expect(
        RestTime.isDeletable(idx)(new Array(length) as RestTime.RestTimes)
      ).toBe(expected);
    }
  );
});
