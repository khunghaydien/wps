import tabType from '../../../../../../commons/constants/tabType';

import {
  LOADING_END,
  LOADING_START,
} from '../../../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../../../commons/actions/tab';

import ApiMock from '../../../../../../../__tests__/mocks/ApiMock';
import DispatcherMock from '../../../../../../../__tests__/mocks/DispatcherMock';
import {
  CHANGE_COMPANY,
  SELECT_MENU_ITEM,
} from '../../../../base/menu-pane/ui';
import reducer, {
  CLEAR,
  clear,
  FETCH_LEAVE_TYPES_SUCCESS,
  fetchLeaveTypes,
  initialState,
} from '../leave-types';

describe('admin-pc/managed-leave-management/modules/list-pane/entities/leave-types', () => {
  describe('action', () => {
    describe('fetchLeaveTypes ~ fetchLeaveTypesSuccess', () => {
      ApiMock.setDummyResponse(
        '/att/managed-leave/list',
        {
          companyId: 'a0F6F00000qn3QGUAY',
        },
        {
          records: [
            {
              id: 'xxxxxxx',
              name: '積み休',
            },
          ],
        }
      );

      const dispatcherMock = new DispatcherMock();

      fetchLeaveTypes('a0F6F00000qn3QGUAY')(dispatcherMock.dispatch);

      test('should show loading spinner', () => {
        expect(dispatcherMock.logged[0]).toEqual({
          type: LOADING_START,
        });
      });
      test('should dispatch action', () => {
        expect(dispatcherMock.logged[1]).toEqual({
          type: FETCH_LEAVE_TYPES_SUCCESS,
          payload: {
            allIds: ['xxxxxxx'],
            byId: {
              xxxxxxx: {
                id: 'xxxxxxx',
                name: '積み休',
              },
            },
          },
        });
      });
      test('should hide loading spinner', () => {
        expect(dispatcherMock.logged[2]).toEqual({
          type: LOADING_END,
        });
      });
    });
    describe('clear', () => {
      test('should return action', () => {
        expect(clear()).toEqual({
          type: CLEAR,
        });
      });
    });
  });

  describe('reducer', () => {
    describe('CLEAR', () => {
      test('should clear state', () => {
        const state = {
          allIds: ['xxxxxxx'],
          byId: {
            xxxxxxx: {
              id: 'xxxxxxx',
              name: '積み休',
            },
          },
        };
        const nextState = reducer(state, {
          type: CLEAR,
        });

        expect(nextState).toEqual(initialState);
      });
    });
    describe('SELECT_MENU_ITEM', () => {
      test('should clear state', () => {
        const state = {
          allIds: ['xxxxxxx'],
          byId: {
            xxxxxxx: {
              id: 'xxxxxxx',
              name: '積み休',
            },
          },
        };
        const nextState = reducer(state, {
          type: SELECT_MENU_ITEM,
          payload: 'Organization',
        });

        expect(nextState).toEqual(initialState);
      });
    });
    describe('CHANGE_COMPANY', () => {
      test('should clear state', () => {
        const state = {
          allIds: ['xxxxxxx'],
          byId: {
            xxxxxxx: {
              id: 'xxxxxxx',
              name: '積み休',
            },
          },
        };
        const nextState = reducer(state, {
          type: CHANGE_COMPANY,
          payload: 'a0F6F00000qn3QGUAY',
        });

        expect(nextState).toEqual(initialState);
      });
    });
    describe('SELECT_TAB', () => {
      test('should clear state', () => {
        const state = {
          allIds: ['xxxxxxx'],
          byId: {
            xxxxxxx: {
              id: 'xxxxxxx',
              name: '積み休',
            },
          },
        };
        const nextState = reducer(state, {
          type: SELECT_TAB,
          payload: tabType.ADMIN_ORGANIZATION_REQUEST,
        });

        expect(nextState).toEqual(initialState);
      });
    });
  });
});
