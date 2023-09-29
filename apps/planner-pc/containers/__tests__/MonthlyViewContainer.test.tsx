import React from 'react';
import { Provider } from 'react-redux';

import { parse } from 'date-fns';

import { render, RenderResult } from '@testing-library/react';

import { GET_USER_SETTING } from '../../../commons/actions/userSetting';
import { CoreProvider } from '../../../core';

import MonthlyViewContainer from '../MonthlyViewContainer';
import MonthlyViewPage from './pageObjects/MonthlyViewPage';
import createStore from './store';

const renderComponent = (store = createStore()): RenderResult => {
  return render(
    <Provider store={store}>
      <CoreProvider>
        {/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */}
        <MonthlyViewContainer onClickEvent={() => {}} />
      </CoreProvider>
    </Provider>
  );
};

// FIXME Make it work on CircleCI.
// This test always fails on CircleCI since 'element-scroll-pollyfill' throws
// an error. The error is due to the fact that the document is null
// in document.getElementByTagName call.
// This situation is unlikely, but for some reason,
// the processing of React.render is dispatched first
// before jsdom prepares the document object on only CircleCI.
// It will take time to resolve, so we will skip this test temporary.
test.skip('opens DailySummary on the clicked date', () => {
  // Arrange
  const store = createStore();
  const page = new MonthlyViewPage(() => renderComponent(store));

  // Act
  page.openDailySummary(parse('2019-09-24'));

  // Assert
  expect(page.dailySummary).not.toBeNull();
});

test('do not open DailySummary on the clicked date unless useWorkTime', () => {
  // Arrange
  const store = createStore();
  store.dispatch({
    type: GET_USER_SETTING,
    payload: { ...store.getState().common.userSetting, useWorkTime: false },
  });
  const page = new MonthlyViewPage(() => renderComponent(store));

  // Act
  page.openDailySummary(parse('2019-09-20'));

  // Assert
  expect(page.dailySummary).toBeNull();
});
