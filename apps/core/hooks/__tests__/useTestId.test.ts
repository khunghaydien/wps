import { renderHook } from '@testing-library/react-hooks';

import { useTestId } from '../index';

it('should get a test id in props', () => {
  // Arrange
  const props = {
    'data-testid': 'test',
  };

  // Act
  const { result } = renderHook(() => useTestId(props));

  expect(result.current).toEqual('test');
});

it('should make a test id from props', () => {
  // Arrange
  const props = {
    'data-testid': 'test',
  };

  // Act
  const { result } = renderHook(() =>
    useTestId(props, (testId) => `${testId}__suffix`)
  );

  expect(result.current).toEqual('test__suffix');
});
