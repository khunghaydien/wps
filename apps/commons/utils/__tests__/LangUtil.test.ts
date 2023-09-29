import LangUtil from '../LangUtil';

describe('convertSfLang()', () => {
  it('英語かつアメリカのSFコードが適切なlangコードに変換されること', () => {
    expect(LangUtil.convertSfLang('en_US')).toBe('en-US');
  });

  describe('正しいlangコードはそのままであること', () => {
    it('コードのみ', () => {
      expect(LangUtil.convertSfLang('ja')).toBe('ja');
    });

    it('サブコード含む', () => {
      expect(LangUtil.convertSfLang('ja-JP')).toBe('ja-JP');
    });
  });
});
