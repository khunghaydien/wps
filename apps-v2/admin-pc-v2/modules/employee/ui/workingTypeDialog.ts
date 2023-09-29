export type WorkingType = {
  id: string;
  code: string;
  name: string;
};

type State = {
  showFlag: boolean;
  workingType: WorkingType;
};

export const initialState: State = {
  showFlag: false,
  workingType: {
    id: null,
    code: null,
    name: null,
  },
};

const ROOT = 'ADMIN-PC-V2/MODULES/EMPLOYEE/UI/WORKING_TYPE_DIALOG' as const;

// Actions
export const ACTION_TYPE = {
  SHOW: `${ROOT}/SHOW`,
  HIDE: `${ROOT}/HIDE`,
  SET_SELECTED_WORKING_TYPE: `${ROOT}/SET_SELECTED_WORKING_TYPE`,
  RESET_SELECTED_WORKING_TYPE: `${ROOT}/RESET_SELECTED_WORKING_TYPE`,
} as const;

type Show = { type: typeof ACTION_TYPE.SHOW };
type Hide = { type: typeof ACTION_TYPE.HIDE };
type SetSelectedWorkingType = {
  type: typeof ACTION_TYPE.SET_SELECTED_WORKING_TYPE;
  payload: WorkingType;
};
type ResetSelectedWorkingType = {
  type: typeof ACTION_TYPE.RESET_SELECTED_WORKING_TYPE;
};

type Action = Show | Hide | SetSelectedWorkingType | ResetSelectedWorkingType;

export const actions = {
  show: (): Show => ({ type: ACTION_TYPE.SHOW }),
  hide: (): Hide => ({ type: ACTION_TYPE.HIDE }),
  setSelectedWorkingType: (
    workingType: WorkingType
  ): SetSelectedWorkingType => ({
    type: ACTION_TYPE.SET_SELECTED_WORKING_TYPE,
    payload: workingType,
  }),
  resetSelectedWorkingType: (): ResetSelectedWorkingType => ({
    type: ACTION_TYPE.RESET_SELECTED_WORKING_TYPE,
  }),
};

// Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPE.SHOW:
      return {
        ...state,
        showFlag: true,
      };
    case ACTION_TYPE.HIDE:
      return {
        ...state,
        showFlag: false,
      };
    case ACTION_TYPE.SET_SELECTED_WORKING_TYPE:
      return {
        ...state,
        workingType: action.payload,
      };
    case ACTION_TYPE.RESET_SELECTED_WORKING_TYPE:
      return {
        ...state,
        workingType: initialState.workingType,
      };
    default:
      return state;
  }
};
