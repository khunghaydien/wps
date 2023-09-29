import { Dispatch } from 'redux';

import isEmpty from 'lodash/isEmpty';

import { catchApiError, withLoading } from '../../../../commons/actions/app';

import {
  ExpenseType,
  Repository,
  SearchQuery,
} from '../../../../domain/models/exp/ExpenseType';

import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

// Type
export type Expense = {
  id: string;
  expenseTypeCode: string;
  expenseTypeName: string;
  expenseGroupCode: string;
  expenseGroupName: string;
  isSelected: boolean;
};

type State = {
  foundExpense: Expense[];
  selectedExpense: Expense[];
  isDialogOpen: boolean;
};

const ACTIONS = {
  SET_FOUND_EXPENSE: 'SET_FOUND_EXPENSE',
  CLEAN_FOUND_EXPENSE: 'CLEAN_FOUND_EXPENSE',
  CLEAN_SELECTION: 'CLEAN_SELECTION',
  TOGGLE_SELECTION: 'TOGGLE_SELECTION',
  TOGGLE_SELECTED: 'TOGGLE_SELECTED',
  ADD_TO_SELECTED_EXPENSE: 'ADD_TO_SELECTED_EXPENSE',
  REMOVE_FROM_SELECTED_EXPENSE: 'REMOVE_FROM_SELECTED_EXPENSE',
  CLEAN_SELECTED_EXPENSE: 'CLEAN_SELECTED_EXPENSE',
  UPDATE: 'UPDATE',
};

export const actions = {
  setFoundExpense: (foundExp: Expense[]) => ({
    type: ACTIONS.SET_FOUND_EXPENSE,
    payload: foundExp,
  }),
  cleanFoundExpense: () => ({
    type: ACTIONS.CLEAN_FOUND_EXPENSE,
  }),
  toggleSelection: (target: Expense) => ({
    type: ACTIONS.TOGGLE_SELECTION,
    payload: target,
  }),
  cleanSelection: () => ({
    type: ACTIONS.CLEAN_SELECTION,
  }),
  toggleSelectedExp: (target: Expense) => ({
    type: ACTIONS.TOGGLE_SELECTED,
    payload: target,
  }),
  addToSelectedExpense: (expense: Expense[]) => ({
    type: ACTIONS.ADD_TO_SELECTED_EXPENSE,
    payload: expense,
  }),
  removeFromSelectedExpense: (expense: Expense[]) => ({
    type: ACTIONS.REMOVE_FROM_SELECTED_EXPENSE,
    payload: expense,
  }),
  cleanSelectedExpense: () => ({
    type: ACTIONS.CLEAN_SELECTED_EXPENSE,
  }),
  update: (key: string, value: any) => ({
    type: ACTIONS.UPDATE,
    payload: { key, value },
  }),
};

// Methods
export const searchExpense =
  (query: SearchQuery, selectedExp: Expense[]) =>
  (dispatch: AppDispatch): Promise<any> => {
    return dispatch(
      withLoading(async () => {
        const { ids } = await Repository.searchIds({ ...query });
        const paramIds = ids.filter(
          (id) => !selectedExp.map((obj) => obj.id).includes(id)
        );
        if (!isEmpty(paramIds)) {
          await Repository.getRecords(paramIds.slice(0, 101))
            .then((expType) => {
              const filteredFoundExp = expType.map((exp) => ({
                id: exp.id,
                expenseTypeCode: exp.code,
                expenseTypeName: exp.name,
                expenseGroupCode: exp.parentGroupCode,
                expenseGroupName: exp.parentGroup.name,
                isSelected: false,
              }));
              return filteredFoundExp;
            })
            .then((filtered) => {
              dispatch(actions.cleanFoundExpense());
              dispatch(actions.setFoundExpense(filtered));
            })
            .catch((err) =>
              dispatch(catchApiError(err, { isContinuable: true }))
            );
        } else {
          dispatch(actions.cleanFoundExpense());
          dispatch(actions.setFoundExpense([]));
        }
      })
    );
  };

