import React from 'react';

import last from 'lodash/last';

import '@testing-library/jest-dom/extend-expect';
import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TimePicker from '../TimePicker';

afterEach(() => {
  jest.restoreAllMocks();
});

document.getSelection = jest.fn();
document.createRange = () => ({
  setStart: (): void => {},
  setEnd: (): void => {},
  // @ts-ignore
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

const selectors = {
  timePicker: 'time-picker',
  input: 'time-picker__input',
  item: (id: string) => `time-picker__listbox-item-${id}`,
};

describe('it should support 30-minute increments from 00:00 to 23:30 by default.', () => {
  test.each`
    index   | value
    ${'0'}  | ${'00:00'}
    ${'1'}  | ${'00:30'}
    ${'2'}  | ${'01:00'}
    ${'3'}  | ${'01:30'}
    ${'4'}  | ${'02:00'}
    ${'5'}  | ${'02:30'}
    ${'6'}  | ${'03:00'}
    ${'7'}  | ${'03:30'}
    ${'8'}  | ${'04:00'}
    ${'9'}  | ${'04:30'}
    ${'10'} | ${'05:00'}
    ${'11'} | ${'05:30'}
    ${'12'} | ${'06:00'}
    ${'13'} | ${'06:30'}
    ${'14'} | ${'07:00'}
    ${'15'} | ${'07:30'}
    ${'16'} | ${'08:00'}
    ${'17'} | ${'08:30'}
    ${'18'} | ${'09:00'}
    ${'19'} | ${'09:30'}
    ${'20'} | ${'10:00'}
    ${'21'} | ${'10:30'}
    ${'22'} | ${'11:00'}
    ${'23'} | ${'11:30'}
    ${'24'} | ${'12:00'}
    ${'25'} | ${'12:30'}
    ${'26'} | ${'13:00'}
    ${'27'} | ${'13:30'}
    ${'28'} | ${'14:00'}
    ${'29'} | ${'14:30'}
    ${'30'} | ${'15:00'}
    ${'31'} | ${'15:30'}
    ${'32'} | ${'16:00'}
    ${'33'} | ${'16:30'}
    ${'34'} | ${'17:00'}
    ${'35'} | ${'17:30'}
    ${'36'} | ${'18:00'}
    ${'37'} | ${'18:30'}
    ${'38'} | ${'19:00'}
    ${'39'} | ${'19:30'}
    ${'40'} | ${'20:00'}
    ${'41'} | ${'20:30'}
    ${'42'} | ${'21:00'}
    ${'43'} | ${'21:30'}
    ${'44'} | ${'22:00'}
    ${'45'} | ${'22:30'}
    ${'46'} | ${'23:00'}
    ${'47'} | ${'23:30'}
  `('it should have $value at $index', ({ index, value }) => {
    // Arrange
    const { getByTestId, getAllByText } = render(
      <TimePicker data-testid={selectors.timePicker} />
    );

    // Act
    fireEvent.click(getByTestId(selectors.timePicker));

    // Assert
    const nodes = getAllByText(/^\d\d:\d\d/);
    expect(nodes[index]).toHaveTextContent(value);
  });
});

test('it should support for setting a lower limit of times', () => {
  // Arrange
  const minMinutes = 660; // minutes == 11:00
  const { getByTestId, getAllByText } = render(
    <TimePicker data-testid={selectors.timePicker} minMinutes={minMinutes} />
  );

  // Act
  fireEvent.click(getByTestId(selectors.timePicker));

  // Assert
  const [node, ..._rest] = getAllByText(/^\d\d:\d\d/);
  expect(node).toHaveTextContent('11:00');
});

test('it should support for setting a upper limit of times', () => {
  // Arrange
  const maxMinutes = 2400; // minutes == 40:00
  const expected = '39:30';
  const { getByTestId, getAllByText } = render(
    <TimePicker data-testid={selectors.timePicker} maxMinutes={maxMinutes} />
  );

  // Act
  fireEvent.click(getByTestId(selectors.timePicker));

  // Assert
  const nodes = getAllByText(/^\d\d:\d\d/);
  expect(last(nodes)).toHaveTextContent(expected);
});

test.each`
  input        | expected
  ${undefined} | ${''}
  ${null}      | ${''}
  ${''}        | ${''}
  ${'00:00'}   | ${'00:00'}
  ${'00:30'}   | ${'00:30'}
  ${'15:40'}   | ${'15:40'}
  ${'23:59'}   | ${'23:59'}
  ${'24:00'}   | ${'Invalid Input'}
  ${'24:01'}   | ${'Invalid Input'}
  ${'24:30'}   | ${'Invalid Input'}
  ${'STRING'}  | ${'Invalid Input'}
`(
  'it should display $expected when $input is given as initial value',
  ({ input, expected }) => {
    // Arrange
    // Act
    const { getByTestId } = render(
      <TimePicker data-testid={selectors.timePicker} value={input} />
    );

    // Assert
    expect(getByTestId(selectors.input)).toHaveValue(expected);
  }
);

test('it should reset original value when a given input exceeds maxValidMinutes', () => {
  // Arrange
  const maxMinutes = 900; // minutes == 15:00
  const invalidValue = '15:01';
  const originalValue = '15:00';
  const { getByTestId } = render(
    <TimePicker
      data-testid={selectors.timePicker}
      value={originalValue}
      maxValidMinutes={maxMinutes}
      onSelect={jest.fn()}
    />
  );

  // Act
  fireEvent.change(getByTestId(selectors.input), {
    target: { value: invalidValue },
  });
  fireEvent.focusOut(getByTestId(selectors.input));

  // Assert
  expect(getByTestId(selectors.input)).toHaveValue(originalValue);
});

test('it should reset original value when a given input is under minValidMinutes', () => {
  // Arrange
  const minMinutes = 330; // minutes == 05:30
  const invalidValue = '05:29';
  const originalValue = '05:31';
  const { getByTestId } = render(
    <TimePicker
      data-testid={selectors.timePicker}
      value={originalValue}
      minValidMinutes={minMinutes}
      onSelect={jest.fn()}
    />
  );

  // Act
  fireEvent.change(getByTestId(selectors.input), {
    target: { value: invalidValue },
  });
  fireEvent.focusOut(getByTestId(selectors.input));

  // Assert
  expect(getByTestId(selectors.input)).toHaveValue(originalValue);
});

test('it should reset original value when a given input is invalid', () => {
  // Arrange
  const invalidValue = 'Invalid Input';
  const originalValue = '15:00';
  const { getByTestId } = render(
    <TimePicker data-testid={selectors.timePicker} value={originalValue} />
  );

  // Act
  fireEvent.change(getByTestId(selectors.input), {
    target: { value: invalidValue },
  });
  fireEvent.focusOut(getByTestId(selectors.input));

  // Assert
  expect(getByTestId(selectors.input)).toHaveValue(originalValue);
});

test.each`
  initialValue | nextValue
  ${'15:00'}   | ${'23:59'}
  ${'23:59'}   | ${'00:00'}
`(
  'it should change $nextValue from $initialValue',
  ({ initialValue, nextValue }) => {
    // Arrange
    const { getByTestId } = render(
      <TimePicker data-testid={selectors.timePicker} value={initialValue} />
    );

    // Act
    fireEvent.click(getByTestId(selectors.timePicker));
    fireEvent.change(getByTestId(selectors.input), {
      target: { value: nextValue },
    });

    // Assert
    expect(getByTestId(selectors.input)).toHaveValue(nextValue);
  }
);

test('it should select a time from menu', async () => {
  // Arrange
  const onSelect = jest.fn();
  const initialValue = '15:00';
  const { getByTestId } = render(
    <TimePicker
      data-testid={selectors.timePicker}
      value={initialValue}
      onSelect={onSelect}
    />
  );

  // Act
  await act(() => userEvent.click(getByTestId(selectors.timePicker)));
  await act(() => userEvent.click(getByTestId(selectors.item('1'))));

  // Assert
  expect(onSelect).toHaveBeenCalledWith('00:30', 30);
});
