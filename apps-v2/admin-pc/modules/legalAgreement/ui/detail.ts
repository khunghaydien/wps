import {
  LimitEvent,
  SpecialEvent,
} from '../../../models/legal-agreement/LegalAgreementEvent';

type State = {
  selectedHistoryId: string;
  limitEvent: LimitEvent | Record<string, never>;
  specialEvent: SpecialEvent | Record<string, never>;
  selectedIndex?: number;
};

const initialState: State = {
  selectedHistoryId: '',
  limitEvent: {},
  specialEvent: {},
};

// Actions
const ActionType = {
  INIT: 'ADMIN-PC/MODULES/LEGAL_AGREEMENT/UI/DETAIL/INITIALIZE',
  SETHISTORYID:
    'ADMIN-PC/MODULES/LEGAL_AGREEMENT/UI/DETAIL/SET_SELECTED_HISTORY_ID',
  SETLIMITLIST: 'ADMIN-PC/MODULES/LEGAL_AGREEMENT/UI/DETAIL/SET_LIMIT_LIST',
  SETSPECIALLIST: 'ADMIN-PC/MODULES/LEGAL_AGREEMENT/UI/DETAIL/SET_SPECIAL_LIST',
};

type Initialize = {
  type: typeof ActionType.INIT;
};

type SetSelectedHistoryId = {
  type: typeof ActionType.SETHISTORYID;
  payload: string;
};

type SetLimitList = {
  type: typeof ActionType.SETLIMITLIST;
  payload: LimitEvent | Record<string, never>;
};

type SetSpecialList = {
  type: typeof ActionType.SETSPECIALLIST;
  payload: SpecialEvent | Record<string, never>;
};

type Action = Initialize | SetSelectedHistoryId | SetLimitList | SetSpecialList;

export const actions = {
  initialize: (): Initialize => ({
    type: ActionType.INIT,
  }),
  setSelectedHistoryId: (id: string): SetSelectedHistoryId => ({
    type: ActionType.SETHISTORYID,
    payload: id,
  }),
  setLimitEvent: (event: LimitEvent | Record<string, never>): SetLimitList => ({
    type: ActionType.SETLIMITLIST,
    payload: event,
  }),
  setSpecialEvent: (
    event: SpecialEvent | Record<string, never>
  ): SetSpecialList => ({
    type: ActionType.SETSPECIALLIST,
    payload: event,
  }),
};

// Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.INIT: {
      return initialState;
    }
    case ActionType.SETHISTORYID: {
      return {
        ...state,
        selectedHistoryId: (action as SetSelectedHistoryId).payload,
      };
    }
    case ActionType.SETLIMITLIST: {
      return {
        ...state,
        limitEvent: (action as SetLimitList).payload,
      };
    }
    case ActionType.SETSPECIALLIST: {
      return {
        ...state,
        specialEvent: (action as SetSpecialList).payload,
      };
    }
    default:
      return state;
  }
};
