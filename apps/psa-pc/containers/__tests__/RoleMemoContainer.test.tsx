import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { act, cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import RoleMemoDialog from '@apps/commons/components/psa/Dialog/RoleMemoDialog';

import { MEMO_TYPE } from '@apps/domain/models/psa/Role';

import RoleMemoContainer from '../RoleMemoContainer';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockStore = configureStore([thunk]);

const state = {
  userSetting: {
    companyId: 'test-company',
    employeeName: 'test-employee',
    employeeId: 'test-employee-id',
    photoUrl: 'test-employee-photo-url',
  },
  entities: {
    psa: {
      activity: {
        activity: {
          activityId: '',
        },
      },
      role: {
        role: {
          roleTitle: 'test-role',
          roleId: 'test-role-id',
          assignments: [
            {
              startDate: '2022-02-08',
              endDate: '2022-02-21',
            },
          ],
          memo: {
            visibleForRM: true,
            visibleForManagers: true,
            memoForRM: null,
            memoForManagers: null,
            memoForAll: 'test memo for all',
            id: 'a1nN00000043qmyIAA',
          },
        },
      },
    },
  },
};

describe('RoleMemoContainer Test', () => {
  let store;
  let component;
  beforeEach(() => {
    store = mockStore(state);
    const origDispatch = store.dispatch;
    store.dispatch = jest.fn(origDispatch);
  });

  afterEach(cleanup);

  it('it renders without crashing', () => {
    component = renderer.create(
      <Provider store={store}>
        <RoleMemoContainer memoType={MEMO_TYPE.MANAGERS} />
      </Provider>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('dispatch event when submit', async () => {
    component = mount(
      <Provider store={store}>
        <RoleMemoContainer memoType={MEMO_TYPE.RM} />
      </Provider>
    );
    const dialog = component.find(RoleMemoDialog).props();
    await act(async () => {
      dialog.handleSubmit({ memo: 'test-comments' });
      await delay(100);
      component.update();
    });
    expect(store.dispatch).toHaveBeenCalled();
  });
});
