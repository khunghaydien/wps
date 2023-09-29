import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { act, cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import RoleCommentDialog from '@apps/commons/components/psa/Dialog/RoleCommentDialog';

import { ROLE_ACTIONS } from '@apps/domain/models/psa/Role';

import RoleCommentContainer from '../RoleCommentContainer';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockStore = configureStore([thunk]);

const state = {
  entities: {
    psa: {
      role: {
        role: {
          roleTitle: 'test-role',
          roleId: 'test-role-id',
        },
      },
      project: {
        pageNum: 1,
        project: {
          projectId: 'test-project',
          projectName: 'test-project-name',
        },
      },
    },
  },
};

describe('RoleCommentContainer Test', () => {
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
        <RoleCommentContainer primaryAction={ROLE_ACTIONS.SUBMIT} />
      </Provider>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('dispatch event to submit comment', async () => {
    component = mount(
      <Provider store={store}>
        <RoleCommentContainer primaryAction={ROLE_ACTIONS.SUBMIT} />
      </Provider>
    );
    const dialog = component.find(RoleCommentDialog).props();
    await act(async () => {
      dialog.handleSubmit({ comments: 'test-comments' });
      await delay(100);
      component.update();
      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  it('dispatch event to recall comment', async () => {
    component = mount(
      <Provider store={store}>
        <RoleCommentContainer primaryAction={ROLE_ACTIONS.RECALL} />
      </Provider>
    );
    const dialog = component.find(RoleCommentDialog).props();
    await act(async () => {
      dialog.handleSubmit({ comments: 'test-comments' });
      await delay(100);
      component.update();
    });
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('call rescheduleResource props for RESCHEDULE type', async () => {
    const mockRescheduleResource = jest.fn();
    component = mount(
      <Provider store={store}>
        <RoleCommentContainer
          primaryAction={ROLE_ACTIONS.RESCHEDULE}
          rescheduleResource={mockRescheduleResource}
        />
      </Provider>
    );

    const dialog = component.find(RoleCommentDialog).props();
    await act(async () => {
      dialog.handleSubmit({ comments: 'test-comments' });
      await delay(100);
      component.update();
    });
    expect(mockRescheduleResource).toHaveBeenCalled();
  });

  it('call onClickSubmit props for NOMINATE type', async () => {
    const mockOnClickSubmit = jest.fn();
    component = mount(
      <Provider store={store}>
        <RoleCommentContainer
          primaryAction={ROLE_ACTIONS.NOMINATE}
          onClickSubmit={mockOnClickSubmit}
        />
      </Provider>
    );

    const dialog = component.find(RoleCommentDialog).props();
    await act(async () => {
      dialog.handleSubmit({ comments: 'test-comments' });
      await delay(100);
      component.update();
    });
    expect(mockOnClickSubmit).toHaveBeenCalled();
  });
});
