import { renderHook } from '@testing-library/react-hooks';

import { useId } from '../index';

it('should generate id as string value', () => {
  const { result } = renderHook(() => useId());

  expect(typeof result.current).toEqual('string');
});

it('should generate id of 8 characters in length', () => {
  const { result } = renderHook(() => useId());

  expect(result.current.length).toEqual(8);
});

it('should generate unique id', () => {
  const { result: result1 } = renderHook(() => useId());
  const { result: result2 } = renderHook(() => useId());

  expect(result1.current).not.toEqual(result2.current);
});
