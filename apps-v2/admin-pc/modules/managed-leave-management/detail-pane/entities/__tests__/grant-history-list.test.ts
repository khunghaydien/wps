import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import tabType from '../../../../../../commons/constants/tabType';

import {
  LOADING_END,
  LOADING_START,
} from '../../../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../../../commons/actions/tab';

import dummyResponse, {
  record as grantHistoryRecord,
  recordId as grantHistoryRecordId,
} from '@attendance/repositories/__tests__/mocks/att-managed-leave-grant-list';

import ApiMock, {
  ErrorResponse,
} from '../../../../../../../__tests__/mocks/ApiMock';
import DispatcherMock from '../../../../../../../__tests__/mocks/DispatcherMock';
import {
  CHANGE_COMPANY,
  SELECT_MENU_ITEM,
} from '../../../../base/menu-pane/ui';
import { SEARCH_EMPLOYEE_SUCCESS } from '../../../list-pane/entities/employee-list';
import { DESELECT_EMPLOYEE } from '../../../list-pane/ui/employee-list';
import { CHANGE_LEAVE_TYPE } from '../../../list-pane/ui/leave-type';
import { HIDE } from '../../../update-dialog/ui';
import reducer, {
  DELETE_SUCCESS,
  deleteGrantedLeave,
  fetch,
  FETCH_SUCCESS,
} from '../grant-history-list';

const middlewares = [thunk];

const mockStore = configureStore(middlewares);

