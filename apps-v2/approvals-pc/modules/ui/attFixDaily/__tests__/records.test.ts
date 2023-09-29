import flow from 'lodash/fp/flow';

import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  // @ts-ignore
  __set__,
  ACTION_TYPE,
  actions,
  initialState,
  State,
} from '../records';

type Records = State['originalRecords'];

const createDummyRecord = ({
  employeeCode,
  employeeName,
  departmentName,
  targetDate,
  event,
}: {
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  targetDate: string;
  event: string;
}) => ({
  submitter: {
    employee: {
      code: employeeCode,
      name: employeeName,
      department: {
        name: departmentName,
      },
    },
  },
  targetDate,
  targetRecord: {
    recordDate: targetDate,
    event,
  },
});

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff(undefined, next)).toMatchSnapshot();
  });
  describe(ACTION_TYPE.INITIALIZE, () => {
    test('with 1 record.', () => {
      // Arrange
      const prev = initialState;
      // Act
      const next = reducer(
        prev,
        actions.initialize([
          createDummyRecord({
            employeeCode: 'E-0001',
            employeeName: 'EmployeeA',
            departmentName: 'D-0001',
            targetDate: '2022-02-01',
            event: 'eventName1',
          }),
        ] as unknown as Records)
      );
      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
      expect(next.originalRecords.length).toBe(1);
      expect(next.overLimit).toBe(false);
    });
    test('with 1001 records', () => {
      // Arrange
      const prev = initialState;
      // Act
      const next = reducer(
        prev,
        actions.initialize(
          new Array(1001).fill(null).map(
            () =>
              createDummyRecord({
                employeeCode: 'E-0001',
                employeeName: 'EmployeeA',
                departmentName: 'D-0001',
                targetDate: '2022-02-01',
                event: 'eventName1',
              }) as unknown as Records[number]
          )
        )
      );
      // Assert
      expect(next.originalRecords.length).toBe(1000);
      expect(next.overLimit).toBe(true);
    });
  });
  describe(ACTION_TYPE.FILTER, () => {
    const records = [
      // Base
      createDummyRecord({
        employeeCode: 'E-0001',
        employeeName: 'EmployeeA',
        departmentName: 'D-0001',
        targetDate: '2022-02-01',
        event: 'eventName1',
      }),
      // Same employeeCode
      createDummyRecord({
        employeeCode: 'E-0011',
        employeeName: 'EmployeeAA',
        departmentName: 'D-9999',
        targetDate: '2022-02-28',
        event: 'eventName9',
      }),
      // Same Department
      createDummyRecord({
        employeeCode: 'E-9999',
        employeeName: 'EmployeeX',
        departmentName: 'D-0001',
        targetDate: '2022-02-28',
        event: 'eventName9',
      }),
      // Same targetDate
      createDummyRecord({
        employeeCode: 'E-9999',
        employeeName: 'EmployeeX',
        departmentName: 'D-9999',
        targetDate: '2022-02-01',
        event: 'eventName9',
      }),
      // Same event
      createDummyRecord({
        employeeCode: 'E-9999',
        employeeName: 'EmployeeX',
        departmentName: 'D-9999',
        targetDate: '2022-02-28',
        event: 'eventName1',
      }),
      // Not match
      createDummyRecord({
        employeeCode: 'E-9999',
        employeeName: 'EmployeeX',
        departmentName: 'D-9999',
        targetDate: '2022-02-28',
        event: 'eventName9',
      }),
    ] as unknown as Records;
    it.each`
      name                                      | employee  | department | targetDate      | requestAndEvent   | expected
      ${'match employeeCode'}                   | ${['1']}  | ${[]}      | ${''}           | ${[]}             | ${[records[0], records[1]]}
      ${'match employeeName'}                   | ${['A']}  | ${[]}      | ${''}           | ${[]}             | ${[records[0], records[1]]}
      ${'match employeeName when lowerCase'}    | ${['a']}  | ${[]}      | ${''}           | ${[]}             | ${[records[0], records[1]]}
      ${'match departmentName'}                 | ${[]}     | ${['1']}   | ${''}           | ${[]}             | ${[records[0], records[2]]}
      ${'match departmentName when lowerCase'}  | ${[]}     | ${['d']}   | ${''}           | ${[]}             | ${records}
      ${'match targetDate'}                     | ${[]}     | ${[]}      | ${'2022-02-01'} | ${[]}             | ${[records[0], records[3]]}
      ${'match requestAndEvent'}                | ${[]}     | ${[]}      | ${''}           | ${['eventName1']} | ${[records[0], records[4]]}
      ${'match requestAndEvent when lowerCase'} | ${[]}     | ${[]}      | ${''}           | ${['name1']}      | ${[records[0], records[4]]}
      ${'match all'}                            | ${['A']}  | ${['1']}   | ${'2022-02-01'} | ${['eventName1']} | ${[records[0]]}
      ${'match all if string is empty'}         | ${['']}   | ${['']}    | ${''}           | ${['']}           | ${records}
      ${'match all if string is null'}          | ${[null]} | ${[null]}  | ${null}         | ${[null]}         | ${records}
    `(
      '$name [employee=$employee, department=$department, targetDate=$targetDate, requestAndEvent=$requestAndEvent]',
      ({ expected, ...searchQuery }) => {
        // Act
        const result = flow(
          (state) => reducer(state, actions.initialize(records)),
          (state) => reducer(state, actions.filter(searchQuery))
        )(initialState);
        // Assert
        expect(result.searchQuery).toEqual(searchQuery);
        expect(result.records).toEqual(expected);
      }
    );
  });
  describe(ACTION_TYPE.SORT, () => {
    const records = [
      createDummyRecord({
        employeeCode: '0001',
        employeeName: 'A',
        departmentName: '0002',
        targetDate: '2022-01-01',
        event: '',
      }),
      createDummyRecord({
        employeeCode: '0002',
        employeeName: 'B',
        departmentName: '0001',
        targetDate: '2022-01-01',
        event: '',
      }),
      createDummyRecord({
        employeeCode: '0003',
        employeeName: 'C',
        departmentName: '0003',
        targetDate: '2022-01-01',
        event: '',
      }),
    ] as unknown as Records;
    it.each`
      key                                     | direction | expected
      ${'submitter.employee.department.name'} | ${'asc'}  | ${[records[1], records[0], records[2]]}
      ${'submitter.employee.department.name'} | ${'desc'} | ${[records[2], records[0], records[1]]}
    `(
      'should sort [key=$key, direction=$direction]',
      ({ expected, key, direction }) => {
        // Act
        const result = flow(
          (state) => reducer(state, actions.initialize(records)),
          (state) => reducer(state, actions.sort(key, direction))
        )(initialState);
        // Assert
        expect(result.order).toEqual({
          key,
          direction,
        });
        expect(result.records).toEqual(expected);
      }
    );
  });
  describe(ACTION_TYPE.SET_RECORDS, () => {
    test('1 record', () => {
      // Arrange
      const prev = reducer(
        initialState,
        actions.initialize([
          createDummyRecord({
            employeeCode: 'E-0001',
            employeeName: 'EmployeeA',
            departmentName: 'D-0001',
            targetDate: '2022-02-01',
            event: 'eventName1',
          }),
        ] as unknown as Records)
      );
      // Act
      const next = reducer(
        prev,
        actions.setRecords([
          createDummyRecord({
            employeeCode: 'E-0002',
            employeeName: 'EmployeeB',
            departmentName: 'D-0002',
            targetDate: '2022-02-02',
            event: 'eventName2',
          }),
        ] as unknown as Records)
      );
      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
      expect(next.originalRecords.length).toBe(1);
      expect(next.overLimit).toBe(false);
    });
    test('1001 record', () => {
      // Arrange
      const prev = reducer(
        initialState,
        actions.initialize([
          createDummyRecord({
            employeeCode: 'E-0001',
            employeeName: 'EmployeeA',
            departmentName: 'D-0001',
            targetDate: '2022-02-01',
            event: 'eventName1',
          }),
        ] as unknown as Records)
      );
      // Act
      const next = reducer(
        prev,
        actions.setRecords(
          new Array(1001).fill(null).map(
            () =>
              createDummyRecord({
                employeeCode: 'E-0002',
                employeeName: 'EmployeeB',
                departmentName: 'D-0002',
                targetDate: '2022-02-02',
                event: 'eventName2',
              }) as unknown as Records[number]
          )
        )
      );
      // Assert
      expect(next.originalRecords.length).toBe(1000);
      expect(next.overLimit).toBe(true);
    });
  });
});
