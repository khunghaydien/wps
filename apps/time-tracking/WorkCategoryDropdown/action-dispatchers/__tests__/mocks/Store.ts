import { AnyAction } from 'redux';
import configureMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';

const initialState = {
  common: {
    empInfo: {
      startDayOfTheWeek: 0,
    },
  },
};

const middlewares = [thunk];
const mockStore = configureMockStore<
  any,
  ThunkDispatch<undefined, undefined, AnyAction>
>(middlewares);

export default {
  mockStore,
  create: (
    state: Record<string, any> = initialState
  ): MockStoreEnhanced<any, ThunkDispatch<undefined, undefined, AnyAction>> => {
    return mockStore(state);
  },
};
