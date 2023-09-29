import TRACKING_COLOR_BAR, {
  NUMBER_OF_COLOR,
} from '../constants/trackingBarColor';

/**
 * 工数グラフに使う色関連
 */
export default class TaskColorUtil {
  /**
   * グラフの色を取得
   * 1ごとにインクリメントされた数字を引数に設定することで順番に色を取得
   * @param {number} taskBarColor
   */
  static getNextColor(taskBarColor) {
    return Object.assign(
      {},
      TRACKING_COLOR_BAR[taskBarColor % NUMBER_OF_COLOR]
    );
  }
}
