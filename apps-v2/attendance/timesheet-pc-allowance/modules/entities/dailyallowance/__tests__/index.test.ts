import dummyResponse from '@attendance/repositories/__tests__/mocks/att-daily-allowance-get';

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
  describe('.fetch(startDate, endDate, targetEmployeeId)', () => {
    describe('Success', () => {
      const dispatchMock = new DispatcherMock();

      beforeAll(() => {
        Api.setDummyResponse(
          '/att/daily-allowance/get',
          {
            startDate: '2021-11-01',
            endDate: '2021-11-30',
            empId: null,
          },
          dummyResponse
        );

        return actions.fetch('2021-11-01', '2021-11-30')(dispatchMock.dispatch);
      });

      test('1. LOADING_START', () => {
        expect(dispatchMock.logged[0].type).toBe('LOADING_START');
      });

      test('2. MODULES/ENTITIES/DAILY_ALLOWANCE/FETCH_SUCCESS', () => {
        expect(dispatchMock.logged[1].type).toBe(
          'MODULES/ENTITIES/DAILY_ALLOWANCE/FETCH_SUCCESS'
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
          '/att/daily-allowance/get',
          {
            startDate: '2021-11-01-Error',
            endDate: '2021-11-30-Error',
            empId: null,
          },
          new ErrorResponse({ message: 'Dummy Message' })
        );

        return actions.fetch(
          '2021-11-01-Error',
          '2021-11-30-Error'
        )(dispatchMock.dispatch);
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
  describe('.dailyRecordListSelector(state)', () => {
    const normalizedState = {
      common: {},
      userSetting: {},
      entities: {
        dailyallowance: {
          period: '',
          employeeInfoList: '',
          dailyRecordList: {
            allIds: ['002', '001'],
            byId: {
              '001': {
                allowanceName: '高所作業',
                allowanceCode: '001',
                managementType: 'StartEndTime',
                order: 1,
                startTime: 540,
                endTime: 600,
                totalTime: 60,
                quantity: null,
              },
              '002': {
                allowanceName: '高温作業',
                allowanceCode: '002',
                managementType: 'Hours',
                order: 2,
                startTime: null,
                endTime: null,
                totalTime: 60,
                quantity: null,
              },
            },
          },
        },
      },
    };

    test('returns denormalized list', () => {
      // @ts-ignore stateに必要なパラメータが不足しているが、テスト用のmockStateなので、ts-ignoreで対応
      expect(selectors.dailyRecordListSelector(normalizedState)).toEqual([
        {
          allowanceName: '高温作業',
          allowanceCode: '002',
          managementType: 'Hours',
          order: 2,
          startTime: null,
          endTime: null,
          totalTime: 60,
          quantity: null,
        },
        {
          allowanceName: '高所作業',
          allowanceCode: '001',
          managementType: 'StartEndTime',
          order: 1,
          startTime: 540,
          endTime: 600,
          totalTime: 60,
          quantity: null,
        },
      ]);
    });
  });
});

describe('reducer', () => {
  const stateKeys = ['dailyRecordList', 'employeeInfoList', 'period'];

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
