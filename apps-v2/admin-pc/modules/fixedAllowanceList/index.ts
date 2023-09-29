import { Reducer } from 'redux';

import { cloneDeep } from 'lodash';

import { AmountOption } from '../../../domain/models/exp/ExpenseType';

type State = Array<Record<string, any>>;

const initialState = [];

const ACTIONS = {
  ADD_ROW: 'FIXED_ALLOWANCE_LIST/ADD_ROW',
  REMOVE_ROW: 'FIXED_ALLOWANCE_LIST/REMOVE_ROW',
  EDIT_ROW: 'FIXED_ALLOWANCE_LIST/EDIT_ROW',
  RESET: 'FIXED_ALLOWANCE_LIST/RESET',
  VALIDATE: 'FIXED_ALLOWANCE_LIST/VALIDATE',
};

export const actions = {
  add: (rows: Array<AmountOption>) => ({
    type: ACTIONS.ADD_ROW,
    payload: rows,
  }),
  remove: (idx: number, rows: Array<AmountOption>) => ({
    type: ACTIONS.REMOVE_ROW,
    payload: { idx, rows },
  }),
  update: (
    idx: number,
    key: string,
    value: string | number,
    rows: Array<AmountOption>
  ) => ({
    type: ACTIONS.EDIT_ROW,
    payload: { idx, key, value, rows },
  }),
  reset: (rows: Array<AmountOption>) => ({
    type: ACTIONS.RESET,
    payload: rows,
  }),
  validate: (rows: Array<AmountOption>) => ({
    type: ACTIONS.VALIDATE,
    payload: rows,
  }),
};

export default ((state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.ADD_ROW:
      return [
        ...action.payload,
        {
          id: null,
          label: '',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          label_L0: '',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          label_L1: '',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          label_L2: '',
          allowanceAmount: 0,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          label_L0_error: false,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          allowanceAmount_error: false,
        },
      ];
    case ACTIONS.REMOVE_ROW:
      const rows = [...action.payload.rows];
      const remains = rows.filter(
        (items, index) => index !== action.payload.idx
      );
      return remains;
    case ACTIONS.EDIT_ROW:
      const prevRows = [...action.payload.rows];
      const targetRow = prevRows.find(
        (item, index) => index === action.payload.idx
      );
      targetRow[action.payload.key] = action.payload.value;

      if (
        action.payload.key === 'allowanceAmount' &&
        action.payload.value !== 0
      ) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        targetRow.allowanceAmount_error = false;
      }

      if (action.payload.key === 'label_L0' && action.payload.length !== 0) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        targetRow.label_L0_error = false;
      }

      return prevRows;
    case ACTIONS.RESET:
      return cloneDeep(action.payload);
    case ACTIONS.VALIDATE:
      const copyCheck = cloneDeep(action.payload);
      const validateRows = copyCheck.map((item) => {
        if (item.label_L0.length === 0) {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          item.label_L0_error = true;
        }
        if (item.allowanceAmount === 0) {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          item.allowanceAmount_error = true;
        }
        return item;
      });
      return validateRows;
    default:
      return state;
  }
}) as Reducer<State, any>;
