import { renderHook } from '@testing-library/react-hooks';

import useInterval from '../useInterval';

it('should set interval.', () => {
  // Arrange
  const handler = jest.fn();
  const time = 1000;
  // @ts-ignore
  window.setInterval = jest.fn();
  window.clearInterval = jest.fn();

  // Act
  renderHook(() => useInterval(handler, time));

  // Assert
  expect(window.setInterval).toBeCalledTimes(1);
  expect(window.setInterval).toBeCalledWith(handler, time);
  expect(window.clearInterval).toBeCalledTimes(0);
});

it('should clear interval.', () => {
  // Arrange
  const handler = jest.fn();
  const time = 1000;
  // @ts-ignore
  window.setInterval = jest.fn(() => 'timer');
  window.clearInterval = jest.fn();

  // Act
  const { unmount } = renderHook(() => useInterval(handler, time));
  unmount();

  // Assert
  expect(window.setInterval).toBeCalledTimes(1);
  expect(window.setInterval).toBeCalledWith(handler, time);
  expect(window.clearInterval).toBeCalledTimes(1);
  expect(window.clearInterval).toBeCalledWith('timer');
});
