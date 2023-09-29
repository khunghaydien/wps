import { renderHook } from '@testing-library/react-hooks';

import { useLocale, useTickTimer } from '../stampClock';

describe('stampClock hooks', () => {
  describe('useTickTimer', () => {
    it('should currentTime the current time', () => {
      const expectTime = new Date();
      const { result } = renderHook(() => useTickTimer(), {
        initialProps: { currentTime: expectTime, locale: 'ja' },
      });
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: '2-digit',
        day: '2-digit',
      };
      expect(result.current.toLocaleDateString('ja', options)).toBe(
        expectTime.toLocaleDateString('ja', options)
      );
      expect(result.current.getHours()).toBe(expectTime.getHours());
      expect(result.current.getMinutes()).toBe(expectTime.getMinutes());
    });
  });
  describe('useLocale', () => {
    it('should locale null from ja', () => {
      const expectTime = new Date();
      const { result } = renderHook(() => useLocale(), {
        initialProps: { currentTime: expectTime, locale: 'ja' },
      });
      expect(result.current).toBe(null);
    });
    it('should locale ja from null', () => {
      const expectTime = new Date();
      window.empInfo.language = 'ja';
      const { result } = renderHook(() => useLocale(), {
        initialProps: { currentTime: expectTime, locale: 'null' },
      });
      expect(result.current).toBe('ja');
    });
    it('should locale en_US from null', () => {
      const expectTime = new Date();
      window.empInfo.language = 'en_US';
      const { result } = renderHook(() => useLocale(), {
        initialProps: { currentTime: expectTime, locale: 'null' },
      });
      expect(result.current).toBe('en_US');
    });
  });
});
