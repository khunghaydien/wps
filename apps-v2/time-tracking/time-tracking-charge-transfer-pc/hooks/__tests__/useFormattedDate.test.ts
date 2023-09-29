import { renderHook } from '@testing-library/react-hooks';

import { useFormattedDate } from '../useFormattedDate';

test('useFormattedDate', () => {
  const { result } = renderHook(() => useFormattedDate(new Date(2020, 12, 31)));

  expect(result.current).toBe('Sun, 01/31/2021');
});
