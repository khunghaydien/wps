import * as NumberUtil from '../NumberUtil';

describe('parseNumberOrStringNull', () => {
  it('文字列の「null」を渡した場合は「null」を返す', () => {
    expect(NumberUtil.parseNumberOrNull('')).toBe(null);
  });
  it('「null」を渡した場合は「null」を返す', () => {
    expect(NumberUtil.parseNumberOrNull(null)).toBe(null);
  });
  it('「false」を渡した場合は「null」を返す', () => {
    // @ts-ignore
    expect(NumberUtil.parseNumberOrNull(false)).toBe(null);
  });
  it('文字列の「a」を渡した場合は「null」を返す', () => {
    expect(NumberUtil.parseNumberOrNull('a')).toBe(null);
  });
  it('文字列の「0」を渡した場合は数値の「0」を返す', () => {
    expect(NumberUtil.parseNumberOrNull('0')).toBe(0);
  });
  it('文字列の「123」を渡した場合は数値の「123」を返す', () => {
    expect(NumberUtil.parseNumberOrNull('123')).toBe(123);
  });
  it('文字列の「1.5」を渡した場合は数値の「1.5」を返す', () => {
    expect(NumberUtil.parseNumberOrNull('1.5')).toBe(1.5);
  });
  it('数値「123」を渡した場合は数値の「123」を返す', () => {
    expect(NumberUtil.parseNumberOrNull(123)).toBe(123);
  });
  it('数値「1.5」を渡した場合は数値の「1.5」を返す', () => {
    expect(NumberUtil.parseNumberOrNull(1.5)).toBe(1.5);
  });
});

describe('parseIntOrNull', () => {
  it('文字列の「null」を渡した場合は「null」を返す', () => {
    expect(NumberUtil.parseIntOrNull('')).toBe(null);
  });
  it('文字列の「1.4」を渡した場合は数値の「1」を返す', () => {
    expect(NumberUtil.parseIntOrNull('1.4')).toBe(1);
  });
  it('文字列の「1.5」を渡した場合は数値の「1」を返す', () => {
    expect(NumberUtil.parseIntOrNull('1.5')).toBe(1);
  });
  it('文字列の「10」を 8 進数に変換した場合は数値の「8」を返す', () => {
    expect(NumberUtil.parseIntOrNull('10', 8)).toBe(8);
  });
  it('文字列の「10」を 16 進数に変換した場合は数値の「16」を返す', () => {
    expect(NumberUtil.parseIntOrNull('10', 16)).toBe(16);
  });
  it('文字列の「FF」を 16 進数に変換した場合は数値の「255」を返す', () => {
    expect(NumberUtil.parseIntOrNull('FF', 16)).toBe(255);
  });
});

describe('parseNumberOrStringStringNull', () => {
  it("文字列の「''」を渡した場合は文字列の「''」を返す", () => {
    expect(NumberUtil.parseNumberOrStringNull('')).toBe('');
  });
  it("「null」を渡した場合は文字列の「''」を返す", () => {
    expect(NumberUtil.parseNumberOrStringNull(null)).toBe('');
  });
  it("「false」を渡した場合は文字列の「''」を返す", () => {
    // @ts-ignore
    expect(NumberUtil.parseNumberOrStringNull(false)).toBe('');
  });
  it("文字列の「a」を渡した場合は文字列の「''」を返す", () => {
    expect(NumberUtil.parseNumberOrStringNull('a')).toBe('');
  });
  it('文字列の「0」を渡した場合は数値の「0」を返す', () => {
    expect(NumberUtil.parseNumberOrStringNull('0')).toBe(0);
  });
  it('文字列の「123」を渡した場合は数値の「123」を返す', () => {
    expect(NumberUtil.parseNumberOrStringNull('123')).toBe(123);
  });
});

describe('parseIntOrStringStringNull', () => {
  it("文字列の「''」を渡した場合は文字列の「''」を返す", () => {
    expect(NumberUtil.parseIntOrStringNull('')).toBe('');
  });
  it("「null」を渡した場合は文字列の「''」を返す", () => {
    expect(NumberUtil.parseIntOrStringNull(null)).toBe('');
  });
  it("「false」を渡した場合は文字列の「''」を返す", () => {
    // @ts-ignore
    expect(NumberUtil.parseIntOrStringNull(false)).toBe('');
  });
  it("文字列の「a」を渡した場合は文字列の「''」を返す", () => {
    expect(NumberUtil.parseIntOrStringNull('a')).toBe('');
  });
  it('文字列の「0」を渡した場合は数値の「0」を返す', () => {
    expect(NumberUtil.parseIntOrStringNull('0')).toBe(0);
  });
  it('文字列の「123」を渡した場合は数値の「123」を返す', () => {
    expect(NumberUtil.parseIntOrStringNull('123')).toBe(123);
  });
});
