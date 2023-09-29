import { SummaryItem } from './SummaryItem';

export type SummaryBlock = {
  /**
   * サマリーブロック名
   */
  name: string;

  /**
   * サマリーブロック内の表示項目のリスト
   */
  items: SummaryItem[];
};
