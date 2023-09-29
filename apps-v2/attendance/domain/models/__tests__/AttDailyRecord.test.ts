import * as AttDailyRecord from '../AttDailyRecord';

test.each([
  [
    'あり',
    {
      insufficientRestTime: 0,
      startTime: null,
      endTime: null,
      outStartTime: null,
      outEndTime: null,
    },
    false,
  ],
  [
    'なし',
    {
      insufficientRestTime: 5,
      startTime: null,
      endTime: null,
      outStartTime: null,
      outEndTime: null,
    },
    true,
  ],
])('hasInsufficientRestTime %s', (name, record, result) => {
  expect(AttDailyRecord.hasInsufficientRestTime(record)).toEqual(result);
});

test.each([
  [
    'なし',
    {
      outInsufficientMinimumWorkHours: 0,
      startTime: null,
      endTime: null,
      outStartTime: null,
      outEndTime: null,
    },
    false,
  ],
  [
    'あり',
    {
      outInsufficientMinimumWorkHours: 5,
      startTime: null,
      endTime: null,
      outStartTime: null,
      outEndTime: null,
    },
    true,
  ],
])('hasOutInsufficientMinimumWorkHours %s', (name, record, result) => {
  expect(AttDailyRecord.hasOutInsufficientMinimumWorkHours(record)).toEqual(
    result
  );
});

test.each([
  [
    '時間外で出退勤',
    {
      startTime: 0,
      endTime: 1 * 60,
      outStartTime: 0,
      outEndTime: 0,
    },
    [false, true, false],
  ],
  [
    '出勤が時間外',
    {
      startTime: 0,
      endTime: 2 * 60,
      outStartTime: 1 * 60,
      outEndTime: 2 * 60,
    },
    [true, false, true],
  ],
  [
    '退勤が時間外',
    {
      startTime: 0,
      endTime: 2 * 60,
      outStartTime: 0,
      outEndTime: 1 * 60,
    },
    [true, true, false],
  ],
  [
    '時間内で働いた時間が有るが出退勤時間が時間外',
    {
      startTime: 0,
      endTime: 3 * 60,
      outStartTime: 1 * 60,
      outEndTime: 2 * 60,
    },
    [true, false, false],
  ],
])('勤務時間外 %s', (name, record, results) => {
  expect(
    AttDailyRecord.isRealWorkingTimeOnEffectiveWorkingTime(record)
  ).toEqual(results[0]);
  expect(AttDailyRecord.isRealStartTimeOnEffectiveWorkingTime(record)).toEqual(
    results[1]
  );
  expect(AttDailyRecord.isRealEndTimeOnEffectiveWorkingTime(record)).toEqual(
    results[2]
  );
});
