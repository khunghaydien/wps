import TextUtil from '../TextUtil';

describe('static nl2br', () => {
  test('convert 1 new line to spans has br element', () => {
    const test = `This is
test`;
    const converted = TextUtil.nl2br(test);

    // FIXME shallowでrenderするとエラー
    expect(converted[0].props.children[1].type).toBe('br');
  });

  test('when convert 1 new line, last span has no br element', () => {
    const test = `This is
test`;
    const converted = TextUtil.nl2br(test);

    // FIXME shallowでrenderするとエラー
    expect(converted[1].props.children).toBe('test');
  });
});

describe('static template(str, ...variables)', () => {
  describe('正常', () => {
    test('プレースホルダ1種・変数1点', () => {
      const converted = TextUtil.template(
        '未入力日が[%1]日あります。これらは欠勤扱いとなりますが、よろしいですか？',
        8
      );

      expect(converted).toBe(
        '未入力日が8日あります。これらは欠勤扱いとなりますが、よろしいですか？'
      );
    });

    test('プレースホルダ2種・変数2点', () => {
      const converted = TextUtil.template('[%1], [%2]', 'A', 'B');
      expect(converted).toBe('A, B');
    });

    test('プレースホルダ1種・変数2点：2点目の変数は無視される', () => {
      const converted = TextUtil.template(
        '未入力日が[%1]日あります。これらは欠勤扱いとなりますが、よろしいですか？',
        8,
        2
      );

      expect(converted).toBe(
        '未入力日が8日あります。これらは欠勤扱いとなりますが、よろしいですか？'
      );
    });

    test('プレースホルダ1種2箇所・変数1点', () => {
      const converted = TextUtil.template('[%1], [%1]', 8);
      expect(converted).toBe('8, 8');
    });

    test('プレースホルダなし：第1引数の文字列がそのまま返却される', () => {
      const converted = TextUtil.template('プレースホルダ無し', 8);
      expect(converted).toBe('プレースホルダ無し');
    });
  });

  describe('エラー', () => {
    test('引数が1つもない場合、TypeErrorをthrowする', () => {
      expect(() => TextUtil.template()).toThrow(TypeError);
    });

    test('適用する変数の数に不足がある場合、TypeErrorをthrowする', () => {
      expect(() =>
        TextUtil.template(
          '1つ目のプレースホルダ→[%1], 2つ目のプレースホルダ→[%2]',
          '1つ目の変数'
        )
      ).toThrow(TypeError);
    });
  });
});

describe('static parseText(str)', () => {
  describe('正常', () => {
    test('プレースホルダ１種', () => {
      const tokens = TextUtil.parseText(
        '未入力日が[%1]日あります。これらは欠勤扱いとなりますが、よろしいですか？'
      );

      expect(tokens.length).toBe(3);
      expect(tokens[0]).toEqual({ value: '未入力日が' });
      expect(tokens[1]).toEqual({ tag: true, value: 1 });
      expect(tokens[2]).toEqual({
        value: '日あります。これらは欠勤扱いとなりますが、よろしいですか？',
      });
    });

    test('プレースホルダ2種', () => {
      const tokens = TextUtil.parseText('[%1], [%2]');

      expect(tokens.length).toBe(3);
      expect(tokens[0]).toEqual({ tag: true, value: 1 });
      expect(tokens[1]).toEqual({ value: ', ' });
      expect(tokens[2]).toEqual({ tag: true, value: 2 });
    });

    test('プレースホルダのみ', () => {
      const tokens = TextUtil.parseText('[%1]');

      expect(tokens.length).toBe(1);
      expect(tokens[0]).toEqual({ tag: true, value: 1 });
    });

    test('プレースホルダなし', () => {
      const tokens = TextUtil.parseText('プレースホルダ無し');

      expect(tokens.length).toBe(1);
      expect(tokens[0]).toEqual({ value: 'プレースホルダ無し' });
    });
  });
});
