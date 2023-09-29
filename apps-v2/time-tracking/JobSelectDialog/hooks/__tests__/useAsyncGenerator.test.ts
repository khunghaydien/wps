import { act, renderHook } from '@testing-library/react-hooks';

import useAsyncGenerator from '../useAsyncGenerator';

jest.useFakeTimers();

// NOTE
// The following test does not work because useEffect and setTimeout with
// Promise raise dead-lock.
// Reported at https://github.com/testing-library/react-hooks-testing-library/issues/241
it.skip('should add evaluated elements to state', async () => {
  // Arrange
  const source = (async function* () {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
  })();
  const { result, waitForValueToChange } = renderHook(() =>
    useAsyncGenerator(source)
  );

  // Act
  act(() => {
    jest.runAllTimers();
  });
  await waitForValueToChange(() => result.current[0]);

  // Assert
  const [actual, _] = result.current;
  expect(actual).toStrictEqual([1, 2, 3, 4]);
});
