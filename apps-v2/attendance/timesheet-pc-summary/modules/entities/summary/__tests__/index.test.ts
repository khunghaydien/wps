import reducer, {
  // @ts-ignore
  __get__,
  constants,
} from '../index';
import mockResponse from './mocks/att__summary__get';

describe('reducer', () => {
  describe('should store state properly', () => {
    const nextState = reducer(__get__.initialState, {
      type: constants.FETCH_SUCCESS,
      payload: mockResponse,
    });

    test('should have summaryName with correct value', () =>
      expect(nextState.name).toBe('2017-09'));
    test('should have departmentName with correct value', () =>
      expect(nextState.ownerInfos[0].department.name).toBe('テスト部署'));
    test('should have workingTypeName with correct value', () =>
      expect(nextState.ownerInfos[0].workingType.name).toBe('固定労働制'));
    test('should have employeeCode with correct value', () =>
      expect(nextState.ownerInfos[0].employee.code).toBe('000001'));
    test('should have employeeName with correct value', () =>
      expect(nextState.ownerInfos[0].employee.name).toBe('田中 太郎'));
  });

  describe('should mask WorkAbsenceDays if the request has not yet approved', () => {
    test('Status: Approved, the value should not be masked', () => {
      const nextState = reducer(__get__.initialState, {
        type: constants.FETCH_SUCCESS,
        payload: mockResponse,
      });
      const workAbsenceDays = nextState.summaries
        .find(({ name }) => name === 'AbsenceSummary')
        ?.items?.find(({ name }) => name === 'WorkAbsenceDays');
      expect(workAbsenceDays.value).toBe(3);
    });

    test('Status: NotRequested, the value should be masked', () => {
      const nextState = reducer(__get__.initialState, {
        type: constants.FETCH_SUCCESS,
        payload: {
          ...mockResponse,
          status: 'NotRequested',
        },
      });
      const workAbsenceDays = nextState.summaries
        .find(({ name }) => name === 'AbsenceSummary')
        ?.items?.find(({ name }) => name === 'WorkAbsenceDays');
      expect(workAbsenceDays.value).toBe(3);
      expect(workAbsenceDays.unit).toEqual('days');
    });

    test('Status: NotRequested, but the value should not be masked in a period of absence', () => {
      const nextState = reducer(__get__.initialState, {
        type: constants.FETCH_SUCCESS,
        payload: {
          ...mockResponse,
          status: 'NotRequested',
          hasCalculatedAbsence: true,
        },
      });
      const workAbsenceDays = nextState.summaries
        .find(({ name }) => name === 'AbsenceSummary')
        ?.items?.find(({ name }) => name === 'WorkAbsenceDays');
      expect(workAbsenceDays.value).toBe(3);
    });
  });
});
