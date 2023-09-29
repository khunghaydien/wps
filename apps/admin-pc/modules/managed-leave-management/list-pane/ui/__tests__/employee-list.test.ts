import tabType from '../../../../../../commons/constants/tabType';

import { SELECT_TAB } from '../../../../../../commons/actions/tab';

import {
  CHANGE_COMPANY,
  SELECT_MENU_ITEM,
} from '../../../../base/menu-pane/ui';
import { CLEAR, SEARCH_EMPLOYEE_SUCCESS } from '../../entities/employee-list';
import reducer, { SELECT_EMPLOYEE } from '../employee-list';
import { CHANGE_LEAVE_TYPE } from '../leave-type';

describe('admin-pc/managed-leave-management/modules/list-pane/ui/employee-list', () => {
  describe('reducer', () => {
    describe('SELECT_EMPLOYEE', () => {
      const action = {
        type: SELECT_EMPLOYEE,
        payload: {
          selectedEmployeeId: 'a0I7F000000OwqTUAS',
          targetDate: '2020-04-07',
        },
      };
      const state = {
        isSearchExecuted: false,
        selectedEmployeeId: null,
        targetDate: '',
      };
      const nextState = reducer(state, action);

      test('should update state when select employee', () => {
        expect(nextState.selectedEmployeeId).toBe('a0I7F000000OwqTUAS');
      });
    });

    describe('SEARCH_EMPLOYEE_SUCCESS', () => {
      test('should update state when search performed', () => {
        const state = {
          isSearchExecuted: false,
          selectedEmployeeId: null,
          targetDate: '',
        };
        const nextState = reducer(state, {
          type: SEARCH_EMPLOYEE_SUCCESS,
          payload: {
            allIds: [],
            byId: {},
          },
        });

        expect(nextState.isSearchExecuted).toBeTruthy();
      });
    });

    describe('CLEAR', () => {
      test('should clear state', () => {
        const state = {
          isSearchExecuted: true,
          selectedEmployeeId: 'a0I7F000000OwqTUAS',
          targetDate: '2020-04-07',
        };
        const nextState = reducer(state, {
          type: CLEAR,
        });

        expect(nextState).toEqual({
          isSearchExecuted: false,
          selectedEmployeeId: null,
          targetDate: '',
        });
      });
    });
    describe('CHANGE_LEAVE_TYPE', () => {
      test('should clear state', () => {
        const state = {
          isSearchExecuted: true,
          selectedEmployeeId: 'a0I7F000000OwqTUAS',
          targetDate: '2020-04-07',
        };
        const nextState = reducer(state, {
          type: CHANGE_LEAVE_TYPE,
          payload: 'xxxx',
        });

        expect(nextState).toEqual({
          isSearchExecuted: false,
          selectedEmployeeId: null,
          targetDate: '',
        });
      });
    });
    describe('SELECT_MENU_ITEM', () => {
      test('should clear state', () => {
        const state = {
          isSearchExecuted: true,
          selectedEmployeeId: 'a0I7F000000OwqTUAS',
          targetDate: '2020-04-07',
        };
        const nextState = reducer(state, {
          type: SELECT_MENU_ITEM,
          payload: 'Organization',
        });

        expect(nextState).toEqual({
          isSearchExecuted: false,
          selectedEmployeeId: null,
          targetDate: '',
        });
      });
    });
    describe('CHANGE_COMPANY', () => {
      test('should clear state', () => {
        const state = {
          isSearchExecuted: true,
          selectedEmployeeId: 'a0I7F000000OwqTUAS',
          targetDate: '2020-04-07',
        };
        const nextState = reducer(state, {
          type: CHANGE_COMPANY,
          payload: 'a0F6F00000qn3QGUAY',
        });

        expect(nextState).toEqual({
          isSearchExecuted: false,
          selectedEmployeeId: null,
          targetDate: '',
        });
      });
    });
    describe('SELECT_TAB', () => {
      test('should clear state', () => {
        const state = {
          isSearchExecuted: true,
          selectedEmployeeId: 'a0I7F000000OwqTUAS',
          targetDate: '2020-04-07',
        };
        const nextState = reducer(state, {
          type: SELECT_TAB,
          payload: tabType.ADMIN_ORGANIZATION_REQUEST,
        });

        expect(nextState).toEqual({
          isSearchExecuted: false,
          selectedEmployeeId: null,
          targetDate: '',
        });
      });
    });
  });
});
