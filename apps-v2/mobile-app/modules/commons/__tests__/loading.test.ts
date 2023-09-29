import { AnyAction } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';

import reducer, { endLoading, startLoading, withLoading } from '../loading';

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

describe('loading', () => {
  const initialState = {};

  describe('startLoading()', () => {
    test('should return unique id', () => {
      const id1 = startLoading();
      const id2 = startLoading();

      expect(id1).not.toEqual(id2);
    });

    test('should register a returned id to state', () => {
      const store = mockStore(initialState);

      const id = store.dispatch(startLoading());
      const actions = store.getActions();
      const state = runReducer(actions, initialState);

      expect(state[id]).not.toBeNull();
      expect(state[id]).not.toBeUndefined();
    });

    test('should register unique id for loading to state', () => {
      const store = mockStore(initialState);
      const callReducer = (action, state) => {
        store.dispatch(startLoading());
        const actions = store.getActions();

        return runReducer(actions, state);
      };

      const state1 = callReducer(startLoading(), initialState);
      const state2 = callReducer(startLoading(), state1);

      const ids = Object.keys(state2);
      expect(ids.length).toEqual(2);
      expect(ids[0]).not.toEqual(ids[1]);
    });
  });

  describe('endLoading()', () => {
    test('should deregister unique id in state for stoping loading', () => {
      const store = mockStore(initialState);
      const callReducer = (state) => {
        const actions = store.getActions();
        return runReducer(actions, state);
      };

      const id = store.dispatch(startLoading());
      const state1 = callReducer(initialState);

      store.dispatch(endLoading(id));
      const state2 = callReducer(state1);

      expect(state2[id]).toBeUndefined();
    });
  });

  describe('withLoading()', () => {
    const thunkAction = (type, value) => (dispatch) => {
      dispatch({ type });
      return Promise.resolve(value);
    };
    const actionA = thunkAction('actionA', 'A');
    const actionB = thunkAction('actionB', 100);
    const actionC = thunkAction('actionC', 'C');
    const actionD = (dispatch): Promise<any> => {
      dispatch({ type: 'actionD' });
      return Promise.reject(new Error());
    };

    describe('case that all actions are succeeded', () => {
      test('should dipatch actions', async () => {
        const store = mockStore(initialState);

        await store.dispatch(withLoading(actionA, actionB, actionC));

        const [sl, a, b, c, el] = store.getActions();

        expect(sl.type).toEqual('START_LOADING');
        expect(a.type).toEqual('actionA');
        expect(b.type).toEqual('actionB');
        expect(c.type).toEqual('actionC');
        expect(el.type).toEqual('END_LOADING');
      });
    });

    describe('case that one of actions is failed', () => {
      test('should dipatch actions', async () => {
        const store = mockStore(initialState);

        try {
          await store.dispatch(withLoading(actionA, actionB, actionC, actionD));
        } catch (e) {}

        const [sl, a, b, c, d, el] = store.getActions();

        expect(sl.type).toEqual('START_LOADING');
        expect(a.type).toEqual('actionA');
        expect(b.type).toEqual('actionB');
        expect(c.type).toEqual('actionC');
        expect(d.type).toEqual('actionD');
        expect(el.type).toEqual('END_LOADING');
      });
    });
  });
});
