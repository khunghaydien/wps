import { Dispatch } from 'redux';

import { CostCenter } from '../../../../domain/models/exp/CostCenter';

export const LIMIT_NUMBER = 100;

const ACTIONS = {
  CLEAR_FOUND_CCS: 'MODULES/COST_CENTER/UI/ASSIGNMENT/CLEAR_FOUND_CCS',
  CLEAR_CC: 'MODULES/COST_CENTER/UI/ASSIGNMENT/CLEAR_CC',
  CLEAR_EXCLUDED_CCS: 'MODULES/COST_CENTER/UI/ASSIGNMENT/CLEAR_EXCLUDED_CCS',
  UPDATE: 'MODULES/COST_CENTER/UI/ASSIGNMENT/UPDATE',
};

// State
type State = {
  foundCCs: CostCenter[];
  excludedCCs: string[];
  isCostCenterDialogSelection: boolean;
};

// Action

type ClearFoundCCs = {
  type: 'MODULES/COST_CENTER/UI/ASSIGNMENT/CLEAR_FOUND_CCS';
};

type ClearSelection = {
  type: 'MODULES/COST_CENTER/UI/ASSIGNMENT/CLEAR_CC';
};

type ClearExcludedCCs = {
  type: 'MODULES/COST_CENTER/UI/ASSIGNMENT/CLEAR_EXCLUDED_CCS';
};

/* generize state updater */
type Update = {
  type: 'MODULES/COST_CENTER/UI/ASSIGNMENT/UPDATE';
  payload: {
    key: string;
    value: any;
  };
};

type Action = ClearFoundCCs | ClearSelection | ClearExcludedCCs | Update;

const clearFoundCCs = (): ClearFoundCCs => ({
  type: 'MODULES/COST_CENTER/UI/ASSIGNMENT/CLEAR_FOUND_CCS',
});

const clearSelection = (): ClearSelection => ({
  type: 'MODULES/COST_CENTER/UI/ASSIGNMENT/CLEAR_CC',
});

const clearExcludedCCs = (): ClearExcludedCCs => ({
  type: 'MODULES/COST_CENTER/UI/ASSIGNMENT/CLEAR_EXCLUDED_CCS',
});

const update = (key: string, value: any) => ({
  type: 'MODULES/COST_CENTER/UI/ASSIGNMENT/UPDATE',
  payload: {
    key,
    value,
  },
});

// Methods
export const actions = {
  openCCSelection:
    (isClearExcludedCCs?: boolean) => (dispatch: Dispatch<any>) => {
      dispatch(clearFoundCCs());
      if (isClearExcludedCCs) {
        dispatch(clearExcludedCCs());
      }
      dispatch(update('isCostCenterDialogSelection', true));
    },

  setActiveDialogKey: (key: string) => (dispatch: Dispatch<any>) => {
    dispatch(update('activeDialogKey', key));
  },

  cancelCCSelection: () => (dispatch: Dispatch<any>) => {
    dispatch(clearSelection());
    dispatch(update('isCostCenterDialogSelection', false));
  },
};

// Reducer
const initialState: State = {
  foundCCs: [],
  excludedCCs: [],
  isCostCenterDialogSelection: false,
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTIONS.CLEAR_FOUND_CCS: {
      return {
        ...state,
        foundCCs: [],
      };
    }
    case ACTIONS.CLEAR_CC: {
      return {
        ...state,
        foundCCs: state.foundCCs.map((cc) => ({
          ...cc,
          isSelected: false,
        })),
      };
    }
    case ACTIONS.CLEAR_EXCLUDED_CCS: {
      return {
        ...state,
        excludedCCs: [],
      };
    }
    case ACTIONS.UPDATE: {
      const payload = (action as Update).payload;
      return {
        ...state,
        [payload.key]: payload.value,
      };
    }
    default:
      return state;
  }
};
