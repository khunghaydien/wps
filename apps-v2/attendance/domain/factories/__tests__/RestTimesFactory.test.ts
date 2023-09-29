import createRestTimesFactory from '../RestTimesFactory';

describe('create', () => {
  it('should create new restTime', () => {
    expect(createRestTimesFactory()().create()).toStrictEqual([]);
  });
});

describe('filter', () => {
  it('should removed from restTimes if startTime and endTime contains a null', () => {
    // Arrange
    const restTimes = [
      {
        startTime: null,
        endTime: 360,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 660,
        endTime: null,
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
    ];
    const expectRestTimes = [
      {
        startTime: null,
        endTime: 360,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        startTime: 660,
        endTime: null,
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
    ];
    // Act
    const actual = createRestTimesFactory()().filter(restTimes);
    // Assert
    expect(actual).toStrictEqual(expectRestTimes);
  });
});

describe('insert', () => {
  it('should insert the specified restTime', () => {
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
        startTime: 840,
        endTime: 1020,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ];
    const expectRestTimes = [
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
    ];
    // Act
    const actual = createRestTimesFactory()().insert(restTimes, 1, {
      startTime: 660,
      endTime: 780,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    });
    // Assert
    expect(actual).toStrictEqual(expectRestTimes);
  });
  it('should insert to last the unspecified restTime', () => {
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
    ];
    // Act
    const actual = createRestTimesFactory()().insert(restTimes, 3);
    // Assert
    expect(actual).toStrictEqual([
      ...restTimes,
      {
        startTime: null,
        endTime: null,
        restReason: null,
      },
    ]);
  });
});

describe('remove', () => {
  it('should remove the specified restTime', () => {
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
    ];
    const expectRestTimes = [
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
        startTime: 840,
        endTime: 1020,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ];
    // Act
    const actual = createRestTimesFactory()().remove(restTimes, 1);
    // Assert
    expect(actual).toStrictEqual(expectRestTimes);
  });
  it('should not remove the unspecified restTime', () => {
    // Arrange
    const expectRestTimes = [
      {
        startTime: 540,
        endTime: 600,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ];
    // Act
    const actual = createRestTimesFactory()().remove(expectRestTimes, 3);
    // Assert
    expect(actual).toStrictEqual(expectRestTimes);
  });
});

describe('update', () => {
  it('should be updated by the specified restTime', () => {
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
    ];
    const expectRestTimes = [
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
        startTime: 1200,
        endTime: 1260,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ];
    // Act
    const actual = createRestTimesFactory()().update(restTimes, 2, {
      startTime: 1200,
      endTime: 1260,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    });
    // Assert
    expect(actual).toStrictEqual(expectRestTimes);
  });
});

describe('push', () => {
  it('should at the back of the list and the value should remain unchanged', () => {
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
    ];
    const expectRestTimes = [
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
    const actual = createRestTimesFactory()().push(restTimes, {
      startTime: 1380,
      endTime: 1560,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    });
    // Assert
    expect(actual).toStrictEqual(expectRestTimes);
  });
  it('should not push more than 5 restTime', () => {
    // Arrange
    const expectRestTimes = [
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
    const actual = createRestTimesFactory()().push(expectRestTimes, {
      startTime: 1600,
      endTime: 1660,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    });
    // Assert
    expect(actual).toStrictEqual(expectRestTimes);
  });
  it('should push more than 5 restTime', () => {
    // Arrange
    const expectRestTimes = [
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
    const actual = createRestTimesFactory()({ maxLength: 10 }).push(
      expectRestTimes,
      {
        startTime: 1600,
        endTime: 1660,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      }
    );
    // Assert
    expect(actual).toStrictEqual([
      ...expectRestTimes,
      {
        startTime: 1600,
        endTime: 1660,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ]);
  });
  it('should not push more then 1 restTime', () => {
    // Arrange
    const expectRestTimes = [
      {
        startTime: 540,
        endTime: 600,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ];
    // Act
    const actual = createRestTimesFactory()({ maxLength: 1 }).push(
      expectRestTimes,
      {
        startTime: 1600,
        endTime: 1660,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      }
    );
    // Assert
    expect(actual).toStrictEqual(expectRestTimes);
  });
  it('should push with restTimeFactory.create()', () => {
    // Arrange
    const expectRestTimes = [
      {
        id: '',
        startTime: 540,
        endTime: 600,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ];
    // Act
    const actual = createRestTimesFactory({
      create: () => ({
        id: 'id',
        startTime: null,
        endTime: null,
        restReason: null,
      }),
    })().push(expectRestTimes);
    // Assert
    expect(actual).toStrictEqual([
      {
        id: '',
        startTime: 540,
        endTime: 600,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
      {
        id: 'id',
        startTime: null,
        endTime: null,
        restReason: null,
      },
    ]);
  });
});

describe('pushLast', () => {
  it('should not push a restTime with 0 length', () => {
    // Arrange
    const restTimes = [];
    const expectRestTimes = [
      {
        startTime: null,
        endTime: null,
        restReason: null,
      },
    ];
    // Act
    const actual = createRestTimesFactory()().pushLast(restTimes);
    // Assert
    expect(actual).toStrictEqual(expectRestTimes);
  });
  it('should push a restTime with a null value', () => {
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
    ];
    const expectRestTimes = [
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
        startTime: null,
        endTime: null,
        restReason: null,
      },
    ];
    // Act
    const actual = createRestTimesFactory()().pushLast(restTimes);
    // Assert
    expect(actual).toStrictEqual(expectRestTimes);
  });
  it('should not push more than 5 restTime', () => {
    // Arrange
    const expectRestTimes = [
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
    const actual = createRestTimesFactory()().pushLast(expectRestTimes);
    // Assert
    expect(actual).toStrictEqual(expectRestTimes);
  });
  it('should push more than 5 restTime', () => {
    // Arrange
    const expectRestTimes = [
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
    const actual = createRestTimesFactory()({ maxLength: 10 }).pushLast(
      expectRestTimes
    );
    // Assert
    expect(actual).toStrictEqual([
      ...expectRestTimes,
      {
        startTime: null,
        endTime: null,
        restReason: null,
      },
    ]);
  });
  it('should not push more then 1 restTime', () => {
    // Arrange
    const expectRestTimes = [
      {
        startTime: 540,
        endTime: 600,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ];
    // Act
    const actual = createRestTimesFactory()({ maxLength: 1 }).pushLast(
      expectRestTimes
    );
    // Assert
    expect(actual).toStrictEqual(expectRestTimes);
  });
  it('should push with restTimeFactory.create()', () => {
    // Arrange
    const expectRestTimes = [
      {
        id: '',
        startTime: 540,
        endTime: 600,
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      },
    ];
    // Act
    const actual = createRestTimesFactory({
      create: () => ({
        id: '',
        startTime: null,
        endTime: null,
        restReason: null,
      }),
    })().pushLast(expectRestTimes);
    // Assert
    expect(actual).toStrictEqual([
      ...expectRestTimes,
      {
        id: '',
        startTime: null,
        endTime: null,
        restReason: null,
      },
    ]);
  });
});
