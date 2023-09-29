import ROOT from './actionType';

export type Pattern = {
  code: string;
  name: string;
  validDateFrom: string;
  validDateTo: string;
};

type State = {
  orginalSelectedPattern: Pattern[];
  selectedPattern: Pattern[];
};

export const initialState: State = {
  orginalSelectedPattern: [],
  selectedPattern: [],
};

// Actions
export const ACTION_TYPE = {
  INIT: `${ROOT}/SELECTED_PATTERN/INIT`,
  SET_SELECTED_PATTERN: `${ROOT}/SELECTED_PATTERN/SET_SELECTED_PATTERN`,
  RESET: `${ROOT}/SELECTED_PATTERN/RESET`,
} as const;

type Init = {
  type: typeof ACTION_TYPE.INIT;
  payload: Pattern[];
};

type SetSelectedPattern = {
  type: typeof ACTION_TYPE.SET_SELECTED_PATTERN;
  payload: Pattern[];
};

type Reset = {
  type: typeof ACTION_TYPE.RESET;
};

type Action = Init | SetSelectedPattern | Reset;

export const actions = {
  init: (selectedPattern: Pattern[]): Init => ({
    type: ACTION_TYPE.INIT,
    payload: selectedPattern,
  }),
  setSelectedPattern: (selectedPattern: Pattern[]): SetSelectedPattern => ({
    type: ACTION_TYPE.SET_SELECTED_PATTERN,
    payload: selectedPattern,
  }),
  reset: (): Reset => ({
    type: ACTION_TYPE.RESET,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPE.INIT: {
      const pattern = (action as Init).payload;
      return {
        selectedPattern: pattern,
        orginalSelectedPattern: pattern,
      };
    }
    case ACTION_TYPE.SET_SELECTED_PATTERN: {
      return {
        ...state,
        selectedPattern: (action as SetSelectedPattern).payload,
      };
    }

    case ACTION_TYPE.RESET: {
      return initialState;
    }

    default:
      return state;
  }
};