export const openSearchDialog = () => (dispatch: Dispatch<any>) => {
  dispatch(actions.cleanFoundExpense());
  dispatch(actions.update('isDialogOpen', true));
};

export const cancelSearch = () => (dispatch: Dispatch<any>) => {
  dispatch(actions.cleanSelection());
  dispatch(actions.cleanFoundExpense());
  dispatch(actions.update('isDialogOpen', false));
};

export const setSelectedExp =
  (selectedExpId: Array<string>, expense: ExpenseType[]) =>
  (dispatch: Dispatch<any>) => {
    const selectedExp = expense
      .filter((exp) => selectedExpId.includes(exp.id))
      .map((exp) => ({
        id: exp.id,
        expenseTypeCode: exp.code,
        expenseTypeName: exp.name,
        expenseGroupCode: exp.parentGroupCode,
        expenseGroupName: exp.parentGroup.name,
        isSelected: false,
      }));
    dispatch(actions.cleanSelectedExpense());
    dispatch(actions.addToSelectedExpense(selectedExp));
  };

export const cleanSelectedExpense = () => (dispatch: Dispatch<any>) => {
  dispatch(actions.cleanSelectedExpense());
};

export const addSelectedExp =
  (expense: Expense[]) => (dispatch: Dispatch<any>) => {
    const exp = expense.filter((e) => e.isSelected);
    const selectedExp = exp.map((e) => ({
      ...e,
      isSelected: false,
    }));
    dispatch(actions.addToSelectedExpense(selectedExp));
    dispatch(actions.update('isDialogOpen', false));
  };

// Reducer
const initialState = {
  foundExpense: [],
  selectedExpense: [],
  isDialogOpen: false,
  configedExpTypeId: '',
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.SET_FOUND_EXPENSE: {
      return {
        ...state,
        foundExpense: action.payload,
      };
    }
    case ACTIONS.CLEAN_FOUND_EXPENSE: {
      return {
        ...state,
        foundExpense: [],
      };
    }
    case ACTIONS.TOGGLE_SELECTION: {
      const payload = action.payload;
      const clone = [...state.foundExpense];
      const index = state.foundExpense.findIndex(
        (exp) => exp.id === payload.id
      );
      clone[index] = {
        ...payload,
        isSelected: !payload.isSelected,
      };
      return {
        ...state,
        foundExpense: [...clone],
      };
    }
    case ACTIONS.CLEAN_SELECTION: {
      const clone = [...state.foundExpense];
      clone.forEach((exp) => ({ ...exp, isSelected: false }));
      return {
        ...state,
        foundExpense: [...clone],
      };
    }
    case ACTIONS.TOGGLE_SELECTED: {
      const payload = action.payload;
      const clone = [...state.selectedExpense];
      const index = state.selectedExpense.findIndex(
        (exp) => exp.id === payload.id
      );
      clone[index] = {
        ...payload,
        isSelected: !payload.isSelected,
      };
      return {
        ...state,
        selectedExpense: [...clone],
      };
    }
    case ACTIONS.ADD_TO_SELECTED_EXPENSE: {
      const payload = action.payload;
      return {
        ...state,
        selectedExpense: [...payload, ...state.selectedExpense],
      };
    }
    case ACTIONS.REMOVE_FROM_SELECTED_EXPENSE: {
      const payload = action.payload;
      const remainExp = payload.filter((exp) => !exp.isSelected);
      return {
        ...state,
        selectedExpense: [...remainExp],
      };
    }
    case ACTIONS.CLEAN_SELECTED_EXPENSE: {
      return {
        ...state,
        selectedExpense: [],
      };
    }
    case ACTIONS.UPDATE: {
      const payload = action.payload;
      return {
        ...state,
        [payload.key]: payload.value,
      };
    }
    default:
      return state;
  }
};
