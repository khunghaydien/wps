import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import DeleteProjectDialogContainer from '../DeleteProjectDialogContainer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('DeleteProjectDialogContainer renders without crashing', () => {
  let store;
  let component;

  const initialState = {
    common: {
      userSetting: {
        organizationSetting: {
          language0: '',
          language1: '',
          language2: '',
        },
      },
    },
    entities: {
      departmentList: [],
      psa: {
        project: {
          project: [],
          pageSize: 1,
        },
        projectFinance: {
          financeDetails: '',
        },
      },
    },
    ui: {
      filter: {
        project: {},
      },
      dialog: {
        activeDialog: {},
      },
    },
  };
  beforeEach(() => {
    store = mockStore(initialState);
    const origDispatch = store.dispatch;
    store.dispatch = jest.fn(origDispatch);
  });

  afterEach(cleanup);

  it('it renders without crashing', () => {
    component = renderer.create(
      <Provider store={store}>
        <DeleteProjectDialogContainer />
      </Provider>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('simulates onClickOk', () => {
    component = mount(
      <Provider store={store}>
        <DeleteProjectDialogContainer />
      </Provider>
    );
    component
      .find('#commons-dialogs-confirm-dialog__ok-button')
      .first()
      .simulate('click');
    expect(store.dispatch).toHaveBeenCalled();
  });
  it('simulates onClickCancel', () => {
    component = mount(
      <Provider store={store}>
        <DeleteProjectDialogContainer />
      </Provider>
    );
    component
      .find('#commons-dialogs-confirm-dialog__cancel-button')
      .first()
      .simulate('click');
    expect(store.dispatch).toHaveBeenCalled();
  });
});
