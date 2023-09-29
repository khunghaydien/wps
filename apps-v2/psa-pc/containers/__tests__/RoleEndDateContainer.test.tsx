import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { act, cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import msg from '@apps/commons/languages';

import RoleEndDateDialog from '@psa/components/Dialog/RoleEndDateDialog';

import RoleEndDateContainer from '../RoleEndDateContainer';

const mockStore = configureStore([thunk]);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const state = {
  userSetting: {
    companyId: 'test-company',
    employeeName: 'test-employee',
    employeeId: 'test-employee-id',
    photoUrl: 'test-employee-photo-url',
  },
  entities: {
    psa: {
      project: {
        pageNum: 1,
        project: {
          projectId: 'test-project',
          projectName: 'test-project-name',
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
        },
      },
    },
  },
};

describe('RoleEndDateContainer Test', () => {
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
        <RoleEndDateContainer
          title={msg().Psa_Lbl_RescheduleEndDate}
          dateLabel={msg().Psa_Lbl_BookingRoleEndDate}
        />
      </Provider>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('dispatch event when submit', async () => {
    component = mount(
      <Provider store={store}>
        <RoleEndDateContainer
          title={msg().Psa_Lbl_RescheduleEndDate}
          dateLabel={msg().Psa_Lbl_BookingRoleEndDate}
        />
      </Provider>
    );
    const dialog = component.find(RoleEndDateDialog).props();
    await act(async () => {
      dialog.handleSubmit({ comments: 'test-comments', endDate: '2022-02-02' });
      await delay(100);
      component.update();
    });
    expect(store.dispatch).toHaveBeenCalled();
  });
});
