import { Dispatch, Reducer } from 'redux';

import { ExpenseTaxType } from '../../domain/models/exp/TaxType';

import { convertToOptionFormat, getSelected } from './groupReportType/index';

type Options = ReadonlyArray<{ value: string; label: string }>;

type State = {
  options: Options;
  selected: Array<string>;
};
const initialState = { options: [], selected: [] };

const ACTION = {
  SET_SELECTED_IDS: 'EXP_TAX_TYPE/SET_SELECTED_IDS',
  SET_OPTIONS: 'EXP_TAX_TYPE/SET_OPTIONS',
};

const setOptions = (
  selectedIds: Array<string>,
  taxType: Array<ExpenseTaxType>
) => ({
  type: ACTION.SET_OPTIONS,
  payload: { selectedIds, taxType },
});

const setSelectedIds = (selectedIds: Array<string>) => ({
  type: ACTION.SET_SELECTED_IDS,
  payload: selectedIds,
});

export const actions = {
  initialiseOptions:
    (selectedIds: Array<string>, taxType: Array<ExpenseTaxType>) =>
    (dispatch: Dispatch<any>) => {
      dispatch(setOptions(selectedIds, taxType));
    },
  setSelected: (selectedIds: Array<string>) => (dispatch: Dispatch<any>) => {
    dispatch(setSelectedIds(selectedIds));
  },
};

export default ((state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTION.SET_OPTIONS:
      return {
        options: convertToOptionFormat(action.payload.taxType),
        selected: getSelected(
          action.payload.selectedIds,
          action.payload.taxType
        ),
      };
    case ACTION.SET_SELECTED_IDS:
      return {
        ...state,
        selected: action.payload,
      };
    default:
      return state;
  }
}) as Reducer<State, any>;
