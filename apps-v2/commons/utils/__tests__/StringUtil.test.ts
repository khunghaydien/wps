import StringUtil from '../StringUtil';

describe('convertToHankaku() のテスト', () => {
  describe('時刻を変換するケース', () => {
    test('数字のみが入力されたケース', () => {
      expect(StringUtil.convertToHankaku('１２')).toBe('12');
    });

    test('コロンが入力されたケース', () => {
      expect(StringUtil.convertToHankaku('：')).toBe(':');
    });

    test('数字とコロンが入力されたケース', () => {
      expect(StringUtil.convertToHankaku('１２：００')).toBe('12:00');
    });
  });
});
