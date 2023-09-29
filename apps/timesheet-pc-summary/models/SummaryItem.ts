import { DaysAndHours } from './DaysAndHours';
import { Status } from './Status';

export type SummaryItem = {
  /**
   * 項目名
   */
  name: string;

  /**
   * 値
   */
  value: number;

  /**
   * 日数・時間項目用の値
   */
  daysAndHours: DaysAndHours;

  /**
   * 単位
   */
  unit: 'days' | 'hours' | 'count' | 'daysAndHours';

  /**
   * 入れ子サマリー項目
   */
  items?: SummaryItem[];

  /**
   * ClosingDateを表示するかどうか
   */
  isAsAtClosingDate?: boolean;

  /**
   * 翻訳された名前があるかどうか
   */
  hasTranslatedNameInItems?: boolean;

  /**
   * 値を表示しても良いかどうか
   * ture: 表示して良い
   * false: 表示すべきでない
   */
  shouldShowValue: boolean;
};

/**
 * 値がを表示して良いかどうかを設定します。
 */
const setShouldShowValue = (
  item: SummaryItem,
  status: Status,
  hasCalculatedAbsence: boolean
): SummaryItem => {
  const visibleValueItem = {
    ...item,
    shouldShowValue: true,
  };
  const invisibleValueItem = {
    ...item,
    shouldShowValue: false,
  };

  if (status === 'Approved' || status === 'Pending') {
    return visibleValueItem;
  }

  switch (item.name) {
    // 欠勤日数
    case 'WorkAbsenceDays':
      // 計算された欠勤日数があれば欠勤日数を表示しても良い
      return hasCalculatedAbsence ? visibleValueItem : invisibleValueItem;

    default:
      return visibleValueItem;
  }
};

/**
 * 任意の情報項目について、項目名に応じた属性を追加して返却する
 */
const addAttributes = (item: SummaryItem) => {
  switch (item.name) {
    case 'AnnualPaidLeaveDaysLeft':
      return {
        ...item,
        isAsAtClosingDate: true,
      };

    case 'GeneralPaidLeaveDays':
    case 'UnpaidLeaveDays':
      return {
        ...item,
        hasTranslatedNameInItems: true,
      };

    default:
      return item;
  }
};

/**
 * レスポンスから勤怠サマリー項目を作成します
 * @param item 勤怠サマリー項目レスポンス
 * @param status 承認状況
 * @param hasCalculatedAbsence 休職休業フラグ
 * @return 勤怠サマリー項目
 */
// eslint-disable-next-line import/prefer-default-export
export const convertFromResponse = (
  item: SummaryItem,
  status: Status,
  hasCalculatedAbsence: boolean
): SummaryItem => {
  type Fn = (arg0: SummaryItem) => SummaryItem;
  const identity = (_) => _;
  const compose = (...fn: Fn[]): Fn =>
    fn.reduceRight((prevFn, nextFn) => (arg) => nextFn(prevFn(arg)), identity);

  return compose(
    (arg) => setShouldShowValue(arg, status, hasCalculatedAbsence),
    addAttributes
  )(item);
};
