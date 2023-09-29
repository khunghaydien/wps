import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import moment from 'moment';

import { act, cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import DialogProvider from '../../../core/contexts/DialogProvider';

import ActivityDetailFormContainer from '../ActivityDetailFormContainer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('ActivityDetailFormContainer renders without crashing', () => {
  let store;
  const initialState = {
    userSetting: { companyId: '1234' },
    entities: {
      departmentList: [],
      psa: {
        project: {
          project: [],
          pageSize: 1,
        },
        activity: {
          activity: {
            code: '',
            description: '',
            jobCode: '',
            jobId: '',
            leadBaseId: '',
            plannedEndDate: '',
            plannedStartDate: '',
            status: 'NotStarted',
            title: '',
            useExistingJobCode: false,
            progress: [],
          },
          activityList: [],
        },
        setting: {
          useExistingJobCode: false,
        },
      },
    },
    ui: {
      filter: {
        project: {
          projectTitle: '',
          projectCode: '',
          projectManagerCode: '',
          clientName: '',
          jobId: '',
          deptName: '',
          requester: '',
          requesterCode: '',
          projectManager: 'Sista Aadmi',
          projectStartDate: ['', ''],
          projectEndDate: ['2022-02-10', ''],
          statusList: ['Planning', 'InProgress'],
        },
      },
      dialog: {
        activeDialog: ['NEW_ACTIVITY'],
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
    const component = renderer.create(
      <Provider store={store}>
        <DialogProvider>
          <ActivityDetailFormContainer />
        </DialogProvider>
      </Provider>
    );
    expect(component).toMatchSnapshot();
  });

  it('it covers handleSubmit functionality', async () => {
    const component = mount(
      <Provider store={store}>
        <DialogProvider>
          <ActivityDetailFormContainer />
        </DialogProvider>
      </Provider>
    );

    const saveButton = component.find(
      '[data-testid="ts-psa__new-activity-form--save"]'
    );

    const titleContainer = component.find(
      '[data-testid="ts-psa__new-activity-form--title"]'
    );
    const title = titleContainer.children('input');

    const codeContainer = component.find(
      '[data-testid="ts-psa__new-activity-form--code"]'
    );
    const code = codeContainer.find('input');

    const startDateContainer = component.find(
      '[data-testid="ts-psa__new-activity-form--start-date"]'
    );
    const startdate = startDateContainer.find('input');

    const endDateContainer = component.find(
      '[data-testid="ts-psa__new-activity-form--end-date"]'
    );
    const endDate = endDateContainer.find('input');

    await act(async () => {
      const testTitle: any = { target: { value: 'testTitle' } };
      const testCode: any = { target: { value: 'testCode' } };
      const testStartDate: any = {
        target: { value: moment().format('YYYY-MM-DD') },
      };
      const testEndDate: any = {
        target: { value: moment().add(7, 'days').format('YYYY-MM-DD') },
      };

      await title.props().onChange(testTitle);
      await code.props().onChange(testCode);
      await startdate.props().onChange(testStartDate);
      await startdate.props().onBlur(testStartDate);
      await endDate.props().onChange(testEndDate);
      await endDate.props().onBlur(testEndDate);

      await component.update();
      saveButton.first().simulate('click');
    });

    expect(store.dispatch).toHaveBeenCalled();
  });
});
