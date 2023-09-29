import { LimitEvent } from '../../../models/legal-agreement/LegalAgreementEvent';

type State = {
  limitEvent: LimitEvent | Record<string, never>;
  isShowLimit: boolean;
  isLoading: boolean;
};

const initialState: State = {
  limitEvent: {},
  isShowLimit: false,
  isLoading: false,
};

// Actions
const ActionType = {
  SET: 'ADMIN-PC/MODULES/LEGAL_AGREEMENT/UI/EVENT/SET',
  UNSET: 'ADMIN-PC/MODULES/LEGAL_AGREEMENT/UI/EVENT/UNSET',
  UPDATE: 'ADMIN-PC/MODULES/LEGAL_AGREEMENT/UI/EVENT/UPDATE',
  SETSHOWFLAG: 'ADMIN-PC/MODULES/LEGAL_AGREEMENT/UI/EVENT/SETSHOWFLAG',
  SETISLOADING: 'ADMIN-PC/MODULES/LEGAL_AGREEMENT/UI/EVENT/SETISLOADING',
};

type Set = {
  type: typeof ActionType.SET;
  payload: LimitEvent | Record<string, never>;
};

type Unset = {
  type: typeof ActionType.UNSET;
};

type Update = {
  type: typeof ActionType.UPDATE;
  payload: { key: string; value: number };
};

type SetShowFlag = {
  type: typeof ActionType.SETSHOWFLAG;
  payload: boolean;
};

type SetIsLoading = {
  type: typeof ActionType.SETISLOADING;
  payload: boolean;
};

type Action = Set | Unset | Update | SetShowFlag | SetIsLoading;

export const actions = {
  set: (event: LimitEvent | Record<string, never>): Set => ({
    type: ActionType.SET,
    payload: event,
  }),
  unset: (): Unset => ({
    type: ActionType.UNSET,
  }),
  update: (key: string, value: number): Update => ({
    type: ActionType.UPDATE,
    payload: {
      key,
      value,
    },
  }),
  setShowFlag: (flag: boolean): SetShowFlag => ({
    type: ActionType.SETSHOWFLAG,
    payload: flag,
  }),
  setIsLoading: (flag: boolean): SetIsLoading => ({
    type: ActionType.SETISLOADING,
    payload: flag,
  }),
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SET:
      return { ...state, limitEvent: (action as Set).payload };
    case ActionType.UPDATE: {
      const { key, value } = (action as Update).payload;
      return {
        ...state,
        limitEvent: {
          ...state.limitEvent,
          [key]: value,
        },
      };
    }
    case ActionType.SETSHOWFLAG:
      return {
        ...state,
        isShowLimit: (action as SetShowFlag).payload,
      };
    case ActionType.SETISLOADING:
      return {
        ...state,
        isLoading: (action as SetIsLoading).payload,
      };
    case ActionType.UNSET:
      return initialState;
    default:
      return state;
  }
};
