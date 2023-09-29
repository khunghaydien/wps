import { AnyAction } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';

import reducer, { actions as toastActions, showToast } from '../toast';

const middlewares = [thunk];
const mockStore = configureMockStore<
  any,
  ThunkDispatch<undefined, undefined, AnyAction>
>(middlewares);

const runReducer = (actions, state) => {
  let newState = state;
  for (const a of actions) {
    newState = reducer(newState, a);
  }
  return newState;
};

describe('toast', () => {
  const initialState = {
    message: '',
    isShow: false,
  };
  describe('show', () => {
    test('Passing a message will be reflected in the state', () => {
      const store = mockStore(initialState);
      store.dispatch(toastActions.show('申請しました'));

      const actualAction = store.getActions();
      const actualState = runReducer(actualAction, initialState);

      const expectAction = {
        payload: {
          message: '申請しました',
          variant: 'success',
        },
        type: 'COMMONS/MODULES/TOAST/SHOW',
      };

      const expectState = {
        message: '申請しました',
        isShow: true,
        variant: 'success',
      };
      expect(actualAction).toEqual([expectAction]);
      expect(actualState).toEqual(expectState);
    });

    test('Passing a empty message will be reflected in the state', () => {
      const store = mockStore(initialState);
      store.dispatch(toastActions.show(''));

      const actualAction = store.getActions();
      const actualState = runReducer(actualAction, initialState);

      const expectAction = {
        payload: {
          message: '',
          variant: 'success',
        },
        type: 'COMMONS/MODULES/TOAST/SHOW',
      };

      const expectState = {
        message: '',
        isShow: true,
        variant: 'success',
      };
      expect(actualAction).toEqual([expectAction]);
      expect(actualState).toEqual(expectState);
    });

    test('Passing a message with options will be reflected in the state', () => {
      const store = mockStore(initialState);
      store.dispatch(
        toastActions.show('申請しました', 'success', { messageType: 'Example' })
      );

      const actualAction = store.getActions();
      const actualState = runReducer(actualAction, initialState);

      const expectAction = {
        payload: {
          message: '申請しました',
          variant: 'success',
          options: { messageType: 'Example' },
        },
        type: 'COMMONS/MODULES/TOAST/SHOW',
      };

      const expectState = {
        message: '申請しました',
        isShow: true,
        variant: 'success',
        options: { messageType: 'Example' },
      };
      expect(actualAction).toEqual([expectAction]);
      expect(actualState).toEqual(expectState);
    });
  });
  describe('hide', () => {
    test('IsShow is false when issuing hide', () => {
      const showedToastOfState = {
        message: '',
        isShow: true,
        variant: 'success',
      };

      const store = mockStore(showedToastOfState);
      store.dispatch(toastActions.hide());

      const actualAction = store.getActions();
      const actualState = runReducer(actualAction, showedToastOfState);

      const expectAction = {
        type: 'COMMONS/MODULES/TOAST/HIDE',
      };

      const expectState = {
        message: '',
        isShow: false,
        variant: 'success',
      };
      expect(actualAction).toEqual([expectAction]);
      expect(actualState).toEqual(expectState);
    });
    test('Message is not change when issuing hide', () => {
      const showedToastOfState = {
        message: '申請しました',
        isShow: true,
        variant: 'success',
      };

      const store = mockStore(showedToastOfState);
      store.dispatch(toastActions.hide());

      const actualAction = store.getActions();
      const actualState = runReducer(actualAction, showedToastOfState);

      const expectAction = {
        type: 'COMMONS/MODULES/TOAST/HIDE',
      };

      const expectState = {
        message: '申請しました',
        isShow: false,
        variant: 'success',
      };
      expect(actualAction).toEqual([expectAction]);
      expect(actualState).toEqual(expectState);
    });
  });
  describe('showToast()', () => {
    test('Put a message and run showToast to hide after showing toast', async () => {
      const store = mockStore(initialState as any);
      await store.dispatch(showToast('申請しました'));

      const actualAction = store.getActions();
      const actualState = runReducer(actualAction, initialState);

      const showAction = {
        payload: { message: '申請しました', variant: 'success' },
        type: 'COMMONS/MODULES/TOAST/SHOW',
      };

      const hideAction = {
        type: 'COMMONS/MODULES/TOAST/HIDE',
      };

      const expectAction = [showAction, hideAction];

      const expectState = {
        message: '申請しました',
        isShow: false,
        variant: 'success',
      };
      expect(actualAction).toEqual(expectAction);
      expect(actualState).toEqual(expectState);
    });
    test('Put a empty message and run showToast to hide after showing toast', async () => {
      const store = mockStore(initialState);
      await store.dispatch(showToast(''));

      const actualAction = store.getActions();
      const actualState = runReducer(actualAction, initialState);

      const showAction = {
        payload: { message: '', variant: 'success' },
        type: 'COMMONS/MODULES/TOAST/SHOW',
      };

      const hideAction = {
        type: 'COMMONS/MODULES/TOAST/HIDE',
      };

      const expectAction = [showAction, hideAction];

      const expectState = {
        message: '',
        isShow: false,
        variant: 'success',
      };
      expect(actualAction).toEqual(expectAction);
      expect(actualState).toEqual(expectState);
    });
    test('Giving a duration does not affect the message', async () => {
      const store = mockStore(initialState);
      await store.dispatch(showToast('申請しました', 1000));

      const actualAction = store.getActions();
      const actualState = runReducer(actualAction, initialState);

      const showAction = {
        payload: { message: '申請しました', variant: 'success' },
        type: 'COMMONS/MODULES/TOAST/SHOW',
      };

      const hideAction = {
        type: 'COMMONS/MODULES/TOAST/HIDE',
      };

      const expectAction = [showAction, hideAction];

      const expectState = {
        message: '申請しました',
        isShow: false,
        variant: 'success',
      };
      expect(actualAction).toEqual(expectAction);
      expect(actualState).toEqual(expectState);
    });
  });
  describe('reset', () => {
    test('Reset state to initialState', () => {
      // Arrange
      const store = mockStore(initialState);

      // Run
      store.dispatch(toastActions.show('申請しました'));
      const nextState = runReducer(store.getActions(), initialState);

      store.dispatch(toastActions.reset());
      const actualAction = store.getActions();
      const actualState = runReducer(actualAction, nextState);

      expect(actualAction).toEqual([
        {
          payload: {
            message: '申請しました',
            variant: 'success',
          },
          type: 'COMMONS/MODULES/TOAST/SHOW',
        },
        {
          type: 'COMMONS/MODULES/TOAST/RESET',
        },
      ]);
      expect(actualState).toEqual({
        message: '',
        isShow: false,
        variant: undefined,
      });
    });
  });
});