describe('admin-pc/managed-leave-management/modules/detail-pane/entitites/grant-history-list', () => {
  ApiMock.setDummyResponse(
    '/att/managed-leave/grant/list',
    {
      empId: 'xxxxx',
      leaveId: 'xxxx',
      targetDate: '2020-04-07',
    },
    dummyResponse
  );

  const dispatcherMock = new DispatcherMock();

  describe('action', () => {
    describe('fetch ~ fetchSuccess', () => {
      fetch('xxxxx', 'xxxx', '2020-04-07')(dispatcherMock.dispatch);

      test('should show loading spinner', () => {
        expect(dispatcherMock.logged[0]).toEqual({
          type: LOADING_START,
        });
      });

      test('should dispatch action with records', () => {
        expect(dispatcherMock.logged[1]).toEqual({
          type: FETCH_SUCCESS,
          payload: {
            allIds: [grantHistoryRecordId],
            byId: {
              [grantHistoryRecordId]: grantHistoryRecord,
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

    describe('delete paid leave', () => {
      describe('Whether the deletion was performed correctly when the "Yes" button was pressed.', () => {
        // arrange
        const initialState = {
          allIds: [],
          byId: {},
        };

        const store = mockStore(initialState);

        beforeAll(() => {
          ApiMock.setDummyResponse(
            '/att/managed-leave/grant/delete',
            {
              grantId: 'xxxxxxx',
            },
            dummyResponse
          );

          const confirm = () => () => Promise.resolve(true);
          // run
          store.dispatch(
            // @ts-ignore
            deleteGrantedLeave(
              'xxxxxxx',
              'xxxxx',
              'xxxx',
              '2020-04-07',
              confirm
            )
          );
        });

        test('load starts first', () => {
          // assert
          const actions = store.getActions();
          const expectAction = {
            type: LOADING_START,
          };
          expect(actions[0]).toEqual(expectAction);
        });

        test('succeeds in deletion', () => {
          // assert
          const actions = store.getActions();
          const expectAction = {
            type: DELETE_SUCCESS,
          };
          expect(actions[1]).toEqual(expectAction);
        });

        test('start loading for fetch', () => {
          // assert
          const actions = store.getActions();
          const expectAction = {
            type: LOADING_START,
          };
          expect(actions[2]).toEqual(expectAction);
        });

        test('succeeds in fetch', () => {
          // assert
          const actions = store.getActions();
          const expectAction = {
            type: FETCH_SUCCESS,
            payload: {
              allIds: [grantHistoryRecordId],
              byId: {
                [grantHistoryRecordId]: grantHistoryRecord,
              },
            },
          };
          expect(actions[3]).toEqual(expectAction);
        });

        test('end loading for fetch', () => {
          // assert
          const actions = store.getActions();
          const expectAction = {
            type: LOADING_END,
          };
          expect(actions[4]).toEqual(expectAction);
        });

        test('update dialog is closed', () => {
          // assert
          const actions = store.getActions();
          const expectAction = {
            type: HIDE,
          };
          expect(actions[5]).toEqual(expectAction);
        });

        test('end loading for delete', () => {
          // assert
          const actions = store.getActions();
          const expectAction = {
            type: LOADING_END,
          };
          expect(actions[6]).toEqual(expectAction);
        });
      });

      describe('Whether nothing happen when you press the "No" button.', () => {
        // arrange
        const initialState = {
          allIds: [],
          byId: {},
        };

        const store = mockStore(initialState);

        beforeAll(() => {
          const confirm = () => () => Promise.resolve(false);
          // run
          store.dispatch(
            // @ts-ignore
            deleteGrantedLeave(
              'xxxxxxx',
              'xxxxx',
              'xxxx',
              '2020-04-07',
              confirm
            )
          );
        });

        test('nothing happen', () => {
          // assert
          const actions = store.getActions();
          expect(actions).toEqual([]);
        });
      });

      describe('Whether correct error handling is performed when error occur.', () => {
        // arrange
        const initialState = {
          allIds: [],
          byId: {},
        };

        const store = mockStore(initialState);

        beforeAll(() => {
          ApiMock.setDummyResponse(
            '/att/managed-leave/grant/delete',
            {
              grantId: 'xxxxxxx',
            },
            new ErrorResponse({ message: 'エラーが発生しました' })
          );
          const confirm = () => () => Promise.resolve(true);
          // run
          store.dispatch(
            // @ts-ignore
            deleteGrantedLeave(
              'xxxxxxx',
              'xxxxx',
              'xxxx',
              '2020-04-07',
              confirm
            )
          );
        });

        test('load starts first', () => {
          // assert
          const actions = store.getActions();
          const expectAction = {
            type: LOADING_START,
          };
          expect(actions[0]).toEqual(expectAction);
        });

        test('load ends second', () => {
          // assert
          const actions = store.getActions();
          const expectAction = {
            type: LOADING_END,
          };
          expect(actions[1]).toEqual(expectAction);
        });

        test('Whether type is CATCH_API_ERROR.', () => {
          // assert
          const actions = store.getActions();
          const expectType = 'CATCH_API_ERROR';
          expect(actions[2].type).toEqual(expectType);
        });
      });
    });
  });

  describe('reducer', () => {
    describe('SEARCH_EMPLOYEE_SUCCESS', () => {
      test('should clear state', () => {
        const state = {
          allIds: [grantHistoryRecordId],
          byId: {
            [grantHistoryRecordId]: grantHistoryRecord,
          },
        };
        const nextState = reducer(state, {
          type: SEARCH_EMPLOYEE_SUCCESS,
          payload: {
            allIds: [],
            byId: {},
          },
        });

        expect(nextState).toEqual({
          allIds: [],
          byId: {},
        });
      });
    });
    describe('DESELECT_EMPLOYEE', () => {
      test('should clear state', () => {
        const state = {
          allIds: [grantHistoryRecordId],
          byId: {
            [grantHistoryRecordId]: grantHistoryRecord,
          },
        };
        const nextState = reducer(state, {
          type: DESELECT_EMPLOYEE,
        });

        expect(nextState).toEqual({
          allIds: [],
          byId: {},
        });
      });
    });
    describe('CHANGE_LEAVE_TYPE', () => {
      test('should clear state', () => {
        const state = {
          allIds: [grantHistoryRecordId],
          byId: {
            [grantHistoryRecordId]: grantHistoryRecord,
          },
        };
        const nextState = reducer(state, {
          type: CHANGE_LEAVE_TYPE,
          payload: 'xxxx',
        });

        expect(nextState).toEqual({
          allIds: [],
          byId: {},
        });
      });
    });
    describe('SELECT_MENU_ITEM', () => {
      test('should clear state', () => {
        const state = {
          allIds: [grantHistoryRecordId],
          byId: {
            [grantHistoryRecordId]: grantHistoryRecord,
          },
        };
        const nextState = reducer(state, {
          type: SELECT_MENU_ITEM,
          payload: 'Organization',
        });

        expect(nextState).toEqual({
          allIds: [],
          byId: {},
        });
      });
    });
    describe('CHANGE_COMPANY', () => {
      test('should clear state', () => {
        const state = {
          allIds: [grantHistoryRecordId],
          byId: {
            [grantHistoryRecordId]: grantHistoryRecord,
          },
        };
        const nextState = reducer(state, {
          type: CHANGE_COMPANY,
          payload: 'a0F6F00000qn3QGUAY',
        });

        expect(nextState).toEqual({
          allIds: [],
          byId: {},
        });
      });
    });
    describe('SELECT_TAB', () => {
      test('should clear state', () => {
        const state = {
          allIds: [grantHistoryRecordId],
          byId: {
            [grantHistoryRecordId]: grantHistoryRecord,
          },
        };
        const nextState = reducer(state, {
          type: SELECT_TAB,
          payload: tabType.ADMIN_ORGANIZATION_REQUEST,
        });

        expect(nextState).toEqual({
          allIds: [],
          byId: {},
        });
      });
    });
  });
});
