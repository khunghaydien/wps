/**
 * 文字列操作に関するUtilクラス
 */
export default class StringUtil {
  /**
   * 全角文字を半角文字へ変換する
   * 扱うケースごとに単体テストを書いて動作を検証しておくことを推奨
   */
  static convertToHankaku(str) {
    const converted = str
      .replace(/[！-～]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
      }) // これらの文字は上記処理では対応できないため個別変換
      .replace(/’/g, "'")
      .replace(/‘/g, '`')
      .replace(/￥/g, '\\')
      .replace(/。/g, '.') // eslint-disable-next-line no-irregular-whitespace
      .replace(/　/g, ' ')
      .replace(/〜/g, '~');

    return converted;
  }

  static removeComma(strVal) {
    return strVal.replace(/,/g, '');
  }

  // remove all leading zeroes except the one preceding .
  // 000.12 => 0.12
  // 000012 => 12
  // 0.12 => 0.12
  static removeLeadingZeroes(strVal) {
    return strVal.replace(/\b(?:0*(0\.\d+)|0+)/g, '$1');
  }

  // shift character code
  // 文字コードをシフト
  static shiftCharacterCode(tmpStr) {
    return String.fromCharCode(tmpStr.charCodeAt(0) - 0xfee0);
  }

  // Half width conversion
  // 半角変換
  static toHalfWidth(strVal) {
    return strVal.replace(/[！-～]/g, this.shiftCharacterCode);
  }
}
