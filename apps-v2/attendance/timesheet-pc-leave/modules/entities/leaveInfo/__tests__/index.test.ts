import dummyResponse from '@attendance/repositories/__tests__/mocks/att-leave-info-get';

import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';

import Api, {
  ErrorResponse,
} from '../../../../../../../__tests__/mocks/ApiMock';
import DispatcherMock from '../../../../../../../__tests__/mocks/DispatcherMock';
import reducer, {
  // @ts-ignore
  __get__,
  actions,
  constants,
  selectors,
} from '../index';

describe('actions', () => {
  describe('.fetch(targetDate, targetEmployeeId)', () => {
    describe('Success', () => {
      const dispatchMock = new DispatcherMock();

      beforeAll(() => {
        Api.setDummyResponse(
          '/att/leave-info/get',
          {
            targetDate: '2018-01-01',
            empId: null,
          },
          dummyResponse
        );

        return actions.fetch('2018-01-01')(dispatchMock.dispatch);
      });

      test('1. LOADING_START', () => {
        expect(dispatchMock.logged[0].type).toBe('LOADING_START');
      });

      test('2. MODULES/ENTITIES/LEAVE_INFO/FETCH_SUCCESS', () => {
        expect(dispatchMock.logged[1].type).toBe(
          'MODULES/ENTITIES/LEAVE_INFO/FETCH_SUCCESS'
        );
      });

      test('3. LOADING_END', () => {
        expect(dispatchMock.logged[2].type).toBe('LOADING_END');
      });
    });

    describe('Error', () => {
      const dispatchMock = new DispatcherMock();

      beforeAll(() => {
        Api.setDummyResponse(
          '/att/leave-info/get',
          {
            targetDate: '2018-01-01-Error',
            empId: null,
          },
          new ErrorResponse({ message: 'Dummy Message' })
        );

        return actions.fetch('2018-01-01-Error')(dispatchMock.dispatch);
      });

      test('1. LOADING_START', () => {
        expect(dispatchMock.logged[0].type).toBe('LOADING_START');
      });

      test('2. CATCH_API_ERROR', () => {
        expect(dispatchMock.logged[1].type).toBe('CATCH_API_ERROR');
      });

      test('3. LOADING_END', () => {
        expect(dispatchMock.logged[2].type).toBe('LOADING_END');
      });
    });
  });
});

describe('selectors', () => {
  describe('.leaveDetailsSelector(state)', () => {
    const normalizedState = {
      common: {},
      userSetting: {},
      entities: {
        leaveInfo: {
          period: '',
          departmentName: '',
          workingTypeName: '',
          employeeCode: '',
          employeeName: '',
          leaveDetails: {
            allIds: ['002', '001'],
            byId: {
              '001': {
                requestId: '001',
                name: '年次有給休暇',
                startDate: '2018-01-01',
                endDate: '2018-01-01',
                range: LEAVE_RANGE.Day,
                days: null,
                leaveTime: null,
                remarks: null,
              },
              '002': {
                requestId: '002',
                name: '年次有給休暇',
                startDate: '2018-01-02',
                endDate: '2018-01-02',
                range: LEAVE_RANGE.Day,
                days: null,
                leaveTime: null,
                remarks: null,
              },
            },
          },
          annualLeave: null,
          paidManagedLeave: null,
          unpaidManagedLeave: null,
          compensatoryLeave: null,
        },
      },
    };

    test('returns denormalized list', () => {
      // @ts-ignore stateに必要なパラメータが不足しているが、テスト用のmockStateなので、ts-ignoreで対応
      expect(selectors.leaveDetailsSelector(normalizedState)).toEqual([
        {
          requestId: '002',
          name: '年次有給休暇',
          startDate: '2018-01-02',
          endDate: '2018-01-02',
          range: LEAVE_RANGE.Day,
          days: null,
          leaveTime: null,
          remarks: null,
        },
        {
          requestId: '001',
          name: '年次有給休暇',
          startDate: '2018-01-01',
          endDate: '2018-01-01',
          range: LEAVE_RANGE.Day,
          days: null,
          leaveTime: null,
          remarks: null,
        },
      ]);
    });
  });
});

describe('reducer', () => {
  const stateKeys = [
    'annualLeave',
    'compensatoryLeave',
    'employeeInfoList',
    'leaveDetails',
    'paidManagedLeave',
    'period',
    'unpaidManagedLeave',
  ];

  describe('(initial)', () => {
    test('returns correct shape', () => {
      const initialState = reducer(undefined, {});
      expect(Object.keys(initialState).sort()).toEqual(stateKeys);
    });
  });

  describe('action.type === FETCH_SUCCESS', () => {
    test('replaces all field', () => {
      const payload = {};
      stateKeys.forEach((key) => {
        payload[key] = 'dummy';
      });

      const action = {
        type: constants.FETCH_SUCCESS,
        payload,
      };
      const nextState = reducer(__get__.initialState, action);

      expect(nextState).not.toBe(payload);
      expect(nextState).toEqual(payload);
    });
  });
});
