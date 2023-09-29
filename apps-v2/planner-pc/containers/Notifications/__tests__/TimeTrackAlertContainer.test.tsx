import React from 'react';
import { Provider } from 'react-redux';

import { parse } from 'date-fns';

import { render, RenderResult } from '@testing-library/react';

import {
  AlertCode,
  AlertLevel,
} from '../../../../domain/models/time-tracking/Alert';
import defaultPermission from '@apps/domain/models/access-control/Permission';

import App from '../../../action-dispatchers/App';

import {
  plannerEventGet,
  userSettingGet,
} from '../../__tests__/mock/Responses';
import createStore from '../../__tests__/store';
import ApiMock from '../../../../../__tests__/mocks/ApiMock';
import TimeTrackAlertContainer from '../TimeTrackAlertContainer';
import TimeTrackAlertPage from './pageObjects/TimeTrackAlertPage';

const renderComponent = (
  props: { date: Date },
  store = createStore()
): RenderResult => {
  return render(
    <Provider store={store}>
      <TimeTrackAlertContainer {...props} />
    </Provider>
  );
};

afterEach(() => {
  ApiMock.reset();
});

test('displays alert in the date if there are alerts', async () => {
  // Arrange
  const targetDate = '2019-10-02';
  ApiMock.mockReturnValue({
    '/time-track/alert/list': {
      records: [
        {
          targetDate,
          alerts: [
            {
              level: AlertLevel.Warn,
              code: AlertCode.TimeAttConsistency,
            },
          ],
        },
      ],
    },
    '/planner/event/get': plannerEventGet,
    '/user-setting/get': userSettingGet,
    '/personal-setting/get': {
      searchConditionList: [],
      plannerDefaultView: 'Weekly',
    },
  });

  const store = createStore();
  const app = App(store.dispatch);
  await app.initialize({ userPermission: defaultPermission, targetDate });

  // Act
  const page = new TimeTrackAlertPage(() =>
    renderComponent({ date: parse(targetDate) }, store)
  );

  // Assert
  // expect(store.getState().entities.timeTrackAlert).toBeNull();
  expect(page.icon).not.toBeNull();
});

test('displays no alert in the date if there are alerts', async () => {
  // Arrange
  ApiMock.mockReturnValue({
    '/time-track/alert/list': [],
    '/planner/event/get': plannerEventGet,
    '/user-setting/get': userSettingGet,
    '/personal-setting/get': {
      searchConditionList: [],
      plannerDefaultView: 'Weekly',
    },
  });

  const store = createStore();
  const app = App(store.dispatch);
  await app.initialize({
    userPermission: defaultPermission,
    targetDate: '2020-10-15',
  });

  const targetDate = parse('2019-10-10');

  // Act
  const page = new TimeTrackAlertPage(() =>
    renderComponent({ date: targetDate }, store)
  );

  // Assert
  expect(page.icon).toBeNull();
});
