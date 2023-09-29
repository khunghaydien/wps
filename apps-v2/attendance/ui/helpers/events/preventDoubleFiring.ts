import debounce from 'lodash/debounce';

/*
 * TIME_FOR_WAITING_TO_SEND_REQUEST
 *
 * ローディングレイヤーが表示されるまでメソッドの二回目の実行を止める時間です。
 * 時間は「API 通信時間 > 待機時間 > ローディングレイヤーが表示される時間」である必要があります。
 * 現在、API 通信時間は本番環境で 4000ms ~ 2000ms でした。
 * 画面の切り替えに500ms以上掛かる場合は体感的にも「遅い」はずで画面の不具合と想定します。
 * したがって、TIME_FOR_WAITING_TO_SEND_REQUEST は 500ms としました。
 *
 * The time to stop the second execution of the method until the loading layer is displayed.
 * The time must be "API connection time > waiting time > loading layer display time".
 * Currently, the API connection time is 4000ms ~ 2000ms in the production environment.
 * If it takes more than 500ms to switch screens, it should be "slow" from a physical point of view and we assume that the screen is defective.
 * Therefore, I set TIME_FOR_WAITING_TO_SEND_REQUEST to 500ms.
 */
const TIME_FOR_WAITING_TO_SEND_REQUEST = 500;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default <T extends Parameters<typeof debounce>[0]>(method: T) =>
  debounce<T>(method, TIME_FOR_WAITING_TO_SEND_REQUEST, {
    leading: true,
    trailing: false,
  });
