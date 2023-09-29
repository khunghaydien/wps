import tabType from '../../../../../../commons/constants/tabType';

import {
  LOADING_END,
  LOADING_START,
} from '../../../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../../../commons/actions/tab';

import listDummyResponse from '@attendance/repositories/__tests__/mocks/att-annual-leave-grant-list';

import ApiMock from '../../../../../../../__tests__/mocks/ApiMock';
import DispatcherMock from '../../../../../../../__tests__/mocks/DispatcherMock';
import {
  CHANGE_COMPANY,
  SELECT_MENU_ITEM,
} from '../../../../base/menu-pane/ui';
import {
  DESELECT_EMPLOYEE,
  SELECT_EMPLOYEE,
} from '../../../list-pane/ui/employee-list';
import { FETCH_SUCCESS as GRANT_HISTORY_LIST_FETCH_SUCCESS } from '../../entities/grant-history-list';
import reducer, {
  execute,
  EXECUTE_SUCCESS,
  UPDATE_COMMENT,
  UPDATE_DAYS_GRANTED,
  UPDATE_VALID_DATE_FROM,
  UPDATE_VALID_DATE_TO,
  updateComment,
  updateDaysGranted,
  updateValidDateFrom,
  updateValidDateTo,
} from '../new-grant-form';

describe('admin-pc/annual-paid-leave-management/modules/detail-pane/entitites/grant-history-list', () => {
  const targetEmployeeId = 'xxxxx';
  const targetDate = '2020-04-06';

  describe('action', () => {
    describe('updateDaysGranted', () => {
      test('should update state', () => {
        expect(updateDaysGranted('10')).toEqual({
          type: UPDATE_DAYS_GRANTED,
          payload: '10',
        });
      });
    });

    describe('updateValidDateFrom', () => {
      test('should update state', () => {
        expect(updateValidDateFrom('2017-01-01')).toEqual({
          type: UPDATE_VALID_DATE_FROM,
          payload: '2017-01-01',
        });
      });
    });

    describe('updateValidDateTo', () => {
      test('should update state', () => {
        expect(updateValidDateTo('2019-01-01')).toEqual({
          type: UPDATE_VALID_DATE_TO,
          payload: '2019-01-01',
        });
      });
    });

    describe('updateComment', () => {
      test('should update state', () => {
        expect(updateComment('臨時付与')).toEqual({
          type: UPDATE_COMMENT,
          payload: '臨時付与',
        });
      });
    });

    describe('execute ~ fetchGrantHistoryList ~ executeSuccess', () => {
      ApiMock.setDummyResponse(
        '/att/annual-leave/grant/create',
        {
          empId: targetEmployeeId,
          daysGranted: '10',
          validDateFrom: '2017-01-01',
          validDateTo: '2019-01-01',
          comment: '臨時付与',
        },
        {}
      );
      ApiMock.setDummyResponse(
        '/att/annual-leave/grant/list',
        {
          empId: targetEmployeeId,
          targetDate,
        },
        listDummyResponse
      );

      const dispatcherMock = new DispatcherMock();

      execute(
        targetEmployeeId,
        '10',
        '2017-01-01',
        '2019-01-01',
        targetDate,
        '臨時付与'
      )(dispatcherMock.dispatch);

      test('should show loading spinner', () => {
        expect(dispatcherMock.logged[0]).toEqual({
          type: LOADING_START,
        });
      });

      test('should update the list', () => {
        expect(dispatcherMock.logged[3]).toEqual({
          type: LOADING_START,
        });
        expect(dispatcherMock.logged[4]).toEqual({
          type: EXECUTE_SUCCESS,
        });
        expect(dispatcherMock.logged[5].type).toBe(
          GRANT_HISTORY_LIST_FETCH_SUCCESS
        );
      });

      test('should dispatch action', () => {
        expect(dispatcherMock.logged[6]).toEqual({
          type: LOADING_END,
        });
      });

      test('should hide loading spinner', () => {
        expect(dispatcherMock.logged[7]).toEqual({
          type: LOADING_END,
        });
      });
    });
  });

  describe('reducer', () => {
    const state = {
      daysGranted: '1',
      validDateFrom: '',
      validDateTo: '',
      comment: '',
    };

    describe('UPDATE_DAYS_GRANTED', () => {
      test('should update state', () => {
        const nextState = reducer(state, {
          type: UPDATE_DAYS_GRANTED,
          payload: '10',
        });

        expect(nextState.daysGranted).toBe('10');
      });
    });

    describe('UPDATE_VALID_DATE_FROM', () => {
      test('should update state', () => {
        const nextState = reducer(state, {
          type: UPDATE_VALID_DATE_FROM,
          payload: '2017-01-01',
        });

        expect(nextState.validDateFrom).toBe('2017-01-01');
        expect(nextState.validDateTo).toBe('2019-01-01');
      });
    });

    describe('UPDATE_VALID_DATE_TO', () => {
      test('should update state', () => {
        const nextState = reducer(state, {
          type: UPDATE_VALID_DATE_TO,
          payload: '2019-01-01',
        });

        expect(nextState.validDateTo).toBe('2019-01-01');
      });
    });

    describe('UPDATE_COMMENT', () => {
      test('should update state', () => {
        const nextState = reducer(state, {
          type: UPDATE_COMMENT,
          payload: '臨時付与',
        });

        expect(nextState.comment).toBe('臨時付与');
      });
    });

    describe('EXECUTE_SUCCESS', () => {
      test('should clear state', () => {
        const nextState = reducer(
          {
            daysGranted: '10',
            validDateFrom: '2017-01-01',
            validDateTo: '2019-01-01',
            comment: '臨時付与',
          },
          {
            type: EXECUTE_SUCCESS,
          }
        );

        expect(nextState).toEqual(state);
      });
    });

    describe('SELECT_EMPLOYEE', () => {
      test('should clear state', () => {
        const nextState = reducer(
          {
            daysGranted: '10',
            validDateFrom: '2017-01-01',
            validDateTo: '2019-01-01',
            comment: '臨時付与',
          },
          {
            type: SELECT_EMPLOYEE,
            payload: 'xxxxx',
          }
        );

        expect(nextState).toEqual(state);
      });
    });

    describe('DESELECT_EMPLOYEE', () => {
      test('should clear state', () => {
        const nextState = reducer(
          {
            daysGranted: '10',
            validDateFrom: '2017-01-01',
            validDateTo: '2019-01-01',
            comment: '臨時付与',
          },
          {
            type: DESELECT_EMPLOYEE,
          }
        );

        expect(nextState).toEqual(state);
      });
    });

    describe('SELECT_MENU_ITEM', () => {
      test('should clear state', () => {
        const nextState = reducer(
          {
            daysGranted: '10',
            validDateFrom: '2017-01-01',
            validDateTo: '2019-01-01',
            comment: '臨時付与',
          },
          {
            type: SELECT_MENU_ITEM,
            payload: 'Organization',
          }
        );

        expect(nextState).toEqual(state);
      });
    });

    describe('CHANGE_COMPANY', () => {
      test('should clear state', () => {
        const nextState = reducer(
          {
            daysGranted: '10',
            validDateFrom: '2017-01-01',
            validDateTo: '2019-01-01',
            comment: '臨時付与',
          },
          {
            type: CHANGE_COMPANY,
            payload: 'xxxxx',
          }
        );

        expect(nextState).toEqual(state);
      });
    });

    describe('SELECT_TAB', () => {
      test('should clear state', () => {
        const nextState = reducer(
          {
            daysGranted: '10',
            validDateFrom: '2017-01-01',
            validDateTo: '2019-01-01',
            comment: '臨時付与',
          },
          {
            type: SELECT_TAB,
            payload: tabType.ADMIN_ORGANIZATION_REQUEST,
          }
        );

        expect(nextState).toEqual(state);
      });
    });
  });
});
