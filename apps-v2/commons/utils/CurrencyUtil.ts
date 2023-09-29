import moment from 'moment';

import ObjectUtil from './ObjectUtil';
import StringUtil from './StringUtil';

export default class CurrencyUtil {
  /**
   * 指定された日付で有効な通貨のみをフィルタして返す
   * @param {Array<Object>} currencyList 通貨リスト
   * @param {string} date 指定日付
   * @return {Array<Object}> 指定日付において有効な通貨リスト
   * NOTE: 通貨の validFrom, validTo および第二引数の date は YYYY-MM-DD 形式の文字列でも
   * 動作してしまうが、関数として期待しているのはミリ秒。
   * ただしサーバーとの日付型の I/F が変わればそれに合わせて期待している型も変わる。
   */
  static findActiveCurrencyList(currencyList, date) {
    if (!date) {
      return currencyList;
    }

    return currencyList.filter((item) => {
      const from = ObjectUtil.getOrDefault(item, 'validFrom', '0000-01-01');
      const to = ObjectUtil.getOrDefault(item, 'validTo', '9999-12-31');
      return moment(date).isBetween(from, to, null, '[]');
    });
  }

  /**
   * 数値の3桁カンマ区切り 3 numeric digits separated by commas
   * 入力値をカンマ区切りにして返却 Return input values
   * [Argument] numVal: input numeric value
   * [Return value] String (): comma-separated string
   */
  static convertToCurrency(numVal) {
    const MAX_DECIMAL_LIMIT = 3;
    const numberRegex = /^[+|-]?(\d*)(\.\d+)?$/;
    const thousandSeparatorRegex = /\B(?=(\d{3})+(?!\d))/g;
    let formattedNumVal = String(numVal);

    // 空の場合そのまま返却 If empty Return directly as it is
    if (formattedNumVal === '' || formattedNumVal === '-') {
      return '0';
    }
    // Remove leading zeroes and comma, then convert to half-width character
    // 全角から半角へ変換し、既にカンマが入力されていたら事前に削除
    formattedNumVal = StringUtil.removeLeadingZeroes(
      StringUtil.removeComma(StringUtil.toHalfWidth(formattedNumVal))
    ).trim();

    // If it is not a numerical value, return it as it is
    // 数値でなければそのまま返却
    if (!numberRegex.test(formattedNumVal)) {
      return formattedNumVal;
    }
    // Split into integer and decimal part
    // 整数部分と小数部分に分割
    const numData = formattedNumVal.split('.');

    // Separate the integer part with 3 digits separated by commas
    // 整数部分を3桁カンマ区切りへ
    numData[0] = numData[0].replace(thousandSeparatorRegex, ',');

    // Decimal part
    // trim if longer than decimal limit.
    if (numData[1] && numData[1].length > MAX_DECIMAL_LIMIT) {
      numData[1] = numData[1].substring(0, MAX_DECIMAL_LIMIT);
    }
    // Combine with decimal part and join
    formattedNumVal = (numData.join('.') || 0) as string;

    return formattedNumVal;
  }

  /**
   * [Argument] value: string, decimal: number
   * [Return value] isValid: boolean
   */
  static validateCurrency(value, decimal) {
    /*
     * REGEX Explanation
     * ^ starts with
     * -? allow negative numbers
     * \\d{0,12} numbers only, 0-12 digits
     * ${hasDots} if decimal is not zero, allow dots with numbers in front of dot
     * \\d{0,${decimal}} allow how many decimal places.
     */
    const hasDots = decimal === 0 ? '' : '\\d\\.';
    const decimalRegex = new RegExp(
      `^-?\\d{0,12}(${hasDots}\\d{0,${decimal}})?$`
    );

    return decimalRegex.test(value);
  }

  /**
   * [Argument] value: string
   * [Return value] isValid: boolean
   */
  static validateExchangeRate(value) {
    // start with number. maximum of 6 decimal places at the back.
    const exchangeRateRegex = /^(|[0-9|０-９]{1,10}(\.[0-9|０-９]{0,6})?)$/;
    return exchangeRateRegex.test(value);
  }
}
