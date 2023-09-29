import numeral from 'numeral';

const ROUNDING = {
  CEIL: 'Ceil', // 切り上げ
  FLOOR: 'Floor', // 切り捨て
  ROUND: 'Round', // 四捨五入
};

export default class FormatUtil {
  static unformat(input) {
    return numeral(input).value();
  }

  // 整数を表す文字列に変換
  static convertToIntegerString(inputText) {
    const unformattableText = this.unformat(inputText);
    return numeral(unformattableText).format('0,0');
  }

  // 小数を表す文字列に変換
  static convertToDecimalString(inputText) {
    const unformattableText = this.unformat(inputText);
    return numeral(unformattableText).format('0.0[0000]');
  }

  // 数値を文字列に変換
  static convertToStringFromNumber(inputText) {
    const unformattableText = this.unformat(inputText);
    return numeral(unformattableText).format('0.00');
  }

  // 表示用の数値に変換(返り値の型は string)
  static convertToDisplayingNumber(inputText) {
    const unformattableText = this.unformat(inputText);
    return numeral(unformattableText).format('0,0.00');
  }

  // 表示用のパーセント形式に変換(返り値の型は string)
  static convertToDisplayingPercent(inputText) {
    const unformattableText = this.unformat(inputText / 100);
    return numeral(unformattableText).format('0%');
  }

  // 表示用の通貨形式に変換(返り値の型は string)
  static convertToDisplayingCurrency(inputText = '', fractionDigits = 0) {
    const unformattedText = this.unformat(inputText);
    return numeral(unformattedText).format(
      `0,0[.]${'0'.repeat(fractionDigits)}`
    );
  }

  // 表示用（編集中）の通貨形式に変換(返り値の型は string)
  static convertToEditingCurrency(inputText = '', fractionDigits = 0) {
    if (inputText.endsWith('.')) {
      return inputText;
    }

    const unformattedText = this.unformat(inputText);
    return numeral(unformattedText).format(
      `0[.][${'0'.repeat(fractionDigits)}]`
    );
  }

  /**
   * 数値を、桁区切り文字や小数点桁数を考慮した文字列にフォーマットする
   * @param {number} value フォーマット対象
   * @param {number} fractionDigits 小数点桁数
   * @return {string} フォーマットした数字文字列
   */
  static formatNumber(value, fractionDigits = 0) {
    // 指定した小数点桁数を超える分は四捨五入でなく切り捨て
    return numeral(value).format(
      this.buildFormatText(fractionDigits),
      Math.floor
    );
  }

  /**
   * Format the value with the given number of fractions digits padded (without adding comma)
   * @param value the value to be formatted
   * @param fractionDigits
   * @returns {string} original number value with the correct fraction digits padded
   */
  static padDecimal(value, fractionDigits = 0) {
    return numeral(value).format(`0.${'0'.repeat(fractionDigits)}`, Math.floor);
  }

  static formatDate(value) {
    return value.replace(/-/g, '/');
  }

  /**
   * numeral#format() 用の文字列を組み立てる
   * @param {string} fractionDigits 小数点桁数
   * @return {string} numeral#format() 用文字列
   *
   * NOTE: 桁区切りや小数点のカンマ・ピリオドが国によって異なる点については
   *  Numeral.js の locale で変更可能なため、ここでは気にしない
   */
  static buildFormatText(fractionDigits = 0) {
    return `0,0.${'0'.repeat(fractionDigits)}`;
  }

  /**
   * 値の丸め処理を行う関数
   * 会社マスタで設定する端数処理の選択リストデフォルト値がFloorのため、想定外ケースの場合Math.floorを行っている
   * JSの仕様(IEEE754)では計算値が厳密にならない可能性があるため、一旦文字列に戻した後に再度数値に変換して処理を行っている
   * @param  {Number} value         対象となる金額の値
   * @param  {String} rounding 丸め設定値。
   * @param  {Number} scale         小数点第n位以下を端数処理するかの設定値。デフォルト値は0
   * @return {Number}               丸め後の金額値
   */
  static roundValue(value, rounding, scale = 0) {
    let roundFunc;
    switch (rounding) {
      case ROUNDING.CEIL:
        roundFunc = Math.ceil;
        break;
      case ROUNDING.ROUND:
        roundFunc = Math.round;
        break;
      case ROUNDING.FLOOR:
      default:
        roundFunc = Math.floor;
        break;
    }
    return roundFunc(value.toFixed(scale + 1) * 10 ** scale) / 10 ** scale;
  }
}
