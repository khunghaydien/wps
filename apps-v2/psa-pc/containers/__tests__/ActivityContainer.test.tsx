import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ApiMock from '../../../../__tests__/mocks/ApiMock';
import ActivityContainer from '../ActivityContainer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('ActivityContainer renders without crashing', () => {
  let store;
  let component;

  const initialState = {
    common: {
      app: {
        loadingDepth: 0,
      },
    },
    userSetting: {
      currencyDecimalPlaces: 2,
      currencySymbol: '',
    },
    entities: {
      psa: {
        project: {
          pageNum: 1,
          project: {
            name: '',
          },
        },
        role: {
          role: {
            roleId: '',
          },
        },
        resource: {
          resourceList: [],
        },
        activity: {
          activityList: [],
        },
        setting: {
          enableProgressCheck: false,
        },
        projectFinance: {
          labourFinanceType: '',
        },
      },
    },
    ui: {
      dialog: {
        activeDialog: [],
      },
      isLoading: false,
      filter: {},
    },
  };
  beforeEach(async () => {
    ApiMock.invoke.mockResolvedValue({});
    store = mockStore(initialState);
    await renderer.act(() => {
      component = renderer.create(
        <Provider store={store}>
          <ActivityContainer />
        </Provider>
      );
    });
  });
  it('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
