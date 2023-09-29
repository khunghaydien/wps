import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const initialState = {
  common: {
    empInfo: {
      startDayOfTheWeek: 0,
    },
  },
};

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

export default {
  mockStore,
  create: (state: Record<string, any> = initialState) => {
    return mockStore(state);
  },
};
