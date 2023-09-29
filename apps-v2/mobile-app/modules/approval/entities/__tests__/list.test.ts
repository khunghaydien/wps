import flow from 'lodash/fp/flow';

import snapshotDiff from 'snapshot-diff';

import { list as records } from '@apps/domain/models/approval/request/__test__/mocks/Request';
import {
  ApprRequestList,
  REQUEST_TYPE,
} from '@apps/domain/models/approval/request/Request';

import reducer, {
  // @ts-ignore
  __get__,
  check,
  checkAll,
  CHECKED_MAX,
  initialize,
  setFilterType,
  setRecords,
  State,
  toggle,
  toggleAll,
  uncheck,
  uncheckAll,
} from '../list';

const ACTION_TYPES = __get__('ACTION_TYPES');
const initialState = __get__('initialState');

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(`${ACTION_TYPES.INITIALIZE}`, () => {
    const prev: State = initialState;
    const next = reducer(
      prev,
      initialize({
        canBulkApproveAttDailyRequest: true,
        canBulkApproveAttRequest: true,
      })
    );
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  describe(`${ACTION_TYPES.SET_RECORDS}`, () => {
    it('should do', () => {
      const prev: State = initialState;
      const next = reducer(prev, setRecords(records));
      expect(next.original).toHaveLength(3);
      expect(next.filteredList).toHaveLength(3);
      expect(next.filterType).toEqual('all');
      expect(next.checked).toEqual([]);
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    it('should not update other state', () => {
      const prev: State = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) => reducer(state, setFilterType(REQUEST_TYPE.ATTENDANCE_DAILY)),
        (state) => reducer(state, check(records[0].requestId))
      )(initialState);
      const next = reducer(
        prev,
        setRecords([
          ...records,
          {
            requestId: '99999',
            requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
          },
        ] as unknown as ApprRequestList)
      );
      expect(next.original).toHaveLength(4);
      expect(next.filteredList).toHaveLength(3);
      expect(next.filterType).toEqual(REQUEST_TYPE.ATTENDANCE_DAILY);
      expect(next.checked).toEqual([records[0].requestId]);
      expect(next.checkedAll).toBe(false);
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    describe('checkedAll', () => {
      it('should be false from false', () => {
        const prev: State = flow(
          (state) =>
            reducer(
              state,
              initialize({
                canBulkApproveAttDailyRequest: true,
                canBulkApproveAttRequest: true,
              })
            ),
          (state) => reducer(state, setRecords(records)),
          (state) => reducer(state, check(records[0].requestId))
        )(initialState);
        const next = reducer(
          prev,
          setRecords([
            {
              requestId: '99999',
              requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
            },
          ] as unknown as ApprRequestList)
        );
        expect(next.original).toHaveLength(1);
        expect(next.checked).toEqual([]);
        expect(next.checkedAll).toBe(false);
        expect(snapshotDiff(prev, next)).toMatchSnapshot();
      });
      it('should be false from true', () => {
        const prev: State = flow(
          (state) =>
            reducer(
              state,
              initialize({
                canBulkApproveAttDailyRequest: true,
                canBulkApproveAttRequest: true,
              })
            ),
          (state) => reducer(state, setRecords(records)),
          (state) => reducer(state, checkAll())
        )(initialState);
        const next = reducer(
          prev,
          setRecords([
            ...records,
            {
              requestId: '99999',
              requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
            },
          ] as unknown as ApprRequestList)
        );
        expect(next.original).toHaveLength(4);
        expect(next.checked).toEqual([
          records[0].requestId,
          records[1].requestId,
          records[2].requestId,
        ]);
        expect(next.checkedAll).toBe(false);
        expect(snapshotDiff(prev, next)).toMatchSnapshot();
      });
      it('should be true from false', () => {
        const prev: State = flow(
          (state) =>
            reducer(
              state,
              initialize({
                canBulkApproveAttDailyRequest: true,
                canBulkApproveAttRequest: true,
              })
            ),
          (state) => reducer(state, setRecords(records)),
          (state) =>
            reducer(state, check(records[0].requestId, records[1].requestId))
        )(initialState);
        const next = reducer(prev, setRecords([records[0], records[1]]));
        expect(next.original).toHaveLength(2);
        expect(next.checked).toEqual([
          records[0].requestId,
          records[1].requestId,
        ]);
        expect(next.checkedAll).toBe(true);
        expect(snapshotDiff(prev, next)).toMatchSnapshot();
      });
      it('should be true from true', () => {
        const prev: State = flow(
          (state) =>
            reducer(
              state,
              initialize({
                canBulkApproveAttDailyRequest: true,
                canBulkApproveAttRequest: true,
              })
            ),
          (state) => reducer(state, setRecords(records)),
          (state) => reducer(state, checkAll())
        )(initialState);
        const next = reducer(prev, setRecords([records[0]]));
        expect(next.original).toHaveLength(1);
        expect(next.checked).toEqual([records[0].requestId]);
        expect(next.checkedAll).toBe(true);
        expect(snapshotDiff(prev, next)).toMatchSnapshot();
      });
    });
    it.each`
      daily    | fixMonthly | expected
      ${false} | ${false}   | ${0}
      ${false} | ${true}    | ${1}
      ${true}  | ${false}   | ${2}
      ${true}  | ${true}    | ${3}
    `(
      'should filter targetList if [daily=$daily, fixMonthly=$fixMonthly]',
      ({ daily, fixMonthly, expected }) => {
        const records = [
          {
            requestId: '1',
            requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
          },
          {
            requestId: '2',
            requestType: REQUEST_TYPE.ATTENDANCE_FIX,
          },
          {
            requestId: '3',
            requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
          },
        ] as unknown as ApprRequestList;
        const state: State = flow(
          (state) =>
            reducer(
              state,
              initialize({
                canBulkApproveAttDailyRequest: daily,
                canBulkApproveAttRequest: fixMonthly,
              })
            ),
          (state) => reducer(state, setRecords(records))
        )(initialState);
        expect(state.targetList).toHaveLength(expected);
      }
    );
  });
  describe(`${ACTION_TYPES.SET_FILTER_TYPE}`, () => {
    it('should do', () => {
      const prev: State = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records))
      )(initialState);
      const next = reducer(prev, setFilterType(REQUEST_TYPE.ATTENDANCE_FIX));
      expect(next.original).toHaveLength(3);
      expect(next.filteredList).toHaveLength(1);
      expect(next.filterType).toEqual(REQUEST_TYPE.ATTENDANCE_FIX);
      expect(next.checked).toEqual([]);
      expect(next.checkedAll).toEqual(false);
    });
    it.each`
      filterType                       | daily    | fixMonthly | expected
      ${'all'}                         | ${false} | ${false}   | ${0}
      ${REQUEST_TYPE.ATTENDANCE_DAILY} | ${false} | ${false}   | ${0}
      ${REQUEST_TYPE.ATTENDANCE_FIX}   | ${false} | ${false}   | ${0}
      ${'all'}                         | ${false} | ${true}    | ${1}
      ${REQUEST_TYPE.ATTENDANCE_DAILY} | ${false} | ${true}    | ${0}
      ${REQUEST_TYPE.ATTENDANCE_FIX}   | ${false} | ${true}    | ${1}
      ${'all'}                         | ${true}  | ${false}   | ${2}
      ${REQUEST_TYPE.ATTENDANCE_DAILY} | ${true}  | ${false}   | ${2}
      ${REQUEST_TYPE.ATTENDANCE_FIX}   | ${true}  | ${false}   | ${0}
      ${'all'}                         | ${true}  | ${true}    | ${3}
      ${REQUEST_TYPE.ATTENDANCE_DAILY} | ${true}  | ${true}    | ${2}
      ${REQUEST_TYPE.ATTENDANCE_FIX}   | ${true}  | ${true}    | ${1}
    `(
      'should filter targetList if [filterType=$filterType, daily=$daily, fixMonthly=$fixMonthly]',
      ({ filterType, daily, fixMonthly, expected }) => {
        const records = [
          {
            requestId: '1',
            requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
          },
          {
            requestId: '2',
            requestType: REQUEST_TYPE.ATTENDANCE_FIX,
          },
          {
            requestId: '3',
            requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
          },
        ] as unknown as ApprRequestList;
        const state: State = flow(
          (state) =>
            reducer(
              state,
              initialize({
                canBulkApproveAttDailyRequest: daily,
                canBulkApproveAttRequest: fixMonthly,
              })
            ),
          (state) => reducer(state, setRecords(records)),
          (state) => reducer(state, setFilterType(filterType))
        )(initialState);
        expect(state.targetList).toHaveLength(expected);
      }
    );
    it('should reset "checked"', () => {
      const state: State = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) => reducer(state, check(records[0].requestId)),
        (state) => reducer(state, setFilterType(REQUEST_TYPE.ATTENDANCE_FIX))
      )(initialState);
      expect(state.checked).toEqual([]);
    });
  });
  describe(`${ACTION_TYPES.CHECK}`, () => {
    it('should do.', () => {
      const prev: State = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records))
      )(initialState);
      const next = reducer(prev, check(records[0].requestId));
      expect(next.checked).toEqual([records[0].requestId]);
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    it('should do twice.', () => {
      const state = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) => reducer(state, check(records[0].requestId)),
        (state) => reducer(state, check(records[1].requestId))
      )(initialState);
      expect(state.checked).toEqual([
        records[0].requestId,
        records[1].requestId,
      ]);
    });
    it('should do with multiple', () => {
      const state = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) =>
          reducer(state, check(records[0].requestId, records[1].requestId))
      )(initialState);
      expect(state.checked).toEqual([
        records[0].requestId,
        records[1].requestId,
      ]);
    });
    it('should update checkedAll to true', () => {
      const state = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) =>
          reducer(
            state,
            check(
              records[0].requestId,
              records[1].requestId,
              records[2].requestId
            )
          )
      )(initialState);
      expect(state.checkedAll).toBe(true);
    });
    it.each`
      requestType                      | daily    | fixMonthly | expected
      ${REQUEST_TYPE.ATTENDANCE_DAILY} | ${false} | ${false}   | ${false}
      ${REQUEST_TYPE.ATTENDANCE_FIX}   | ${false} | ${false}   | ${false}
      ${REQUEST_TYPE.ATTENDANCE_DAILY} | ${false} | ${true}    | ${false}
      ${REQUEST_TYPE.ATTENDANCE_FIX}   | ${false} | ${true}    | ${true}
      ${REQUEST_TYPE.ATTENDANCE_DAILY} | ${true}  | ${false}   | ${true}
      ${REQUEST_TYPE.ATTENDANCE_FIX}   | ${true}  | ${false}   | ${false}
      ${REQUEST_TYPE.ATTENDANCE_DAILY} | ${true}  | ${true}    | ${true}
      ${REQUEST_TYPE.ATTENDANCE_FIX}   | ${true}  | ${true}    | ${true}
    `(
      '$requestType should be $expected if [daily=$daily, fixMonthly=$fixMonthly].',
      ({ requestType, daily, fixMonthly, expected }) => {
        const records = [
          {
            requestId: '1',
            requestType,
          },
          {
            requestId: 'XXXX',
            requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
          },
        ] as unknown as ApprRequestList;
        const state: State = flow(
          (state) =>
            reducer(
              state,
              initialize({
                canBulkApproveAttDailyRequest: daily,
                canBulkApproveAttRequest: fixMonthly,
              })
            ),
          (state) => reducer(state, setRecords(records)),
          (state) => reducer(state, check('1'))
        )(initialState);
        if (expected) {
          expect(state.checked).toContain('1');
        } else {
          expect(state.checked).not.toContain('1');
        }
      }
    );
    it('should not change if ID is not found.', () => {
      const prev = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records))
      )(initialState);
      const next = reducer(prev, check('XXXX'));
      expect(next).toEqual(prev);
    });
    it('should not change if ID is checked already', () => {
      const state = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) => reducer(state, check(records[0].requestId)),
        (state) => reducer(state, check(records[0].requestId))
      )(initialState);
      expect(state.checked).toEqual([records[0].requestId]);
    });
    it('should not change if ID is checked already with multiple', () => {
      const state = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) =>
          reducer(state, check(records[0].requestId, records[1].requestId)),
        (state) =>
          reducer(state, check(records[0].requestId, records[1].requestId))
      )(initialState);
      expect(state.checked).toEqual([
        records[0].requestId,
        records[1].requestId,
      ]);
    });
    it.each([CHECKED_MAX - 1, CHECKED_MAX, CHECKED_MAX + 1])(
      'should do when [ids=%d].',
      (val) => {
        const records = [...Array(CHECKED_MAX + 10).keys()].map((idx) => ({
          requestId: `${idx + 1}`,
          requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
        })) as unknown as ApprRequestList;
        const ids = [...Array(val).keys()].map((idx) => `${idx + 1}`);
        const id = ids.shift();
        const state = flow(
          (state) =>
            reducer(
              state,
              initialize({
                canBulkApproveAttDailyRequest: true,
                canBulkApproveAttRequest: true,
              })
            ),
          (state) => reducer(state, setRecords(records)),
          (state) => reducer(state, check(id)),
          (state) => reducer(state, check(...ids))
        )(initialState);
        if (val < CHECKED_MAX) {
          expect(state.checked).toHaveLength(val);
          expect(state.checkedAll).toBe(false);
        } else {
          expect(state.checked).toHaveLength(CHECKED_MAX);
          expect(state.checkedAll).toBe(true);
        }
        expect(state.checked).toContain('1');
      }
    );
  });
  describe(`${ACTION_TYPES.UNCHECK}`, () => {
    it('should do.', () => {
      const prev = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) =>
          reducer(
            state,
            check(
              records[0].requestId,
              records[1].requestId,
              records[2].requestId
            )
          )
      )(initialState);
      const next = reducer(prev, uncheck(records[0].requestId));
      expect(next.checked).toEqual([
        records[1].requestId,
        records[2].requestId,
      ]);
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    it('should do twice.', () => {
      const state = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) =>
          reducer(
            state,
            check(
              records[0].requestId,
              records[1].requestId,
              records[2].requestId
            )
          ),
        (state) => reducer(state, uncheck(records[0].requestId)),
        (state) => reducer(state, uncheck(records[1].requestId))
      )(initialState);
      expect(state.checked).toEqual([records[2].requestId]);
    });
    it('should do with multiple', () => {
      const state = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) =>
          reducer(
            state,
            check(
              records[0].requestId,
              records[1].requestId,
              records[2].requestId
            )
          ),
        (state) =>
          reducer(state, uncheck(records[0].requestId, records[1].requestId))
      )(initialState);
      expect(state.checked).toEqual([records[2].requestId]);
    });
    it('should update checkedAll to false', () => {
      const state = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) => reducer(state, checkAll()),
        (state) => reducer(state, uncheck(records[0].requestId))
      )(initialState);
      expect(state.checked).toEqual([
        records[1].requestId,
        records[2].requestId,
      ]);
      expect(state.checkedAll).toBe(false);
    });
    it('should not change if ID is not found.', () => {
      const prev: State = initialState;
      const next = reducer(prev, uncheck('XXXX'));
      expect(next).toEqual(prev);
    });
    it('should not change if ID is checked already', () => {
      const state = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) =>
          reducer(
            state,
            check(
              records[0].requestId,
              records[1].requestId,
              records[2].requestId
            )
          ),
        (state) => reducer(state, uncheck(records[0].requestId)),
        (state) => reducer(state, uncheck(records[0].requestId))
      )(initialState);
      expect(state.checked).toEqual([
        records[1].requestId,
        records[2].requestId,
      ]);
    });
    it('should not change if ID is checked already with multiple', () => {
      const state = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) =>
          reducer(
            state,
            check(
              records[0].requestId,
              records[1].requestId,
              records[2].requestId
            )
          ),
        (state) =>
          reducer(state, uncheck(records[0].requestId, records[1].requestId)),
        (state) =>
          reducer(state, uncheck(records[0].requestId, records[1].requestId))
      )(initialState);
      expect(state.checked).toEqual([records[2].requestId]);
    });
    it.each`
      daily    | fixMonthly
      ${false} | ${false}
      ${false} | ${true}
      ${true}  | ${false}
      ${true}  | ${true}
    `(
      'should do if option is [daily=$daily, fixMonthly=$fixMonthly]',
      ({ daily, fixMonthly }) => {
        const state = flow(
          (state) =>
            reducer(
              state,
              initialize({
                canBulkApproveAttDailyRequest: daily,
                canBulkApproveAttRequest: fixMonthly,
              })
            ),
          (state) => reducer(state, setRecords(records)),
          (state) =>
            reducer(
              state,
              check(
                records[0].requestId,
                records[1].requestId,
                records[2].requestId
              )
            ),
          (state) => reducer(state, uncheck(records[0].requestId))
        )(initialState);
        expect(state.checked).not.toContain([records[0].requestId]);
      }
    );
  });
  it(`${ACTION_TYPES.UNCHECK_ALL}`, () => {
    const prev = flow(
      (state) =>
        reducer(
          state,
          initialize({
            canBulkApproveAttDailyRequest: true,
            canBulkApproveAttRequest: true,
          })
        ),
      (state) => reducer(state, setRecords(records)),
      (state) =>
        reducer(
          state,
          check(
            records[0].requestId,
            records[1].requestId,
            records[2].requestId
          )
        )
    )(initialState);
    const next = reducer(prev, uncheckAll());
    expect(next.checked).toEqual([]);
    expect(next.checkedAll).toBe(false);
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  describe(`${ACTION_TYPES.CHECK_ALL}`, () => {
    it('should do', () => {
      const prev = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records))
      )(initialState);
      const next = reducer(prev, checkAll());
      expect(next.checked).toEqual([
        records[0].requestId,
        records[1].requestId,
        records[2].requestId,
      ]);
      expect(next.checkedAll).toBe(true);
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    it.each`
      filterType                       | daily    | fixMonthly | expected
      ${'all'}                         | ${false} | ${false}   | ${0}
      ${REQUEST_TYPE.ATTENDANCE_DAILY} | ${false} | ${false}   | ${0}
      ${REQUEST_TYPE.ATTENDANCE_FIX}   | ${false} | ${false}   | ${0}
      ${'all'}                         | ${false} | ${true}    | ${1}
      ${REQUEST_TYPE.ATTENDANCE_DAILY} | ${false} | ${true}    | ${0}
      ${REQUEST_TYPE.ATTENDANCE_FIX}   | ${false} | ${true}    | ${1}
      ${'all'}                         | ${true}  | ${false}   | ${2}
      ${REQUEST_TYPE.ATTENDANCE_DAILY} | ${true}  | ${false}   | ${2}
      ${REQUEST_TYPE.ATTENDANCE_FIX}   | ${true}  | ${false}   | ${0}
      ${'all'}                         | ${true}  | ${true}    | ${3}
      ${REQUEST_TYPE.ATTENDANCE_DAILY} | ${true}  | ${true}    | ${2}
      ${REQUEST_TYPE.ATTENDANCE_FIX}   | ${true}  | ${true}    | ${1}
    `(
      'checked length should be $expected when [filter=$filterType, daily=$daily, fixMonthly=$fixMonthly]',
      ({ filterType, daily, fixMonthly, expected }) => {
        const records = [
          {
            requestId: '1',
            requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
          },
          {
            requestId: '2',
            requestType: REQUEST_TYPE.ATTENDANCE_FIX,
          },
          {
            requestId: '3',
            requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
          },
        ] as unknown as ApprRequestList;
        const state = flow(
          (state) =>
            reducer(
              state,
              initialize({
                canBulkApproveAttDailyRequest: daily,
                canBulkApproveAttRequest: fixMonthly,
              })
            ),
          (state) => reducer(state, setRecords(records)),
          (state) => reducer(state, setFilterType(filterType)),
          (state) => reducer(state, checkAll())
        )(initialState);
        expect(state.checked).toHaveLength(expected);
      }
    );
    it('should do if records is over max.', () => {
      const records = [...Array(CHECKED_MAX + 10).keys()].map((idx) => ({
        requestId: `${idx + 1}`,
        requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
      })) as unknown as ApprRequestList;
      const state = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) => reducer(state, checkAll())
      )(initialState);
      expect(state.checked).toHaveLength(CHECKED_MAX);
      expect(state.checked).toEqual(
        [...Array(CHECKED_MAX).keys()].map((idx) => `${idx + 1}`)
      );
      expect(state.checkedAll).toBe(true);
    });
  });
  describe(`${ACTION_TYPES.TOGGLE}`, () => {
    it.each`
      checked       | ids           | expected
      ${[]}         | ${[]}         | ${[]}
      ${['1']}      | ${[]}         | ${['1']}
      ${[]}         | ${['1']}      | ${['1']}
      ${['1']}      | ${['1']}      | ${[]}
      ${['1']}      | ${['2']}      | ${['1', '2']}
      ${['1', '2']} | ${['1']}      | ${['2']}
      ${['1']}      | ${['1', '2']} | ${['2']}
      ${['1', '3']} | ${['1', '2']} | ${['3', '2']}
    `(
      'checked should be $expected when [checked=$checked, ids=$ids]',
      ({ checked, ids, expected }) => {
        const records = [
          {
            requestId: '1',
            requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
          },
          {
            requestId: '2',
            requestType: REQUEST_TYPE.ATTENDANCE_FIX,
          },
          {
            requestId: '3',
            requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
          },
        ] as unknown as ApprRequestList;
        const state = flow(
          (state) =>
            reducer(
              state,
              initialize({
                canBulkApproveAttDailyRequest: true,
                canBulkApproveAttRequest: true,
              })
            ),
          (state) => reducer(state, setRecords(records)),
          (state) => reducer(state, check(...checked)),
          (state) => reducer(state, toggle(...ids))
        )(initialState);
        expect(state.checked).toEqual(expected);
        expect(state.checkedAll).toBe(false);
      }
    );
    it('should do if records is over max.', () => {
      const records = [...Array(CHECKED_MAX + 10).keys()].map((idx) => ({
        requestId: `${idx + 1}`,
        requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
      })) as unknown as ApprRequestList;
      const state = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) => reducer(state, checkAll()),
        (state) => reducer(state, toggle('100', '101', '102'))
      )(initialState);
      expect(state.checked).toHaveLength(CHECKED_MAX);
      expect(state.checked).toContain('1');
      expect(state.checked).not.toContain('100');
      expect(state.checked).toContain('101');
      expect(state.checked).not.toContain('102');
      expect(state.checkedAll).toBe(true);
    });
  });
  describe(`${ACTION_TYPES.TOGGLE_ALL}`, () => {
    it('should be checked all', () => {
      const records = [
        {
          requestId: '1',
          requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
        },
        {
          requestId: '2',
          requestType: REQUEST_TYPE.ATTENDANCE_FIX,
        },
        {
          requestId: '3',
          requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
        },
      ] as unknown as ApprRequestList;
      const state = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) => reducer(state, toggleAll())
      )(initialState);
      expect(state.checked).toEqual(['1', '2', '3']);
      expect(state.checkedAll).toBe(true);
    });
    it('should be unchecked all', () => {
      const records = [
        {
          requestId: '1',
          requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
        },
        {
          requestId: '2',
          requestType: REQUEST_TYPE.ATTENDANCE_FIX,
        },
        {
          requestId: '3',
          requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
        },
      ] as unknown as ApprRequestList;
      const state = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) => reducer(state, checkAll()),
        (state) => reducer(state, toggleAll())
      )(initialState);
      expect(state.checked).toEqual([]);
      expect(state.checkedAll).toBe(false);
    });
    it('should be checked all if records is over max.', () => {
      const records = [...Array(CHECKED_MAX + 10).keys()].map((idx) => ({
        requestId: `${idx + 1}`,
        requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
      })) as unknown as ApprRequestList;
      const state = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) => reducer(state, toggleAll())
      )(initialState);
      expect(state.checked).toHaveLength(CHECKED_MAX);
      expect(state.checked).toEqual(
        [...Array(CHECKED_MAX).keys()].map((idx) => `${idx + 1}`)
      );
      expect(state.checkedAll).toBe(true);
    });
    it('should be uncheck all if records is over max.', () => {
      const records = [...Array(CHECKED_MAX + 10).keys()].map((idx) => ({
        requestId: `${idx + 1}`,
        requestType: REQUEST_TYPE.ATTENDANCE_DAILY,
      })) as unknown as ApprRequestList;
      const state = flow(
        (state) =>
          reducer(
            state,
            initialize({
              canBulkApproveAttDailyRequest: true,
              canBulkApproveAttRequest: true,
            })
          ),
        (state) => reducer(state, setRecords(records)),
        (state) => reducer(state, checkAll()),
        (state) => reducer(state, toggleAll())
      )(initialState);
      expect(state.checked).toEqual([]);
      expect(state.checkedAll).toBe(false);
    });
  });
});
