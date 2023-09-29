import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import FileUploadContainer from '../FileUploadContainer';

const mockStore = configureStore([thunk]);

const initialState = {
  common: {
    app: {
      loadingDepth: 0,
    },
  },
  entities: {
    psa: {
      psaGroup: {
        selectedGroup: {
          code: 'PSAG001',
          companyId: 'a0Y6D000001oEHEUA2',
          groupType: 'PsaGroup',
          id: 'a1l6D000001lgKtQAI',
          isOwned: null,
          name: 'PSA Group 1',
          name_L0: 'PSA Group 1',
          name_L1: 'PSA Group 1',
        },
      },
      project: {
        project: {},
      },
      projectUploadInfo: {
        jobId: '',
        allowUpload: false,
        uploadSuccess: false,
        errorLog: '',
      },
      resource: {
        resourceList: [],
      },
      role: {
        role: {},
      },
      request: {
        pageSize: 1,
      },
    },
  },
  userSetting: { companyId: '' },
  ui: {
    tab: '',
    filter: {
      project: {},
    },
  },
};
describe('FileUploadContainer Test', () => {
  let store;
  let component;
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
