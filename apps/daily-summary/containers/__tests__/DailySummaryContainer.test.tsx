/*  eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { Provider } from 'react-redux';

import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';

import { CoreProvider } from '../../../core';

import DailySummaryContainer from '../DailySummaryDialogContainer';
import createStore from './store';

it('should open EventListPopup on click', async () => {
  // Arrange
  window.HTMLElement.prototype.scroll = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.HTMLElement.prototype.scrollBy = () => {};
  window.HTMLElement.prototype.getBoundingClientRect = () =>
    ({
      bottom: 300,
      left: 300,
    } as DOMRect);

  const testId = 'open-event-list-popup';
  const store = createStore();
  const { getByTestId, queryByTestId } = render(
    <Provider store={store as any}>
      <CoreProvider>
        <div className="ts-container" />
        <DailySummaryContainer onClose={() => {}} />
      </CoreProvider>
    </Provider>
  );

  // Act
  const target = getByTestId(testId);
  fireEvent.click(target);

  // Assert
  const dialog = queryByTestId('daily-summary__event-list-popup');
  expect(dialog).not.toBeNull();
});
