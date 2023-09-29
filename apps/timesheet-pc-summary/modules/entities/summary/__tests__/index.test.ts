import mockResponse from '../../../../../repositories/__tests__/mocks/response/att__summary__get';

import reducer, {
  // @ts-ignore
  __get__,
  constants,
  selectors,
} from '../index';

describe('reducer', () => {
  describe('should store state properly', () => {
    const nextState = reducer(__get__.initialState, {
      type: constants.FETCH_SUCCESS,
      payload: mockResponse,
    });

    test('should have summaryName with correct value', () =>
      expect(nextState.summaryName).toBe('2017-09'));
    test('should have departmentName with correct value', () =>
      expect(nextState.departmentName).toBe('テスト部署'));
    test('should have workingTypeName with correct value', () =>
      expect(nextState.workingTypeName).toBe('固定労働制'));
    test('should have employeeCode with correct value', () =>
      expect(nextState.employeeCode).toBe('000001'));
    test('should have employeeName with correct value', () =>
      expect(nextState.employeeName).toBe('田中 太郎'));

    test('should have normalized records', () => {
      expect(
        nextState.records && Array.isArray(nextState.records.allIds)
      ).toBeTruthy();
      expect(
        nextState.records && typeof nextState.records.byId === 'object'
      ).toBeTruthy();
    });

    test('should have normalized summaries', () => {
      expect(
        nextState.summaries && Array.isArray(nextState.summaries.allIds)
      ).toBeTruthy();
      expect(
        nextState.summaries && typeof nextState.summaries.byId === 'object'
      ).toBeTruthy();
    });
  });

  describe('should mask WorkAbsenceDays if the request has not yet approved', () => {
    test('Status: Approved, the value should not be masked', () => {
      const nextState = reducer(__get__.initialState, {
        type: constants.FETCH_SUCCESS,
        payload: mockResponse,
      });
      const workAbsenceDays =
        nextState.summaries.byId.AbsenceSummary.items.byId.WorkAbsenceDays;
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
      const workAbsenceDays =
        nextState.summaries.byId.AbsenceSummary.items.byId.WorkAbsenceDays;
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
      const workAbsenceDays =
        nextState.summaries.byId.AbsenceSummary.items.byId.WorkAbsenceDays;
      expect(workAbsenceDays.value).toBe(3);
    });
  });
});

describe('selectors', () => {
  const nextState = {
    entities: {
      summary: reducer(__get__.initialState, {
        type: constants.FETCH_SUCCESS,
        payload: mockResponse,
      }),
    },
  };

  describe('.restTimeTotalSelector(state)', () => {
    test('should return correct value', () =>
      // @ts-ignore stateに必要なパラメータが不足しているが、テスト用のmockStateなので、ts-ignoreで対応
      expect(selectors.restTimeTotalSelector(nextState)).toBe(1260));
  });

  describe('.realWorkTimeTotalSelector(state)', () => {
    test('should return correct value', () =>
      // @ts-ignore stateに必要なパラメータが不足しているが、テスト用のmockStateなので、ts-ignoreで対応
      expect(selectors.realWorkTimeTotalSelector(nextState)).toBe(10380));
  });

  describe('.overTimeTotalSelector(state)', () => {
    test('should return correct value', () =>
      // @ts-ignore stateに必要なパラメータが不足しているが、テスト用のmockStateなので、ts-ignoreで対応
      expect(selectors.overTimeTotalSelector(nextState)).toBe(300));
  });

  describe('.nightTimeTotalSelector(state)', () => {
    test('should return correct value', () =>
      // @ts-ignore stateに必要なパラメータが不足しているが、テスト用のmockStateなので、ts-ignoreで対応
      expect(selectors.nightTimeTotalSelector(nextState)).toBe(60));
  });

  describe('.lostTimeTotalSelector(state)', () => {
    test('should return correct value', () =>
      // @ts-ignore stateに必要なパラメータが不足しているが、テスト用のmockStateなので、ts-ignoreで対応
      expect(selectors.lostTimeTotalSelector(nextState)).toBe(0));
  });

  describe('.recordsSelector(state)', () => {
    test('should return un-normalized records', () => {
      // @ts-ignore stateに必要なパラメータが不足しているが、テスト用のmockStateなので、ts-ignoreで対応
      expect(Array.isArray(selectors.recordsSelector(nextState))).toBeTruthy();
    });
  });

  describe('.summariesSelector(state)', () => {
    test('should return un-normalized records', () => {
      expect(
        Array.isArray(selectors.summariesSelector(nextState))
      ).toBeTruthy();
    });
  });
});
