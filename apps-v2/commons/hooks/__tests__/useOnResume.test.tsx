import { act, renderHook } from '@testing-library/react-hooks';

import useOnResume from '../useOnResume';

const orgDoc = {
  addEventListener: document.addEventListener.bind(document),
  removeEventListener: document.removeEventListener.bind(document),
};
document.addEventListener = jest.fn(orgDoc.addEventListener);
document.removeEventListener = jest.fn(orgDoc.removeEventListener);

Object.defineProperty(document, 'visibilityState', {
  value: 'hidden',
  writable: true,
});

beforeEach(() => {
  (document.addEventListener as jest.Mock).mock.calls.forEach(
    ([eventName, handler]) => {
      orgDoc.removeEventListener(eventName, handler);
    }
  );
  jest.clearAllMocks();
});

it('should add event.', () => {
  // Arrange
  const handler = jest.fn();

  // Act
  const { result } = renderHook(() => useOnResume(handler));

  // Assert
  expect(document.addEventListener).toBeCalledTimes(1);
  expect(document.addEventListener).toBeCalledWith(
    'visibilitychange',
    result.current.handler,
    false
  );
});

it('should remove event.', () => {
  // Arrange
  const handler = jest.fn();

  // Act
  const { result, unmount } = renderHook(() => useOnResume(handler));
  unmount();

  // Assert
  expect(document.removeEventListener).toBeCalledTimes(1);
  expect(document.removeEventListener).toBeCalledWith(
    'visibilitychange',
    result.current.handler
  );
});

it('should update event.', () => {
  // Arrange
  const handler1 = jest.fn();
  const handler2 = jest.fn();

  // Act
  const { result, rerender } = renderHook((handler) => useOnResume(handler), {
    initialProps: handler1,
  });
  const $handler1 = result.current.handler;
  rerender(handler2);
  const $handler2 = result.current.handler;

  // Assert
  expect(document.addEventListener).toBeCalledTimes(2);
  expect(document.addEventListener).toHaveBeenNthCalledWith(
    1,
    'visibilitychange',
    $handler1,
    false
  );
  expect(document.addEventListener).toHaveBeenNthCalledWith(
    2,
    'visibilitychange',
    $handler2,
    false
  );
  expect(document.removeEventListener).toBeCalledTimes(1);
  expect(document.removeEventListener).toBeCalledWith(
    'visibilitychange',
    $handler1
  );
});

it('should execute handler.', () => {
  // Arrange
  const handler = jest.fn();

  // Act
  renderHook(() => useOnResume(handler));
  // @ts-ignore
  document.visibilityState = 'visible';
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
  });

  // Assert
  expect(handler).toBeCalledTimes(1);
});

it('should not execute handler.', () => {
  // Arrange
  const handler = jest.fn();

  // Act
  renderHook(() => useOnResume(handler));
  // @ts-ignore
  document.visibilityState = 'hidden';
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
  });

  // Assert
  expect(handler).toBeCalledTimes(0);
});

it('should not execute handler when stop', async () => {
  // Arrange
  const handler = jest.fn().mockResolvedValue('result');

  // Act
  const { result } = renderHook(() => useOnResume(handler));
  await act(async () => {
    result.current.stop();
  });
  // @ts-ignore
  document.visibilityState = 'visible';
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
  });

  // Assert
  expect(handler).toBeCalledTimes(0);
});

it.each`
  loading  | times
  ${false} | ${1}
  ${true}  | ${0}
`(
  'should execute with optional parameter [$loading]',
  async ({ loading, times }) => {
    // Arrange
    const handler = jest.fn().mockResolvedValue('result');

    // Act
    renderHook(() => useOnResume(handler, loading));
    // @ts-ignore
    document.visibilityState = 'visible';
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    // Assert
    expect(handler).toBeCalledTimes(times);
  }
);
