import { ValidationError } from 'yup';

import snapshotDiff from 'snapshot-diff';

import createSchemas from '@attendance/timesheet-pc-importer/schemas';

import { DAY_TYPE } from '@apps/attendance/domain/models/AttDailyRecord';
import { ContractedWorkTime } from '@apps/attendance/domain/models/importer/ContractedWorkTime';

import reducer, {
  // @ts-ignore
  __get__,
  ACTION_TYPE,
  actions,
  createKeyValueUpdater,
  createUpdater,
  normalize,
  setDefault,
  setErrors,
  State,
  validate,
} from '../timesheet';
import * as DailyRecordViewModel from '@attendance/timesheet-pc-importer/viewModels/DailyRecordViewModel';

jest.mock('uuid', () => {
  let id = 0;
  return {
    __esModule: true,
    default: () => `${id++}`,
  };
});

jest.mock('@attendance/timesheet-pc-importer/schemas', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    validateSync: jest.fn(),
  })),
}));

const initialState = __get__('initialState');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(next).toEqual(initialState);
  });
  describe(ACTION_TYPE.CREATE, () => {
    it('should be create', () => {
      const result = reducer(
        undefined,
        actions.create('2023-01-01', '2023-01-03')
      );
      expect(result.startDate).toEqual('2023-01-01');
      expect(result.endDate).toEqual('2023-01-03');
      result.records.forEach((record) => {
        expect(record).toEqual(
          DailyRecordViewModel.create({ recordDate: record.recordDate })
        );
      });
      expect([...result.records.keys()]).toEqual([
        '2023-01-01',
        '2023-01-02',
        '2023-01-03',
      ]);
    });
    it.each`
      start           | end             | expectedStart   | expectedEnd
      ${'2023-01-01'} | ${'2023-02-28'} | ${'2023-01-01'} | ${'2023-01-31'}
      ${'2023-01-15'} | ${'2023-02-28'} | ${'2023-01-15'} | ${'2023-02-14'}
      ${'2023-02-15'} | ${'2023-01-14'} | ${'2023-02-15'} | ${'2023-03-14'}
    `('should be rounded', ({ start, end, expectedStart, expectedEnd }) => {
      // Arrange
      const expected = reducer(
        undefined,
        actions.create(expectedStart, expectedEnd)
      );
      // Act
      const result = reducer(undefined, actions.create(start, end));
      // Assert
      expect(result).toEqual({ ...expected, id: result.id });
    });
    it('should be created one record', () => {
      const result = reducer(
        undefined,
        actions.create('2023-01-01', '2023-01-01')
      );
      expect(result.startDate).toEqual('2023-01-01');
      expect(result.endDate).toEqual('2023-01-01');
      expect(result.records.size).toEqual(1);
    });
  });
  describe(ACTION_TYPE.SET_RECORDS, () => {
    it('should not set if state has not records', () => {
      // Arrange
      const prev = initialState;
      // Act
      const next = reducer(
        prev,
        actions.setRecords(
          new Map([
            ['2023-01-01', { recordDate: '2023-01-01', p1: 'record1' }],
            ['2023-01-02', { recordDate: '2023-01-02', p1: 'record2' }],
            ['2023-01-03', { recordDate: '2023-01-03', p1: 'record3' }],
          ]) as unknown as State['records']
        )
      );
      // Assert
      expect(next.startDate).toEqual('');
      expect(next.endDate).toEqual('');
      expect(next.records).toEqual(null);
    });
    it('should set if state has records', () => {
      // Arrange
      const prev = {
        id: 'id',
        startDate: '2023-01-01',
        endDate: '2023-01-04',
        records: new Map([
          ['2023-01-01', {}],
          ['2023-01-02', {}],
          ['2023-01-03', { p1: 'p1' }],
          ['2023-01-04', { p2: 'p2' }],
        ]),
      } as unknown as State;
      // Act
      const next = reducer(
        prev,
        actions.setRecords(
          new Map([
            ['2023-01-02', { p1: 'record2' }],
            ['2023-01-03', { p1: 'record3' }],
            ['2023-01-04', { p1: 'record4' }],
            ['2023-01-05', { p1: 'record4' }],
          ]) as unknown as State['records']
        )
      );
      // Assert
      expect(next.startDate).toEqual('2023-01-01');
      expect(next.endDate).toEqual('2023-01-04');
      // errors と validationErrors が追加されていることで
      // setErrors() と validation() が実行されていることが確認出来ているので
      // これらのテストは割愛する。
      expect([...next.records.entries()]).toEqual([
        ['2023-01-01', {}],
        ['2023-01-02', { p1: 'record2', errors: [], validationErrors: null }],
        ['2023-01-03', { p1: 'record3', errors: [], validationErrors: null }],
        [
          '2023-01-04',
          { p1: 'record4', p2: 'p2', errors: [], validationErrors: null },
        ],
      ]);
    });
    it('should use contractedWorkTime', () => {
      // Arrange
      const summary = {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        records: new Map([['2023-01-01', { startTime: 0, endTime: 0 }]]),
      };
      const prev = {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        records: new Map([
          ['2023-01-01', { recordDate: '2023-01-01' }],
          ['2023-01-02', { recordDate: '2023-01-02' }],
          ['2023-01-03', { recordDate: '2023-01-03' }],
        ]),
        contractedWorkTimes: [summary],
      } as unknown as State;

      // Act
      reducer(
        prev,
        actions.setRecords(
          new Map([
            ['2023-01-02', { p1: 'record2' }],
            ['2023-01-03', { p1: 'record3' }],
            ['2023-01-04', { p1: 'record4' }],
          ]) as unknown as State['records']
        )
      );

      // Assert
      expect(createSchemas).toHaveBeenCalledTimes(2);
      expect(createSchemas).toHaveBeenCalledWith(summary);
    });
  });
  describe(ACTION_TYPE.SET_RECORD_VALUE_BY_RANGE, () => {
    it('should not set if records is null', () => {
      // Arrange
      const prev = initialState;

      // Act
      const next = reducer(
        prev,
        actions.setRecordValueByRange('2023-01-01', 'leaveRequestLeaves', [
          'leave1',
          'leave2',
        ] as unknown as DailyRecordViewModel.DailyRecordViewModel['leaveRequestLeaves'])
      );

      // Assert
      expect(next).toEqual(prev);
    });
    it('should set if records is initialized', () => {
      // Arrange
      const prev = {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        records: new Map([
          ['2023-01-01', { recordDate: '2023-01-01' }],
          [
            '2023-01-02',
            {
              recordDate: '2023-01-02',
              key: 'value',
              leaveRequestLeaves: 'before',
            },
          ],
          ['2023-01-03', { recordDate: '2023-01-03' }],
        ]),
      } as unknown as State;

      // Act
      const next = reducer(
        prev,
        actions.setRecordValueByRange('2023-01-01', 'leaveRequestLeaves', [
          'leave1',
          'leave2',
        ] as unknown as DailyRecordViewModel.DailyRecordViewModel['leaveRequestLeaves'])
      );

      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    it('should set with contracted work time if contracted work time is initialized', () => {
      // Arrange
      const prev = {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        records: new Map([
          ['2023-01-01', { recordDate: '2023-01-01' }],
          [
            '2023-01-02',
            {
              recordDate: '2023-01-02',
              key: 'value',
              leaveRequestLeaves: 'before',
            },
          ],
          ['2023-01-03', { recordDate: '2023-01-03' }],
        ]),
        contractedWorkTimes: [
          {
            startDate: '2023-01-01',
            endDate: '2023-01-02',
            workingTypes: [
              {
                startDate: '2023-01-01',
                endDate: '2023-01-02',
              },
              {
                startDate: '2023-01-04',
                endDate: '2023-01-05',
              },
            ],
          },
          {
            startDate: '2023-01-06',
            endDate: '2023-01-07',
            workingTypes: [
              {
                startDate: '2023-01-06',
                endDate: '2023-01-07',
              },
            ],
          },
        ],
      } as unknown as State;

      // Act
      const next = reducer(
        prev,
        actions.setRecordValueByRange('2023-01-01', 'leaveRequestLeaves', [
          'leave1',
          'leave2',
        ] as unknown as DailyRecordViewModel.DailyRecordViewModel['leaveRequestLeaves'])
      );

      // Assert
      expect(next.records.size).toEqual(3);
      expect(next.records.get('2023-01-01').leaveRequestLeaves).toEqual([
        'leave1',
        'leave2',
      ]);
      expect(next.records.get('2023-01-02').leaveRequestLeaves).toEqual([
        'leave1',
        'leave2',
      ]);
      expect(next.records.get('2023-01-03').leaveRequestLeaves).toEqual(
        undefined
      );
    });
    it('should not set when out of range', () => {
      // Arrange
      const prev = {
        startDate: '2023-01-01',
        endDate: '2023-01-04',
        records: new Map([
          ['2023-01-01', { recordDate: '2023-01-01' }],
          [
            '2023-01-02',
            {
              recordDate: '2023-01-02',
              key: 'value',
              leaveRequestLeaves: 'before',
            },
          ],
          ['2023-01-03', { recordDate: '2023-01-03' }],
        ]),
        contractedWorkTimes: [
          {
            startDate: '2023-01-01',
            endDate: '2023-01-02',
            workingTypes: [
              {
                startDate: '2023-01-01',
                endDate: '2023-01-02',
              },
            ],
          },
        ],
      } as unknown as State;

      // Act
      const next = reducer(
        prev,
        actions.setRecordValueByRange('2023-01-04', 'leaveRequestLeaves', [
          'leave1',
          'leave2',
        ] as unknown as DailyRecordViewModel.DailyRecordViewModel['leaveRequestLeaves'])
      );

      // Assert
      expect(next).toEqual(prev);
    });
    it('should normalized.', () => {
      // Arrange
      const prev = {
        startDate: '2023-01-01',
        endDate: '2023-01-01',
        records: new Map([
          [
            '2023-01-01',
            {
              recordDate: '2023-01-01',
              appliedLeaveRequest1: false,
              leaveRequestLeaves: [
                {
                  code: 'LEAVE_CODE_1',
                  ranges: ['Day'],
                },
              ],
              leaveRequest1Code: 'LEAVE_CODE_1',
              leaveRequest1Range: 'Day',
            },
          ],
        ]),
      } as unknown as State;

      // Act
      const next = reducer(
        prev,
        actions.setRecordValueByRange('2023-01-01', 'comment', 'test')
      );

      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    it('should use contractedWorkTime', () => {
      // Arrange
      const summary = {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        workingTypes: [
          {
            startDate: '2023-01-01',
            endDate: '2023-01-02',
          },
        ],
        records: new Map([
          [
            '2023-01-01',
            { startTime: 0, endTime: 0, dayType: DAY_TYPE.Workday },
          ],
        ]),
      };
      const prev = {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        records: new Map([
          ['2023-01-01', { recordDate: '2023-01-01' }],
          ['2023-01-02', { recordDate: '2023-01-02' }],
        ]),
        contractedWorkTimes: [summary],
      } as unknown as State;

      // Act
      reducer(
        prev,
        actions.setRecordValueByRange('2023-01-01', 'checked', true)
      );

      // Assert
      expect(createSchemas).toHaveBeenCalledTimes(1);
      expect(createSchemas).toHaveBeenCalledWith(summary);
    });
  });
  describe(ACTION_TYPE.SET_RECORD_VALUE_BY_RECORD_DATE, () => {
    it('should not set if records is null', () => {
      // Arrange
      const prev = initialState;

      // Act
      const next = reducer(
        prev,
        actions.setRecordValueByRecordDate('2023-01-01', 'leaveRequestLeaves', [
          'leave1',
          'leave2',
        ] as unknown as DailyRecordViewModel.DailyRecordViewModel['leaveRequestLeaves'])
      );

      // Assert
      expect(next).toEqual(prev);
    });
    it('should set if records is initialized', () => {
      // Arrange
      const prev = {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        records: new Map([
          ['2023-01-01', { recordDate: '2023-01-01' }],
          [
            '2023-01-02',
            {
              recordDate: '2023-01-02',
              key: 'value',
              leaveRequestLeaves: 'before',
            },
          ],
          ['2023-01-03', { recordDate: '2023-01-03' }],
        ]),
      } as unknown as State;

      [...prev.records.keys()].concat(['2023-01-04']).forEach((targetDate) => {
        // Act
        const next = reducer(
          prev,
          actions.setRecordValueByRecordDate(targetDate, 'leaveRequestLeaves', [
            'leave1',
            'leave2',
          ] as unknown as DailyRecordViewModel.DailyRecordViewModel['leaveRequestLeaves'])
        );

        // Assert
        expect(snapshotDiff(prev, next)).toMatchSnapshot();
      });
    });
    it('should normalized.', () => {
      // Arrange
      const prev = {
        startDate: '2023-01-01',
        endDate: '2023-01-01',
        records: new Map([
          [
            '2023-01-01',
            {
              recordDate: '2023-01-01',
              appliedLeaveRequest1: false,
              leaveRequestLeaves: [
                {
                  code: 'LEAVE_CODE_1',
                  ranges: ['Day'],
                },
              ],
              leaveRequest1Code: 'LEAVE_CODE_1',
              leaveRequest1Range: 'Day',
            },
          ],
        ]),
      } as unknown as State;

      // Act
      const next = reducer(
        prev,
        actions.setRecordValueByRecordDate('2023-01-01', 'comment', 'test')
      );

      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    it('should use contractedWorkTime', () => {
      // Arrange
      const summary = {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        records: new Map([['2023-01-01', { startTime: 0, endTime: 0 }]]),
      };
      const prev = {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        records: new Map([['2023-01-01', { recordDate: '2023-01-01' }]]),
        contractedWorkTimes: [summary],
      } as unknown as State;

      // Act
      reducer(
        prev,
        actions.setRecordValueByRecordDate('2023-01-01', 'checked', true)
      );

      // Assert
      expect(createSchemas).toHaveBeenCalledTimes(1);
      expect(createSchemas).toHaveBeenCalledWith(summary);
    });
  });
  describe(ACTION_TYPE.SET_SERVER_ERRORS, () => {
    it.each`
      records                                                                                      | errors                                                                                                     | expected
      ${new Map()}                                                                                 | ${{ startDate: '2023-01-01', endDate: '2023-01-01', errors: null }}                                        | ${new Map()}
      ${new Map()}                                                                                 | ${{ startDate: '2023-01-01', endDate: '2023-01-01', errors: new Map() }}                                   | ${new Map()}
      ${new Map()}                                                                                 | ${{ startDate: '2023-01-01', endDate: '2023-01-01', errors: new Map([['2023-01-01', ['serverError1']]]) }} | ${new Map()}
      ${new Map([['2023-01-01', {}]])}                                                             | ${{ startDate: '2023-01-01', endDate: '2023-01-01', errors: new Map() }}                                   | ${new Map([['2023-01-01', { serverErrors: null, errors: [] }]])}
      ${new Map([['2023-01-01', { serverErrors: ['oldError1'] }]])}                                | ${{ startDate: '2023-01-01', endDate: '2023-01-01', errors: new Map() }}                                   | ${new Map([['2023-01-01', { serverErrors: null, errors: [] }]])}
      ${new Map([['2023-01-01', {}]])}                                                             | ${{ startDate: '2023-01-01', endDate: '2023-01-01', errors: new Map([['2023-01-01', ['serverError1']]]) }} | ${new Map([['2023-01-01', { serverErrors: ['serverError1'], errors: ['serverError1'] }]])}
      ${new Map([['2023-01-01', { serverErrors: ['oldError1'] }]])}                                | ${{ startDate: '2023-01-01', endDate: '2023-01-01', errors: new Map([['2023-01-01', ['serverError1']]]) }} | ${new Map([['2023-01-01', { serverErrors: ['serverError1'], errors: ['serverError1'] }]])}
      ${new Map([['2023-01-01', { validationErrors: new Map([['key', ['validationError1']]]) }]])} | ${{ startDate: '2023-01-01', endDate: '2023-01-01', errors: new Map([['2023-01-01', ['serverError1']]]) }} | ${new Map([['2023-01-01', { serverErrors: ['serverError1'], validationErrors: new Map([['key', ['validationError1']]]), errors: ['serverError1', 'validationError1'] }]])}
      ${new Map([['2023-01-02', { validationErrors: new Map([['key', ['validationError1']]]) }]])} | ${{ startDate: '2023-01-01', endDate: '2023-01-01', errors: new Map([['2023-01-01', ['serverError1']]]) }} | ${new Map([['2023-01-02', { validationErrors: new Map([['key', ['validationError1']]]) }]])}
      ${new Map([['2023-01-02', { validationErrors: new Map([['key', ['validationError1']]]) }]])} | ${{ startDate: '2023-01-01', endDate: '2023-01-02', errors: new Map([['2023-01-01', ['serverError1']]]) }} | ${new Map([['2023-01-02', { serverErrors: null, validationErrors: new Map([['key', ['validationError1']]]), errors: ['validationError1'] }]])}
    `('should be $expected', ({ records, errors, expected }) => {
      // Arrange
      const prev = {
        records,
      } as unknown as State;

      // Act
      const result = reducer(prev, actions.setServerErrors(errors));

      // Assert
      expect(result).toEqual({ records: expected });
    });
  });
  test(ACTION_TYPE.SET_CONTRACTED_WORK_TIMES, () => {
    // Arrange
    const prev = {
      id: 'id',
      startDate: '2023-01-01',
      endDate: '2023-01-05',
      records: new Map([
        ['2023-01-01', { p: 'p' }],
        ['2023-01-02', { p: 'p' }],
        ['2023-01-03', { p: 'p' }],
        ['2023-01-04', { p: 'p' }],
        ['2023-01-05', { p: 'p' }],
      ]),
    } as unknown as State;
    // Act
    const next = reducer(
      prev,
      actions.setContractedWorkTimes([
        {
          startDate: '2023-01-01',
          endDate: '2023-01-04',
          records: new Map([
            [
              '2023-01-01',
              {
                startTime: 0,
                endTime: 1,
                restTimes: [
                  { startTime: 2, endTime: 3 },
                  { startTime: 4, endTime: 5 },
                ],
                dayType: DAY_TYPE.Workday,
              },
            ],
            [
              '2023-01-02',
              {
                startTime: null,
                endTime: null,
                restTimes: null,
                dayType: DAY_TYPE.Holiday,
              },
            ],
            [
              '2023-01-03',
              {
                startTime: 0,
                endTime: 0,
                restTimes: [{ startTime: 0, endTime: 0 }],
                dayType: DAY_TYPE.Workday,
              },
            ],
          ]),
        },
        {
          startDate: '2023-01-05',
          endDate: '2023-01-05',
          records: new Map([
            [
              '2023-01-05',
              {
                startTime: 0,
                endTime: 0,
                restTimes: [
                  { startTime: 0, endTime: 0 },
                  { startTime: 0, endTime: 0 },
                ],
                dayType: DAY_TYPE.Workday,
              },
            ],
          ]),
        },
      ] as unknown as State['contractedWorkTimes'])
    );
    // Assert
    expect(next.startDate).toEqual('2023-01-01');
    expect(next.endDate).toEqual('2023-01-05');
    expect([...next.records.entries()]).toEqual([
      [
        '2023-01-01',
        DailyRecordViewModel.create({
          recordDate: '2023-01-01',
          startTime: 0,
          endTime: 1,
          rest1StartTime: 2,
          rest1EndTime: 3,
          rest2StartTime: 4,
          rest2EndTime: 5,
          checked: true,
          dayType: DAY_TYPE.Workday,
        }),
      ],
      [
        '2023-01-02',
        DailyRecordViewModel.create({
          recordDate: '2023-01-02',
          dayType: DAY_TYPE.Holiday,
        }),
      ],
      [
        '2023-01-03',
        DailyRecordViewModel.create({
          recordDate: '2023-01-03',
          startTime: 0,
          endTime: 0,
          rest1StartTime: 0,
          rest1EndTime: 0,
          checked: true,
          dayType: DAY_TYPE.Workday,
        }),
      ],
      [
        '2023-01-04',
        DailyRecordViewModel.create({
          recordDate: '2023-01-04',
        }),
      ],
      [
        '2023-01-05',
        DailyRecordViewModel.create({
          recordDate: '2023-01-05',
          startTime: 0,
          endTime: 0,
          rest1StartTime: 0,
          rest1EndTime: 0,
          rest2StartTime: 0,
          rest2EndTime: 0,
          checked: true,
          dayType: DAY_TYPE.Workday,
        }),
      ],
    ]);
  });
  describe(ACTION_TYPE.TOGGLE_CHECKED_ALL, () => {
    it.each`
      record1  | record2  | expected
      ${false} | ${false} | ${true}
      ${false} | ${true}  | ${true}
      ${true}  | ${false} | ${true}
      ${true}  | ${true}  | ${false}
    `(
      'should be every $checkedAll when [record1=$record1, record2=$record2]',
      ({ record1, record2, expected }) => {
        // Arrange
        const prev = {
          records: new Map([
            ['2023-01-01', { checked: record1 }],
            ['2023-01-02', { checked: record2 }],
          ]),
        } as unknown as State;

        // Act
        const result = reducer(prev, actions.toggleCheckedAll());
        const checks = [...result.records.values()].map(
          ({ checked }) => checked
        );

        // Assert
        expect(checks).toEqual([expected, expected]);
      }
    );
  });
  test(ACTION_TYPE.CLEAR, () => {
    // Arrange
    const prev = {
      startDate: 'startDate',
      endDate: 'endDate',
      records: ['record1', 'record2'],
    } as unknown as State;
    // Act
    const next = reducer(prev, actions.clear());
    // Assert
    expect(next).toEqual(initialState);
  });
});

describe('setDefault', () => {
  describe('rest time reasons', () => {
    it('should set default without contracted work time', () => {
      // Arrange
      const restTimeReasons = [
        {
          code: 'CODE_1',
        },
        { code: 'CODE_2' },
      ] as unknown as DailyRecordViewModel.DailyRecordViewModel['restTimeReasons'];

      // Act
      const result = setDefault(null)('restTimeReasons', restTimeReasons)(
        {} as unknown as DailyRecordViewModel.DailyRecordViewModel
      );

      // Assert
      expect(result.restTimeReasons).toEqual(restTimeReasons);
      expect(result.rest1Reason).toEqual(restTimeReasons[0]);
      expect(result.rest2Reason).toEqual(restTimeReasons[0]);
      expect(result.rest1ReasonCode).toEqual(restTimeReasons[0].code);
      expect(result.rest2ReasonCode).toEqual(restTimeReasons[0].code);
    });
  });
  describe('With contracted work time', () => {
    it('should set default when workday', () => {
      // Arrange
      const restTimeReasons = [
        {
          code: 'CODE_1',
        },
        { code: 'CODE_2' },
      ] as unknown as DailyRecordViewModel.DailyRecordViewModel['restTimeReasons'];

      // Act
      const result = setDefault({
        records: new Map([
          [
            'recordDate',
            {
              dayType: DAY_TYPE.Workday,
            },
          ],
        ]),
      } as unknown as ContractedWorkTime)(
        'restTimeReasons',
        restTimeReasons
      )({
        recordDate: 'recordDate',
      } as unknown as DailyRecordViewModel.DailyRecordViewModel);

      // Assert
      expect(result.restTimeReasons).toEqual(restTimeReasons);
      expect(result.rest1Reason).toEqual(restTimeReasons[0]);
      expect(result.rest2Reason).toEqual(restTimeReasons[0]);
      expect(result.rest1ReasonCode).toEqual('CODE_1');
      expect(result.rest2ReasonCode).toEqual('CODE_1');
    });
    it('should not set default when holiday', () => {
      // Arrange
      const restTimeReasons = [
        {
          code: 'CODE_1',
        },
        { code: 'CODE_2' },
      ] as unknown as DailyRecordViewModel.DailyRecordViewModel['restTimeReasons'];

      // Act
      const result = setDefault({
        records: new Map(),
      } as unknown as ContractedWorkTime)(
        'restTimeReasons',
        restTimeReasons
      )({
        recordDate: 'recordDate',
      } as unknown as DailyRecordViewModel.DailyRecordViewModel);

      // Assert
      expect(result.restTimeReasons).toEqual(restTimeReasons);
      expect(result.rest1Reason).toEqual(undefined);
      expect(result.rest2Reason).toEqual(undefined);
      expect(result.rest1ReasonCode).toEqual(undefined);
      expect(result.rest2ReasonCode).toEqual(undefined);
    });
  });
});

describe('normalized', () => {
  describe('leave request', () => {
    it('should normalized with correct data.', () => {
      // Arrange
      const prev = {
        recordDate: '2023-01-01',
        appliedLeaveRequest1: true,
        leaveRequestLeaves: [
          {
            code: 'LEAVE_CODE_1',
            ranges: ['Day'],
          },
        ],
        leaveRequest1Leave: {
          code: 'LEAVE_CODE_1',
          ranges: ['Day'],
        },
        leaveRequest1Code: 'LEAVE_CODE_1',
        leaveRequest1Range: 'Day',
      } as unknown as DailyRecordViewModel.DailyRecordViewModel;

      // Act
      const next = normalize(prev);

      // Assert
      // 正しいデータなので差分は出ないはず
      expect(next).toEqual(prev);
    });
    it('should normalized with incorrect code.', () => {
      // Arrange
      const prev = {
        recordDate: '2023-01-01',
        appliedLeaveRequest1: true,
        leaveRequestLeaves: [
          {
            code: 'LEAVE_CODE_1',
            ranges: ['Day'],
          },
        ],
        leaveRequest1Code: 'LEAVE_CODE_2',
        leaveRequest1Range: 'Day',
      } as unknown as DailyRecordViewModel.DailyRecordViewModel;

      // Act
      const next = normalize(prev);

      // Assert
      // 間違ったデータなので差分が出る
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    it('should normalized with incorrect range.', () => {
      // Arrange
      const prev = {
        recordDate: '2023-01-01',
        appliedLeaveRequest1: true,
        leaveRequestLeaves: [
          {
            code: 'LEAVE_CODE_1',
            ranges: ['Day'],
          },
        ],
        leaveRequest1Code: 'LEAVE_CODE_1',
        leaveRequest1Range: 'AM',
      } as unknown as DailyRecordViewModel.DailyRecordViewModel;

      // Act
      const next = normalize(prev);

      // Assert
      // 間違ったデータなので差分が出る
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    it('should not normalized if list is null.', () => {
      // Arrange
      const prev = {
        recordDate: '2023-01-01',
        appliedLeaveRequest1: false,
        leaveRequestLeaves: null,
        leaveRequest1Code: 'LEAVE_CODE_1',
        leaveRequest1Range: 'Day',
      } as unknown as DailyRecordViewModel.DailyRecordViewModel;

      // Act
      const next = normalize(prev);

      // Assert
      expect(next).toEqual(prev);
    });
  });

  describe('early leave request', () => {
    it('should normalized with correct data.', () => {
      // Arrange
      const prev = {
        recordDate: '2023-01-01',
        appliedEarlyLeaveRequest: true,
        earlyLeaveReasons: [
          {
            code: 'REASON_CODE_1',
          },
        ],
        earlyLeaveRequestReason: {
          code: 'REASON_CODE_1',
        },
        earlyLeaveRequestReasonCode: 'REASON_CODE_1',
      } as unknown as DailyRecordViewModel.DailyRecordViewModel;

      // Act
      const next = normalize(prev);

      // Assert
      // 正しいデータなので差分は出ないはず
      expect(next).toEqual(prev);
    });
    it('should normalized with incorrect code.', () => {
      // Arrange
      const prev = {
        recordDate: '2023-01-01',
        appliedEarlyLeaveRequest: true,
        earlyLeaveReasons: [
          {
            code: 'REASON_CODE_1',
          },
        ],
        earlyLeaveRequestReasonCode: 'REASON_CODE_2',
      } as unknown as DailyRecordViewModel.DailyRecordViewModel;

      // Act
      const next = normalize(prev);

      // Assert
      // 間違ったデータなので差分が出る
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    it('should not normalized if list is null.', () => {
      // Arrange
      const prev = {
        recordDate: '2023-01-01',
        appliedEarlyLeaveRequest: false,
        earlyLeaveReasons: null,
        earlyLeaveRequestReasonCode: 'REASON_CODE_1',
      } as unknown as DailyRecordViewModel.DailyRecordViewModel;

      // Act
      const next = normalize(prev);

      // Assert
      expect(next).toEqual(prev);
    });
  });

  describe('late arrival request', () => {
    it('should normalized with correct data.', () => {
      // Arrange
      const prev = {
        recordDate: '2023-01-01',
        appliedLateArrivalRequest: true,
        lateArrivalReasons: [
          {
            code: 'REASON_CODE_1',
          },
        ],
        lateArrivalRequestReason: {
          code: 'REASON_CODE_1',
        },
        lateArrivalRequestReasonCode: 'REASON_CODE_1',
      } as unknown as DailyRecordViewModel.DailyRecordViewModel;

      // Act
      const next = normalize(prev);

      // Assert
      // 正しいデータなので差分は出ないはず
      expect(next).toEqual(prev);
    });
    it('should normalized with incorrect code.', () => {
      // Arrange
      const prev = {
        recordDate: '2023-01-01',
        appliedLateArrivalRequest: true,
        lateArrivalReasons: [
          {
            code: 'REASON_CODE_1',
          },
        ],
        lateArrivalRequestReasonCode: 'REASON_CODE_2',
      } as unknown as DailyRecordViewModel.DailyRecordViewModel;

      // Act
      const next = normalize(prev);

      // Assert
      // 間違ったデータなので差分が出る
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    it('should not normalized if list is null.', () => {
      // Arrange
      const prev = {
        recordDate: '2023-01-01',
        appliedLateArrivalRequest: false,
        lateArrivalReasons: null,
        lateArrivalRequestReasonCode: 'REASON_CODE_1',
      } as unknown as DailyRecordViewModel.DailyRecordViewModel;

      // Act
      const next = normalize(prev);

      // Assert
      expect(next).toEqual(prev);
    });
  });

  describe('rest time', () => {
    it('should normalized with correct data.', () => {
      // Arrange
      const prev = {
        recordDate: '2023-01-01',
        restTimeReasons: [
          {
            code: 'REST_TIME_REASON_1',
          },
          {
            code: 'REST_TIME_REASON_2',
          },
        ],
        rest1Reason: {
          code: 'REST_TIME_REASON_1',
        },
        rest2Reason: {
          code: 'REST_TIME_REASON_2',
        },
        rest1ReasonCode: 'REST_TIME_REASON_1',
        rest2ReasonCode: 'REST_TIME_REASON_2',
      } as unknown as DailyRecordViewModel.DailyRecordViewModel;

      // Act
      const next = normalize(prev);

      // Assert
      // 正しいデータなので差分は出ないはず
      expect(next).toEqual(prev);
    });
    it('should normalized with incorrect data.', () => {
      // Arrange
      const prev = {
        recordDate: '2023-01-01',
        restTimeReasons: [
          {
            code: 'REST_TIME_REASON_1',
          },
          {
            code: 'REST_TIME_REASON_2',
          },
        ],
        rest1Reason: 'REST_TIME_REASON_3',
        rest2Reason: 'REST_TIME_REASON_4',
      } as unknown as DailyRecordViewModel.DailyRecordViewModel;

      // Act
      const next = normalize(prev);

      // Assert
      expect(next.restTimeReasons).toEqual([
        {
          code: 'REST_TIME_REASON_1',
        },
        {
          code: 'REST_TIME_REASON_2',
        },
      ]);
      expect(next.rest1Reason).toEqual(null);
      expect(next.rest2Reason).toEqual(null);
      expect(next.rest1ReasonCode).toEqual(null);
      expect(next.rest2ReasonCode).toEqual(null);
    });
    it('should normalized to null.', () => {
      // Arrange
      const prev = {
        recordDate: '2023-01-01',
        restTimeReasons: [
          {
            code: 'REST_TIME_REASON_1',
          },
          {
            code: 'REST_TIME_REASON_2',
          },
        ],
        rest1Reason: null,
        rest2Reason: null,
        rest1ReasonCode: null,
        rest2ReasonCode: null,
      } as unknown as DailyRecordViewModel.DailyRecordViewModel;

      // Act
      const next = normalize(prev);

      // Assert
      expect(next).toEqual({
        recordDate: '2023-01-01',
        restTimeReasons: [
          {
            code: 'REST_TIME_REASON_1',
          },
          {
            code: 'REST_TIME_REASON_2',
          },
        ],
        rest1Reason: null,
        rest2Reason: null,
        rest1ReasonCode: null,
        rest2ReasonCode: null,
      });
    });
    it('should not normalized if list is null.', () => {
      // Arrange
      const prev = {
        recordDate: '2023-01-01',
        restTimeReasons: null,
        rest1Reason: 'REST_TIME_REASON_1',
        rest2Reason: 'REST_TIME_REASON_2',
      } as unknown as DailyRecordViewModel.DailyRecordViewModel;

      // Act
      const next = normalize(prev);

      // Assert
      expect(next).toEqual(prev);
    });
  });
});

describe('setErrors', () => {
  it.each`
    validationErrors                                       | serverErrors              | expected
    ${null}                                                | ${null}                   | ${[]}
    ${null}                                                | ${['server1', 'server2']} | ${['server1', 'server2']}
    ${new Map([['path', ['validation1', 'validation2']]])} | ${null}                   | ${['validation1', 'validation2']}
    ${new Map([['path', ['validation1', 'validation2']]])} | ${['server1', 'server2']} | ${['server1', 'server2', 'validation1', 'validation2']}
  `('should be $expected', ({ expected, ...model }) => {
    expect(setErrors(model).errors).toEqual(expected);
  });
});

describe('validate', () => {
  it('should set validationErrors if schemas.validationSync throw errors', () => {
    // Arrange
    const schemas = createSchemas(null);
    (schemas.validateSync as jest.Mock).mockImplementation(() => {
      throw new ValidationError([
        new ValidationError('validationError1', 'value', 'field'),
      ]);
    });

    // Act
    const result = validate(schemas)(
      {} as unknown as DailyRecordViewModel.DailyRecordViewModel
    );

    // Assert
    expect(result).toEqual({
      validationErrors: new Map([['field', ['validationError1']]]),
    });
  });
  it('should clear if schemas.validationSync is success', () => {
    // Arrange
    const schemas = createSchemas(null);
    (schemas.validateSync as jest.Mock).mockReturnValue(undefined);

    // Act
    const result = validate(schemas)({
      validationErrors: 'validationErrors',
    } as unknown as DailyRecordViewModel.DailyRecordViewModel);

    // Assert
    expect(result).toEqual({
      validationErrors: null,
    });
  });
});

describe('createUpdater', () => {
  it('should execute', () => {
    // Arrange
    (createSchemas as jest.Mock).mockReturnValue({
      validateSync: jest.fn(() => {
        throw new ValidationError([
          new ValidationError('validationError1', 'value', 'field'),
        ]);
      }),
    });

    expect(
      createUpdater(null)({
        restTimeReasons: [
          {
            code: 'REST_TIME_REASON_1',
          },
        ],
        rest1ReasonCode: 'REST_TIME_REASON_2',
        serverErrors: ['serverError1'],
      } as unknown as DailyRecordViewModel.DailyRecordViewModel)
    ).toEqual({
      restTimeReasons: [
        {
          code: 'REST_TIME_REASON_1',
        },
      ],
      rest1Reason: null,
      rest2Reason: null,
      rest1ReasonCode: null,
      rest2ReasonCode: null,
      validationErrors: new Map([['field', ['validationError1']]]),
      serverErrors: ['serverError1'],
      errors: ['serverError1', 'validationError1'],
    });
  });
});

describe('createKeyValueUpdater', () => {
  it('should execute', () => {
    // Arrange
    (createSchemas as jest.Mock).mockReturnValue({
      validateSync: jest.fn(() => {
        throw new ValidationError([
          new ValidationError('validationError1', 'value', 'field'),
        ]);
      }),
    });

    expect(
      createKeyValueUpdater(null)('restTimeReasons', [
        {
          code: 'REST_TIME_REASON_1',
        },
      ] as unknown as DailyRecordViewModel.DailyRecordViewModel['restTimeReasons'])(
        {
          rest1ReasonCode: 'REST_TIME_REASON_2',
          serverErrors: ['serverError1'],
        } as unknown as DailyRecordViewModel.DailyRecordViewModel
      )
    ).toEqual({
      restTimeReasons: [
        {
          code: 'REST_TIME_REASON_1',
        },
      ],
      rest1Reason: null,
      rest2Reason: {
        code: 'REST_TIME_REASON_1',
      },
      rest1ReasonCode: null,
      rest2ReasonCode: 'REST_TIME_REASON_1',
      validationErrors: new Map([['field', ['validationError1']]]),
      serverErrors: ['serverError1'],
      errors: ['serverError1', 'validationError1'],
    });
  });
});
