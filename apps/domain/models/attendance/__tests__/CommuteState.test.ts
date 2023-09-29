import { Record } from '@apps/timesheet-pc-summary/models/Record';

import {
  canShowCommuteColumn,
  COMMUTE_STATE,
  existRecordWithCommuteCount,
  toCommuteCount,
  toCommuteState,
} from '../CommuteCount';

describe('toCommuteState', () => {
  test(`should be "${COMMUTE_STATE.UNENTERED}" if CommuteForwardCount and CommuteBackwardCount are null.`, () => {
    expect(toCommuteState(null, null)).toBe(COMMUTE_STATE.UNENTERED);
  });
  test(`should be "${COMMUTE_STATE.NONE}" if CommuteForwardCount and CommuteBackwardCount are 0.`, () => {
    expect(toCommuteState(0, 0)).toBe(COMMUTE_STATE.NONE);
  });
  test(`should be "${COMMUTE_STATE.FORWARD}" if CommuteForwardCount is 1 or more and CommuteBackwardCount is 0.`, () => {
    expect(toCommuteState(1, 0)).toBe(COMMUTE_STATE.FORWARD);
    expect(toCommuteState(2, 0)).toBe(COMMUTE_STATE.FORWARD);
  });
  test(`should be "${COMMUTE_STATE.BACKWARD}" if CommuteForwardCount is 0 and CommuteBackwardCount is 1 or more.`, () => {
    expect(toCommuteState(0, 1)).toBe(COMMUTE_STATE.BACKWARD);
    expect(toCommuteState(0, 2)).toBe(COMMUTE_STATE.BACKWARD);
  });
  test(`should be "${COMMUTE_STATE.BOTH_WAYS}" if CommuteForwardCount is 1 or more and CommuteBackwardCount 1 or more.`, () => {
    expect(toCommuteState(1, 1)).toBe(COMMUTE_STATE.BOTH_WAYS);
    expect(toCommuteState(2, 2)).toBe(COMMUTE_STATE.BOTH_WAYS);
  });
});

describe('toCommuteCount', () => {
  test(`should be [null, null] if Commute State is "${COMMUTE_STATE.UNENTERED}".`, () => {
    expect(toCommuteCount(COMMUTE_STATE.UNENTERED)).toEqual([null, null]);
  });
  test(`should be [0, 0] if Commute State is "${COMMUTE_STATE.NONE}".`, () => {
    expect(toCommuteCount(COMMUTE_STATE.NONE)).toEqual([0, 0]);
  });
  test(`should be [1, 0] if Commute State is "${COMMUTE_STATE.FORWARD}".`, () => {
    expect(toCommuteCount(COMMUTE_STATE.FORWARD)).toEqual([1, 0]);
  });
  test(`should be [0, 1] if Commute State is "${COMMUTE_STATE.BACKWARD}".`, () => {
    expect(toCommuteCount(COMMUTE_STATE.BACKWARD)).toEqual([0, 1]);
  });
  test(`should be [1, 1] if Commute State is "${COMMUTE_STATE.BOTH_WAYS}".`, () => {
    expect(toCommuteCount(COMMUTE_STATE.BOTH_WAYS)).toEqual([1, 1]);
  });
});

describe('canShowCommuteColumn', () => {
  test(`should be false if CommuteForwardCount and CommuteBackwardCount are 99.`, () => {
    const attRecords = [
      { commuteCountForward: 99, commuteCountBackward: 99 },
    ] as Record[];
    expect(canShowCommuteColumn(attRecords)).toBe(false);
  });
  test(`should be true if CommuteForwardCount and CommuteBackwardCount are null.`, () => {
    const attRecords = [
      { commuteCountForward: null, commuteCountBackward: null },
    ] as Record[];
    expect(canShowCommuteColumn(attRecords)).toBe(true);
  });
  test(`should be true if CommuteForwardCount and CommuteBackwardCount are 0.`, () => {
    const attRecords = [
      { commuteCountForward: 0, commuteCountBackward: 0 },
    ] as Record[];
    expect(canShowCommuteColumn(attRecords)).toBe(true);
  });
  test(`should be true if CommuteForwardCount is 1 or more and CommuteBackwardCount is 0.`, () => {
    const attRecords = [
      { commuteCountForward: 1, commuteCountBackward: 0 },
    ] as Record[];
    expect(canShowCommuteColumn(attRecords)).toBe(true);
  });
  test(`should be true if CommuteForwardCount is 0 and CommuteBackwardCount is 1 or more.`, () => {
    const attRecords = [
      { commuteCountForward: 0, commuteCountBackward: 1 },
    ] as Record[];
    expect(canShowCommuteColumn(attRecords)).toBe(true);
  });
  test(`should be true if CommuteForwardCount is 1 or more and CommuteBackwardCount 1 or more.`, () => {
    const attRecords = [
      { commuteCountForward: 1, commuteCountBackward: 1 },
    ] as Record[];
    expect(canShowCommuteColumn(attRecords)).toBe(true);
  });
});

describe('existRecordWithCommuteCount', () => {
  test(`should be false if CommuteForwardCount and CommuteBackwardCount are -1.`, () => {
    expect(
      existRecordWithCommuteCount({
        commuteForwardCount: -1,
        commuteBackwardCount: -1,
      })
    ).toBe(false);
  });
  test(`should be true if CommuteForwardCount and CommuteBackwardCount are null.`, () => {
    expect(
      existRecordWithCommuteCount({
        commuteForwardCount: null,
        commuteBackwardCount: null,
      })
    ).toBe(true);
  });
  test(`should be true if CommuteForwardCount and CommuteBackwardCount are 0.`, () => {
    expect(
      existRecordWithCommuteCount({
        commuteForwardCount: 0,
        commuteBackwardCount: 0,
      })
    ).toBe(true);
  });
  test(`should be true if CommuteForwardCount is 1 and CommuteBackwardCount is 0.`, () => {
    expect(
      existRecordWithCommuteCount({
        commuteForwardCount: 1,
        commuteBackwardCount: 0,
      })
    ).toBe(true);
  });
  test(`should be true if CommuteForwardCount is 0 and CommuteBackwardCount is 1.`, () => {
    expect(
      existRecordWithCommuteCount({
        commuteForwardCount: 0,
        commuteBackwardCount: 1,
      })
    ).toBe(true);
  });
  test(`should be true if CommuteForwardCount is 1 and CommuteBackwardCount 1.`, () => {
    expect(
      existRecordWithCommuteCount({
        commuteForwardCount: 1,
        commuteBackwardCount: 1,
      })
    ).toBe(true);
  });
});
