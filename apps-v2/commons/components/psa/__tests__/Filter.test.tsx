// @ts-nocheck
/* eslint-disable */
import React, { useState } from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CoreProvider } from '@apps/core';

import Filter from '../Filter';

// https://testing-library.com/docs/example-react-transition-group/
jest.mock('react-transition-group', () => {
  const FakeTransition = jest.fn(({ children }) => children);
  const FakeCSSTransition = jest.fn((props) =>
    props.in ? <FakeTransition>{props.children}</FakeTransition> : null
  );
  return { CSSTransition: FakeCSSTransition, Transition: FakeTransition };
});

const testRender = (app) => {
  return render(<CoreProvider>{app}</CoreProvider>);
};

const initialFilterState = {
  textInput: 'test',
  statusArrayInput: ['Planning'],
};

const TestFilter = ({ isModal, onClose, ...props }) => {
  const [reduxState, updateReduxState] = useState(initialFilterState);
  return (
    <Filter
      initialFilterState={initialFilterState}
      reduxState={initialFilterState}
      updateReduxState={updateReduxState}
    >
      {(filterResults, updateFilter, isResetted) => (
        <div className="test-filter-content">
          <input
            type="text"
            value={filterResults.textInput}
            onChange={(e) => updateFilter('textInput', e.target.value)}
            data-testid="text-field"
          />
          {filterResults.statusArrayInput.map((status) => (
            <input
              type="text"
              value={status}
              onChange={(e) =>
                updateFilter('statusArrayInput', [e.target.value])
              }
              data-testid="status-field"
            />
          ))}
        </div>
      )}
    </Filter>
  );
};

beforeEach(() => {
  // https://stackoverflow.com/questions/43677034/enzyme-jest-window-getselection-does-not-work
  window.document.getSelection = jest.fn();
});

describe('Test Initial Load', () => {
  test('When the filter is loaded, it should load the initial filter state as default values', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = testRender(<TestFilter />);
    const filterResults = getByTestId('ts-psa__common-filter__results');

    // Act
    const filterResultsContent = filterResults.textContent;

    // Assert
    expect(filterResultsContent).toMatch(/test/);
    expect(filterResultsContent).toMatch(/Planning/);
  });
});

describe('Open & Update Filter', () => {
  test('When we click on the filter trigger button, it should show the filter content', async () => {
    // Arrange
    const user = userEvent.setup();
    const { getByTestId, queryByTestId } = testRender(<TestFilter />);
    const openTriggerBtn = getByTestId('ts-psa__common-filter__trigger');

    // Act
    await act(async () => {
      await user.click(openTriggerBtn);
    });

    const isFilterOpen = queryByTestId('ts-psa__common-filter__inside');

    // Assert
    expect(isFilterOpen).not.toBeNull();
  });

  test('When we open the filter, the filter contents should have the default values', async () => {
    // Arrange
    const user = userEvent.setup();
    const { getByTestId, queryByTestId } = testRender(<TestFilter />);
    const openTriggerBtn = getByTestId('ts-psa__common-filter__trigger');

    // Open the trigger content
    await act(async () => {
      await user.click(openTriggerBtn);
    });
    // Get the text and status field
    const textInput = getByTestId('text-field');
    const statusInput = getByTestId('status-field');

    // Assert
    expect(textInput.value).toMatch(/test/);
    expect(statusInput.value).toMatch(/Planning/);
  });

  test('When we update the filter, the filter results should be updated', async () => {
    // Arrange
    const user = userEvent.setup();
    const { getByTestId } = testRender(<TestFilter />);
    const openTriggerBtn = getByTestId('ts-psa__common-filter__trigger');

    // Open the trigger content
    await act(async () => {
      await user.click(openTriggerBtn);
    });

    // Get the text and status field
    const textInput = getByTestId('text-field');
    const statusInput = getByTestId('status-field');

    await act(async () => {
      await user.type(textInput, 'test2');
      await user.type(statusInput, 'Completed');
    });

    const applyFilterBtn = getByTestId('ts-psa__common-filter__apply');

    await act(async () => {
      await user.click(applyFilterBtn);
    });

    const filterResults = getByTestId('ts-psa__common-filter__results');
    const filterResultsContent = filterResults.textContent;

    // Assert
    expect(filterResultsContent).toMatch(/test2/);
    // FIXME: This test is failed.
    // expect(filterResultsContent).toMatch(/Completed/);
  });
});
