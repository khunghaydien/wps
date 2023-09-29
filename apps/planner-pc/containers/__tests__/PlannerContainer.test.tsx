import React from 'react';
import { Provider } from 'react-redux';

import { isNil } from 'lodash';

import { act, render, RenderResult } from '@testing-library/react';

import { GET_USER_SETTING } from '../../../commons/actions/userSetting';
import GlobalContainer from '../../../commons/containers/GlobalContainer';
import { CoreProvider } from '../../../core';

import defaultPermission from '@apps/domain/models/access-control/Permission';

import App from '../../action-dispatchers/App';
import { switchCalendarMode } from '../../actions/events';

import ApiMock from '../../../../__tests__/mocks/ApiMock';
import PlannerContainer from '../PlannerContainer';
import { plannerEventGet, userSettingGet } from './mock/Responses';
import PlannerPage from './pageObjects/PlannerPage';
import createStore from './store';

const renderComponent = (store = createStore()): RenderResult => {
  return render(
    <Provider store={store}>
      <CoreProvider>
        <GlobalContainer>
          <PlannerContainer />
        </GlobalContainer>
      </CoreProvider>
    </Provider>
  );
};

beforeEach(() => {
  ApiMock.mockReturnValue({
    '/time-track/alert/list': [],
    '/planner/event/get': plannerEventGet,
    '/user-setting/get': userSettingGet,
    '/personal-setting/get': {
      searchConditionList: [],
      plannerDefaultView: 'Weekly',
    },
    '/time-track/request-alert/get': {
      request: {
        id: 'id',
        alert: false,
        startDate: null,
        endDate: null,
      },
    },
  });
});
afterEach(() => {
  ApiMock.reset();
});

test('renders TrackSummary only if useWorkTime is true', async () => {
  // Arrange
  const store = createStore();
  const app = App(store.dispatch);
  await app.initialize({
    userPermission: defaultPermission,
    targetDate: '2020-01-15',
  });

  // Act
  const page = new PlannerPage(() => renderComponent(store));

  // Assert
  expect(page.trackSummary).not.toBeNull();

  // Act
  await act(() =>
    store.dispatch({
      type: GET_USER_SETTING,
      payload: {
        ...(store.getState().common as any).userSetting,
        useWorkTime: false,
      },
    })
  );

  // Assert
  expect(page.trackSummary).toBeNull();
});

test.each`
  mode       | monthly  | weekly
  ${'week'}  | ${false} | ${true}
  ${'month'} | ${true}  | ${false}
`('renders $mode calendar', async ({ mode, monthly, weekly }) => {
  // Arrange
  const store = createStore();
  const app = App(store.dispatch);
  await app.initialize({
    userPermission: defaultPermission,
    targetDate: '2020-01-15',
  });

  // Act
  let page;
  await act(() => {
    page = new PlannerPage(() => renderComponent(store));
  });
  await act(() => store.dispatch(switchCalendarMode(mode)));

  // Assert
  expect({
    monthly: !isNil(page.monthlyCalendar),
    weekly: !isNil(page.weeklyCalendar),
  }).toStrictEqual({ monthly, weekly });
});

test('renders week calendar by default', async () => {
  // Arrange
  const store = createStore();
  const app = App(store.dispatch);
  await app.initialize({
    userPermission: defaultPermission,
    targetDate: '2020-01-15',
  });

  // Act
  const page = new PlannerPage(() => renderComponent(store));

  // Assert
  expect({
    monthly: !isNil(page.monthlyCalendar),
    weekly: !isNil(page.weeklyCalendar),
  }).toStrictEqual({ monthly: false, weekly: true });
});
