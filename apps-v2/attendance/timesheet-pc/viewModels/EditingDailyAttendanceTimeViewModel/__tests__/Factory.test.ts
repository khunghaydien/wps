import snapshotDiff from 'snapshot-diff';

import { MAX_STANDARD_REST_TIME_COUNT } from '@attendance/domain/models/RestTime';

import Factory from '../Factory';

jest.mock('nanoid', () => ({
  __esModule: true,
  default: () => 'test-nanoid',
}));

describe('createByAttRecord', () => {
  // Arrange
  const input = [
    {
      id: 'id',
      recordDate: 'recordDate',
      startTime: 'startTime',
      endTime: 'endTime',
      dailyRestList: [],
      restHours: 'restHours',
      otherRestReason: 'otherRestReason',
      hasRestTime: 'hasRestTime',
      remarks: 'remarks',
    },
    MAX_STANDARD_REST_TIME_COUNT,
    {
      deviatedEnteringTimeReason: {
        value: null,
        text: 'deviatedEnteringTimeReason',
      },
      deviatedLeavingTimeReason: {
        value: null,
        text: 'deviatedLeavingTimeReason',
      },
    },
  ] as unknown as Parameters<typeof Factory['createByAttRecord']>;
  it('should execute', () => {
    // Act
    const result = Factory.createByAttRecord(...input);

    // Assert
    expect(snapshotDiff(input[0], result)).toMatchSnapshot();
  });
  describe.each(['deviatedEnteringTimeReason', 'deviatedLeavingTimeReason'])(
    '%s',
    (key) => {
      it.each([undefined, null])('should convert if value is %s', (value) => {
        // Arrange
        const maxRestTimesCount = input[1] as unknown as Parameters<
          typeof Factory['createByAttRecord']
        >[1];
        const $input = {
          ...input[2],
        } as unknown as Parameters<typeof Factory['createByAttRecord']>[2];
        $input[key].text = value;

        // Act
        const result = Factory.createByAttRecord(
          input[0],
          maxRestTimesCount,
          $input
        );

        // Assert
        expect(result.dailyObjectivelyEventLog[key]).toEqual({
          value: null,
          text: '',
        });
      });
    }
  );
  it.each([undefined, null, ''])('should convert remarks', (remarks) => {
    // Arrange
    const $input = {
      ...input[0],
      remarks,
    } as unknown as Parameters<typeof Factory['createByAttRecord']>[0];
    const maxRestTimesCount = input[1] as unknown as Parameters<
      typeof Factory['createByAttRecord']
    >[1];

    // Act
    const result = Factory.createByAttRecord($input, maxRestTimesCount);

    // Assert
    expect(result.remarks).toBe('');
  });
  it('should add empty restTime when not having restTime', () => {
    // Arrange
    const $input = {
      ...input[0],
      dailyRestList: [],
    } as unknown as Parameters<typeof Factory['createByAttRecord']>[0];
    const maxRestTimesCount = input[1] as unknown as Parameters<
      typeof Factory['createByAttRecord']
    >[1];

    // Act
    const result = Factory.createByAttRecord($input, maxRestTimesCount);

    // Assert
    expect(result.restTimes.length).toEqual(1);
    expect(result.restTimes.at(0).id).not.toBe(null);
    expect(result.restTimes.at(0).id).not.toBe(undefined);
    expect(result.restTimes.at(0).startTime).toEqual(null);
    expect(result.restTimes.at(0).endTime).toEqual(null);
    expect(result.restTimes.at(0).restReason).toEqual(null);
  });
  it('should be shorten restTimes if value is null', () => {
    // Arrange
    const $input = {
      ...input[0],
      dailyRestList: [],
    } as unknown as Parameters<typeof Factory['createByAttRecord']>[0];
    const maxRestTimesCount = input[1] as unknown as Parameters<
      typeof Factory['createByAttRecord']
    >[1];

    // Arrange
    const dailyRestList = [
      {
        restStartTime: 'restStartTime',
        restEndTime: 'restEndTime',
        restReason: 'restReason',
      },
      {
        restStartTime: null,
        restEndTime: null,
        restReason: null,
      },
    ];
    // Act
    const result = Factory.createByAttRecord(
      {
        ...$input,
        dailyRestList,
      } as unknown as Parameters<typeof Factory['createByAttRecord']>[0],
      maxRestTimesCount as unknown as Parameters<
        typeof Factory['createByAttRecord']
      >[1]
    );

    // Assert
    expect(result.restTimes.length).toEqual(1);
    expect(result.restTimes.at(0).startTime).toEqual('restStartTime');
    expect(result.restTimes.at(0).endTime).toEqual('restEndTime');
    expect(result.restTimes.at(0).restReason).toEqual('restReason');
  });
});
