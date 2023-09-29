import ROOT from './actionType';

type State = {
  loading: boolean;
  opened: boolean;
};

const initialState: State = {
  loading: false,
  opened: false,
};

const ACTION_TYPE_ROOT = `${ROOT}/PAGE` as const;

const ACTION_TYPE = {
  START_LOADING: `${ACTION_TYPE_ROOT}/START_LOADING`,
  FINISH_LOADING: `${ACTION_TYPE_ROOT}/FINISH_LOADING`,
  OPEN: `${ACTION_TYPE_ROOT}/OPEN`,
  CLOSE: `${ACTION_TYPE_ROOT}/CLOSE`,
} as const;

type StartLoading = {
  type: typeof ACTION_TYPE.START_LOADING;
};

type FinishLoading = {
  type: typeof ACTION_TYPE.FINISH_LOADING;
};

type Open = {
  type: typeof ACTION_TYPE.OPEN;
};

type Close = {
  type: typeof ACTION_TYPE.CLOSE;
};

type Action = StartLoading | FinishLoading | Open | Close;

export const actions = {
  startLoading: (): StartLoading => ({
    type: ACTION_TYPE.START_LOADING,
  }),
  finishLoading: (): FinishLoading => ({
    type: ACTION_TYPE.FINISH_LOADING,
  }),
  openRequest: (): Open => ({
    type: ACTION_TYPE.OPEN,
  }),
  closeRequest: () => ({
    type: ACTION_TYPE.CLOSE,
  }),
};

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ACTION_TYPE.START_LOADING:
      return {
        ...state,
        loading: true,
      };

    case ACTION_TYPE.FINISH_LOADING:
      return {
        ...state,
        loading: false,
      };

    case ACTION_TYPE.OPEN:
      return {
        ...state,
        opened: true,
      };

    case ACTION_TYPE.CLOSE:
      return {
        ...state,
        opened: false,
      };

    default:
      return state;
  }
}
