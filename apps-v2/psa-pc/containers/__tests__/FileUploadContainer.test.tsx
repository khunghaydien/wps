import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import FileUploadContainer from '../FileUploadContainer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('FileUploadContainer renders without crashing', () => {
  let store;
  let component;

  const initialState = {
    common: {
      app: {
        laodingDetpth: 0,
      },
    },
    entities: {
      psa: {
        projectUploadInfo: {
          uploadSuccess: '',
          allowUpload: '',
          errorLog: '',
        },
        project: {
          project: {},
        },
        resource: {
          resourceList: [],
        },
        role: {
          role: {},
        },
        projectFinance: {
          labourFinanceType: '',
        },
      },
    },
    userSetting: {
      companyId: '',
    },
    ui: {
      tab: '',
      filter: {},
    },
  };
  beforeEach(() => {
    store = mockStore(initialState);
    component = renderer.create(
      <Provider store={store}>
        <FileUploadContainer />
      </Provider>
    );
  });
  it('it renders without crashing', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
