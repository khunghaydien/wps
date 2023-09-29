import _ from 'lodash';

import TAX_TYPE from '../constants/taxType';

import FormatUtil from './FormatUtil';

export default class TaxUtil {
  // 合計金額と税率から税額を計算
  static calcGstVat(totalAmount, taxRate, rounding, scale) {
    const unformatTotalAmount = FormatUtil.unformat(totalAmount);
    const unformatTaxRate = FormatUtil.unformat(taxRate) / 100;
    return FormatUtil.roundValue(
      unformatTotalAmount * (unformatTaxRate / (1 + unformatTaxRate)),
      rounding,
      scale
    );
  }

  /**
   * TaxTypeがTotal(総額)かどうかを判定する関数
   * 内訳無しの場合は税額が手入力できる場合もTaxTypeはTotalとなるため同じ関数を使用する
   * @param  {String}  type 税種別
   * @return {Boolean}      TaxTypeがTotalの場合、True。それ以外はFalse
   */
  static isTaxTypeTotal(type) {
    return type === TAX_TYPE.TOTAL;
  }

  /**
   * TaxTypeがPerRecordItem(内訳毎)かどうかを判定する関数
   * 内訳無しの場合は税額が自動計算となる場合もTaxTypeはPerRecordItemとなるため同じ関数を使用する
   * @param  {String}  type 税種別
   * @return {Boolean}      TaxTypeがPerRecordItemの場合、True。それ以外はFalse
   */
  static isTaxTypePerRecordItem(type) {
    return type === TAX_TYPE.PER_RECORD_ITEM;
  }

  /**
   * TaxTypeがNontaxable(課税なし)かどうかを判定する関数
   * @param  {String}  type 税種別
   * @return {Boolean}      TaxTypeがNontaxableの場合、True。それ以外はFalse
   */
  static isTaxTypeNonTaxable(type) {
    return type === TAX_TYPE.NONTAXABLE;
  }

  /**
   * 取得できたexpTaxTypeListから税率の選択リストに表示するためのラベル名と初期選択する税率をセットする関数
   * @param  {Array} expTaxTypeList 税率の選択リスト
   * @param  {String} type 税種別
   */
  static setInitialExpTaxLabel(expTaxTypeList) {
    const editingExpTaxTypeList = _.cloneDeep(expTaxTypeList);
    editingExpTaxTypeList.map((expTax) => {
      expTax.label =
        expTax.rate > 0
          ? FormatUtil.convertToDisplayingPercent(expTax.rate)
          : expTax.name;
      return expTax;
    });
    return editingExpTaxTypeList;
  }

  /**
   * 税率選択リストのうち、選択したitemを取得する
   * @param  {array} expTaxTypeList 税率の選択リスト
   * @param  {String} selectedTaxTypeId 選択した税区分レコードID
   * @return {Object}                   選択した税率のexpTax(Object)の値
   */
  static findSelectedExpTax(expTaxTypeList, selectedTaxTypeId = null) {
    if (_.isEmpty(expTaxTypeList) || selectedTaxTypeId === null) {
      return null;
    }
    return expTaxTypeList.find((item) => {
      return item.id === selectedTaxTypeId;
    });
  }

  /**
   * 選択できる税率のうち、課税のレコードが2件以上あるかを判定する関数
   * @param  {Array}  expTaxTypeList
   * @return {Boolean}  選択できる税率のうち、課税のレコードが2件以上ある場合True,それ以外False
   */
  static hasMultipleTaxRecord(expTaxTypeList) {
    const filteredExpTaxTypeList = expTaxTypeList.filter((expTax) => {
      return expTax.rate > 0;
    });
    return filteredExpTaxTypeList.length >= 2;
  }
}
