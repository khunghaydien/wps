import { act, renderHook } from '@testing-library/react-hooks';

import { useSort } from '../useSort';

describe('useSort', () => {
  it('should change sortKey', () => {
    const { result } = renderHook(() => useSort());

    act(() => {
      result.current.sort('jobCode');
    });

    expect(result.current.sortKey).toBe('jobCode');
  });

  it('should toggle order', async () => {
    const { result } = renderHook(() => useSort());

    act(() => {
      result.current.sort('jobCode');
    });

    act(() => {
      result.current.sort('jobCode');
    });

    expect(result.current.order).toBe('asc');
  });

  it('should unsort', async () => {
    const { result } = renderHook(() => useSort());

    act(() => {
      result.current.sort('jobCode');
      result.current.unsort();
    });

    expect(result.current.sortKey).toBeNull();
  });
});
