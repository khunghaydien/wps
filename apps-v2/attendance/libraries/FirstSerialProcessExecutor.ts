/**
 * 一回目だけ必ず直列実行させるための関数です。
 * Unitテストも書きたかったのですが、Jest が setTimeout + promise のテストで不具合を持っているため断念しました。
 */

const STATE = {
  WAITING: 0,
  EXECUTING: 1,
  FINISHED: 2,
} as const;

export default () => {
  let state: Value<typeof STATE> = STATE.WAITING;
  const processes: ((value?: unknown) => void)[] = [];
  const execute = <T extends () => Promise<unknown>>(
    process: T
  ): ReturnType<T> => {
    switch (state) {
      case STATE.WAITING: {
        state = STATE.EXECUTING;
        // process が Promise でない可能性はないが、Promise.resolve で変換しておく
        return Promise.resolve(process()).finally(() => {
          state = STATE.WAITING;
          processes.forEach(($process) => {
            // 実態は STATE.EXECUTING にいれた resolve 関数
            $process();
          });
          processes.splice(0, processes.length);
        }) as ReturnType<T>;
      }

      case STATE.EXECUTING: {
        return new Promise((resolve) => {
          // Promise の resolve を配列に入れることで
          // resolve が実行された後でこの Promise の then が呼ばれるので
          // 実行結果を返却することができる。
          processes.push(resolve);
        }).then(process) as ReturnType<T>;
      }

      default: {
        return process() as ReturnType<T>;
      }
    }
  };

  const wrap =
    <T extends (...args: unknown[]) => Promise<unknown>>(fn: T) =>
    (...args: Parameters<T>): ReturnType<T> =>
      execute(() => fn(...args)) as ReturnType<T>;

  return wrap;
};
