import { Dispatch } from 'redux';

export type Variant = 'success' | 'warning' | 'error';

type Options = {
  // NOTE:
  // It is useful to define the type in the root reducer of each screen.
  // Example (in ./modules/index.ts)
  //   export type State = ReturnType<typeof reducer> & {
  //   common: { toast: { options?: { messageType: ToastMessageType } } };
  // };
  [key: string]: unknown;
};

export type State = {
  isShow: boolean;
  message: string;
  variant?: Variant;
  options?: Options;
};

const initialState: State = {
  isShow: false,
  message: '',
};

type Show = {
  type: 'COMMONS/MODULES/TOAST/SHOW';
  payload: {
    message: string;
    variant: Variant;
    options?: Options;
  };
};

type Hide = {
  type: 'COMMONS/MODULES/TOAST/HIDE';
};

type Reset = {
  type: 'COMMONS/MODULES/TOAST/RESET';
};

export type Action = Show | Hide | Reset;

const SHOW: Show['type'] = 'COMMONS/MODULES/TOAST/SHOW';

const HIDE: Hide['type'] = 'COMMONS/MODULES/TOAST/HIDE';

const RESET: Reset['type'] = 'COMMONS/MODULES/TOAST/RESET';

export const actions = {
  show: (
    message: string,
    variant: Variant = 'success',
    options?: Options
  ): Show => ({
    type: SHOW,
    payload: {
      message,
      variant,
      options,
    },
  }),
  showWithType: (
    message: string,
    variant: Variant = 'error',
    options?: Options
  ): Show => ({
    type: SHOW,
    payload: {
      message,
      variant,
      options,
    },
  }),
  hide: (): Hide => ({
    type: HIDE,
  }),
  reset: (): Reset => ({
    type: RESET,
  }),
};

const defaultDurationTime = 4000;

/**
 *
 * @param message A message will be displayed in toast.
 * @param duration The duration while toast is displayed (4000ms as default).
 * @param options Placeholder for when you want to add some conditional value to state. Please extend it in each screen..
 *
 * Display a toast.
 * The toast will be hidden after a given `duration` is elapsed.
 * Note that the continued process will be blocked until toast is hidden
 * if you use it with `await`.
 *
 * NOTE
 * According to our best practice, the method running `dispatch` should not be implemented
 * in `module`, but utilities in commons is an exception.
 *
 *
 * トーストを表示し、設定時間経過後非表示にするメソッド
 * awaitをつけてしまうとトーストが出てから消えるまで次の処理を行わなくなるためawaitをつける必要はありません
 *
 * NOTE
 * 本来moduleの中でdispatchは行わないのだが、commonsに限り例外的に良しとしている
 */
export const showToast =
  (
    message: string,
    duration: number = defaultDurationTime,
    options?: Options
  ) =>
  async (dispatch: Dispatch<any>) => {
    await dispatch(actions.show(message, 'success', options));

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(actions.hide());
        resolve();
      }, duration);
    });
  };
export const showToastWithType =
  (
    message: string,
    duration: number = defaultDurationTime,
    variant: Variant,
    options?: Options
  ) =>
  async (dispatch: Dispatch<any>) => {
    await dispatch(actions.showWithType(message, variant, options));

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(actions.hide());
        resolve();
      }, duration);
    });
  };

// Same properties as the above.
// The only difference is this method is specifically used to create error toast.
export const showErrorToast =
  (
    message: string,
    duration: number = defaultDurationTime,
    options?: Options
  ) =>
  async (dispatch: Dispatch<any>) => {
    await dispatch(actions.show(message, 'error', options));

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(actions.hide());
        resolve();
      }, duration);
    });
  };

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SHOW:
      const { message, variant, options } = action.payload;
      return {
        ...state,
        isShow: true,
        message,
        variant,
        options,
      };
    case HIDE:
      return {
        ...state,
        isShow: false,
      };

    case RESET: {
      return initialState;
    }
    default:
      return state;
  }
};
