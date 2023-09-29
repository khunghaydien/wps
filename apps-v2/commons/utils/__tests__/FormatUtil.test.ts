import FormatUtil from '../FormatUtil';

// NOTE: 桁区切りがつくかどうかや、桁区切り文字・小数点がカンマとピリオドなのかは
// Numeral#locale に依存するが、現在はそれを考慮したテストにはなっていない
// (デフォルトの en で実行した場合のテストになっている)
describe('formatNumber()', () => {
  describe('小数点桁数の指定なし', () => {
    it('桁区切り文字が入るケース', () => {
      expect(FormatUtil.formatNumber(1234)).toBe('1,234');
    });
    it('桁区切り文字が入らないケース', () => {
      expect(FormatUtil.formatNumber(123)).toBe('123');
    });
  });

  describe('小数点桁数の指定あり', () => {
    it('桁区切り文字が入るケース', () => {
      expect(FormatUtil.formatNumber(1234.56, 1)).toBe('1,234.5');
    });
    it('桁区切り文字が入らないケース', () => {
      expect(FormatUtil.formatNumber(123.45, 1)).toBe('123.4');
    });
    it('指定した桁数よりフォーマット対象の小数桁が小さいケース', () => {
      expect(FormatUtil.formatNumber(1234.5, 2)).toBe('1,234.50');
    });
  });
});
