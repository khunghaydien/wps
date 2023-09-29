import tabType from '../../../../../../commons/constants/tabType';

import { SELECT_TAB } from '../../../../../../commons/actions/tab';

import {
  CHANGE_COMPANY,
  SELECT_MENU_ITEM,
} from '../../../../base/menu-pane/ui';
import {
  CLEAR as CLEAR_LEAVE_TYPES,
  FETCH_LEAVE_TYPES_SUCCESS,
} from '../../entities/leave-types';
import reducer, {
  CHANGE_LEAVE_TYPE,
  changeLeaveType,
  initialState,
} from '../leave-type';

describe('admin-pc/managed-leave-management/modules/list-pane/ui/leave-type', () => {
  describe('action', () => {
    describe('changeLeaveType', () => {
      test('should return action', () => {
        expect(changeLeaveType('xxxx')).toEqual({
          type: CHANGE_LEAVE_TYPE,
          payload: 'xxxx',
        });
      });
    });
  });

  describe('reducer', () => {
    describe('FETCH_LEAVE_TYPES_SUCCESS', () => {
      test('should clear state', () => {
        const state = {
          selectedLeaveTypeId: 'xxxx',
        };
        const nextState = reducer(state, {
          // @ts-ignore
          type: FETCH_LEAVE_TYPES_SUCCESS,
          // @ts-ignore
          payload: {
            allIds: [],
            byId: {},
          },
        });

        expect(nextState).toEqual(initialState);
      });
    });
    describe('CLEAR_LEAVE_TYPES', () => {
      test('should clear state', () => {
        const state = {
          selectedLeaveTypeId: 'xxxx',
        };
        const nextState = reducer(state, {
          // @ts-ignore
          type: CLEAR_LEAVE_TYPES,
        });

        expect(nextState).toEqual(initialState);
      });
    });
    describe('SELECT_MENU_ITEM', () => {
      test('should clear state', () => {
        const state = {
          selectedLeaveTypeId: 'xxxx',
        };
        const nextState = reducer(state, {
          // @ts-ignore
          type: SELECT_MENU_ITEM,
          payload: 'Organization',
        });

        expect(nextState).toEqual(initialState);
      });
    });
    describe('CHANGE_COMPANY', () => {
      test('should clear state', () => {
        const state = {
          selectedLeaveTypeId: 'xxxx',
        };
        const nextState = reducer(state, {
          // @ts-ignore
          type: CHANGE_COMPANY,
          payload: 'a0F6F00000qn3QGUAY',
        });

        expect(nextState).toEqual(initialState);
      });
    });
    describe('SELECT_TAB', () => {
      test('should clear state', () => {
        const state = {
          selectedLeaveTypeId: 'xxxx',
        };
        const nextState = reducer(state, {
          // @ts-ignore
          type: SELECT_TAB,
          payload: tabType.ADMIN_ORGANIZATION_REQUEST,
        });

        expect(nextState).toEqual(initialState);
      });
    });
  });
});
