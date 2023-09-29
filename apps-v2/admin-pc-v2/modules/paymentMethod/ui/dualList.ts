import { PaymentMethod } from '@apps/domain/models/exp/PaymentMethod';

import {
  convertToOptionFormat,
  getSelected,
} from '@admin-pc/modules/groupReportType';

type State = {
  options: Array<Record<string, string>>;
  selected: Array<string>;
};

type SelectedIds = string[];

type Initialise = {
  type: typeof ACTIONS.INITIALISE;
  payload: {
    selectedIds: SelectedIds;
    paymentMethod: PaymentMethod[];
  };
};

type Select = {
  type: typeof ACTIONS.SELECT;
  payload: SelectedIds;
};

const ACTIONS = {
  INITIALISE: 'ADMIN-PC-V2/MODULES/PAYMENT_METHOD/UI/DUAL_LIST/INITIALISE',
  SELECT: 'ADMIN-PC-V2/MODULES/PAYMENT_METHOD/UI/DUAL_LIST/SELECT',
} as const;

export const actions = {
  initialise: (
    selectedIds: string[],
    paymentMethod: PaymentMethod[]
  ): Initialise => ({
    type: ACTIONS.INITIALISE,
    payload: { selectedIds, paymentMethod },
  }),
  select: (selectedIds: SelectedIds): Select => ({
    type: ACTIONS.SELECT,
    payload: selectedIds,
  }),
};

const initialState = { options: [], selected: [] };

export default (
  state: State = initialState,
  action: Initialise | Select
): State => {
  switch (action.type) {
    case ACTIONS.INITIALISE:
      const { payload } = action;
      return {
        options: convertToOptionFormat(payload.paymentMethod),
        selected: getSelected(payload.selectedIds, payload.paymentMethod),
      };
    case ACTIONS.SELECT:
      return {
        ...state,
        selected: action.payload,
      };
    default:
      return state;
  }
};
