import moment from 'moment';

import { renderHook } from '@testing-library/react-hooks';

import { useCallbackWithMoment } from '../hooks';

describe('useCallbackWithMoment', () => {
  it('should convert callback with date argument to callback with moment argument', () => {
    // Arrange
    const callback = jest.fn();

    // Act
    const { result } = renderHook(() => useCallbackWithMoment(callback));
    result.current(moment('2020-04-21T15:00:00.000Z'));

    // Assert
    const arg = callback.mock.calls[0][0];
    expect(arg instanceof Date).toBe(true);
  });

  it('should return callback receiving a valid date object', () => {
    // Arrange
    const callback = jest.fn();

    // Act
    const { result } = renderHook(() => useCallbackWithMoment(callback));
    result.current(moment('2020-04-22')); // UTC

    // Assert
    const arg = callback.mock.calls[0][0];
    expect(arg.toISOString()).toBe('2020-04-21T15:00:00.000Z'); // JST
  });

  it('should return callback receiving null for an invalid date', () => {
    // Arrange
    const callback = jest.fn();

    // Act
    const { result } = renderHook(() => useCallbackWithMoment(callback));
    result.current(moment.invalid());

    // Assert
    const arg = callback.mock.calls[0][0];
    expect(arg).toBeNull();
  });
});
