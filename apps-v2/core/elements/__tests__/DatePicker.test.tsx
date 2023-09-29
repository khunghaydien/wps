import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { cleanup, fireEvent, render } from '@testing-library/react';

import DatePicker from '../DatePicker';

afterEach(cleanup);

document.createRange = () => ({
  setStart: (): void => {},
  setEnd: (): void => {},
  // @ts-ignore
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

describe('DatePicker', () => {
  const props = {
    value: '2020-03-19',
    onChange: jest.fn(),
    onBlur: jest.fn(),
    onChangeRaw: jest.fn(),
    selected: new Date(2020, 3, 19),
    maxDate: new Date(2100, 12, 31),
    minDate: new Date(2000, 1, 1),
  };

  beforeEach(() => {
    props.onChange.mockClear();
    props.onBlur.mockClear();
    props.onChangeRaw.mockClear();
  });

  it('should be no error when displaying the calendar', () => {
    // Arrange
    const { getByDisplayValue } = render(<DatePicker {...props} />);
    // Act
    // Assert
    expect(() => {
      fireEvent.click(getByDisplayValue('2020-03-19'));
    }).not.toThrow();
  });
  it('should not result in an error when selecting a year', () => {
    // Arrange
    const { getByDisplayValue, getByText } = render(<DatePicker {...props} />);
    // Act
    fireEvent.click(getByDisplayValue('2020-03-19'));
    // Assert
    expect(() => {
      fireEvent.click(getByText('2020'));
      fireEvent.click(getByText('2023'));
    }).not.toThrow();
  });
  it('should not result in an error when selecting a day', () => {
    // Arrange
    const { getByDisplayValue, getAllByText } = render(
      <DatePicker {...props} />
    );
    // Act
    fireEvent.click(getByDisplayValue('2020-03-19'));
    // Assert
    expect(() => {
      fireEvent.click(getAllByText('29')[0]);
    }).not.toThrow();
  });
  it('should call onChange handler with a valid date object', () => {
    // Arrange
    const { getByDisplayValue, getAllByText } = render(
      <DatePicker
        selected={props.selected}
        value={props.value}
        onChange={props.onChange}
      />
    );

    // Act
    fireEvent.click(getByDisplayValue('2020-03-19'));
    fireEvent.click(getAllByText('29')[0]);

    // Assert
    const arg = props.onChange.mock.calls[0][0];
    expect(arg.toISOString()).toBe('2020-03-28T15:00:00.000Z');
  });
});
