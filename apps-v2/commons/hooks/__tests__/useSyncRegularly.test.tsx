import { act, renderHook } from '@testing-library/react-hooks';

import useInterval from '../useInterval';
import useOnResume from '../useOnResume';
import useSyncRegularly from '../useSyncRegularly';

jest.mock('../useInterval');
jest.mock('../useOnResume');

beforeEach(() => {
  jest.clearAllMocks();
});
it('should mount', () => {
  // Arrange
  const handler = jest.fn();
  const time = 1000;

  // Act
  const { result } = renderHook(() => useSyncRegularly(handler, time));

  // Assert
  expect(useOnResume).toBeCalledTimes(1);
  expect(useOnResume).toBeCalledWith(result.current.handler);
  expect(useInterval).toBeCalledTimes(1);
  expect(useInterval).toBeCalledWith(result.current.handler, time);
});

it('should execute handler', async () => {
  // Arrange
  const handler = jest.fn().mockResolvedValue('result');
  const time = 1000;

  // Act
  const { result } = renderHook(() => useSyncRegularly(handler, time));
  await act(result.current.handler);

  // Assert
  expect(handler).toBeCalledTimes(1);
});

it('should not execute handler', async () => {
  // Arrange
  const handler = jest.fn().mockResolvedValue('result');
  const time = 1000;

  // Act
  const { result } = renderHook(() => useSyncRegularly(handler, time));
  await act(async () => {
    await result.current.handler();
    result.current.stop();
    await result.current.handler();
  });

  // Assert
  expect(handler).toBeCalledTimes(1);
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
    const time = 1000;

    // Act
    const { result } = renderHook(() =>
      useSyncRegularly(handler, time, loading)
    );
    await act(result.current.handler);

    // Assert
    expect(handler).toBeCalledTimes(times);
  }
);
