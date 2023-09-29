import {
  AttOpsRecordAggregateSetting,
  updateOpsRecordByKey,
} from '@apps/admin-pc/models/attendance/AttOpsRecordAggregateSetting';

export type State = {
  selectedHistoryId: string;
  selectedIndex?: number;
  OpsRecordAggregate: AttOpsRecordAggregateSetting[];
  TempOpsRecordAggregate: AttOpsRecordAggregateSetting[];
};

export const initialState: State = {
  selectedHistoryId: '',
  OpsRecordAggregate: [],
  TempOpsRecordAggregate: [],
};

const actionName = 'ADMIN-PC/MODULES/FEATURE-SETTING/UI/DETAIL/' as const;

// Actions
export const ACTION_TYPE = {
  INIT: actionName + 'INITIALIZE',
  SET_HISTORY_ID: actionName + 'SET_SELECTED_HISTORY_ID',
  SET_OPS_RECORD: actionName + 'SET_TEMP_OPS_RECORD_AGGREGATE',
  UPDATE_OPS_RECORD: actionName + 'UPDATE_OPS_RECORD_AGGREGATE',
} as const;

type Initialize = {
  type: typeof ACTION_TYPE.INIT;
};

type SetSelectedHistoryId = {
  type: typeof ACTION_TYPE.SET_HISTORY_ID;
  payload: string;
};

type SetTempOpsRecordAggregate = {
  type: typeof ACTION_TYPE.SET_OPS_RECORD;
  payload: AttOpsRecordAggregateSetting[];
};

type UpdateOpsRecordAggregate = {
  type: typeof ACTION_TYPE.UPDATE_OPS_RECORD;
  payload: {
    index: number;
    key: keyof AttOpsRecordAggregateSetting;
    value: string;
  };
};

type Action =
  | Initialize
  | SetSelectedHistoryId
  | SetTempOpsRecordAggregate
  | UpdateOpsRecordAggregate;

export const actions = {
  initialize: (): Initialize => ({
    type: ACTION_TYPE.INIT,
  }),
  setSelectedHistoryId: (value: string): SetSelectedHistoryId => ({
    type: ACTION_TYPE.SET_HISTORY_ID,
    payload: value,
  }),
  setTempOpsRecordAggregate: (
    value: AttOpsRecordAggregateSetting[]
  ): SetTempOpsRecordAggregate => ({
    type: ACTION_TYPE.SET_OPS_RECORD,
    payload: value,
  }),
  updateOpsRecordAggregate: (
    index: number,
    key: keyof AttOpsRecordAggregateSetting,
    value: string
  ): UpdateOpsRecordAggregate => ({
    type: ACTION_TYPE.UPDATE_OPS_RECORD,
    payload: { index, key, value },
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPE.INIT: {
      return initialState;
    }

    case ACTION_TYPE.SET_HISTORY_ID: {
      return {
        ...state,
        selectedHistoryId: (action as SetSelectedHistoryId).payload,
      };
    }

    case ACTION_TYPE.SET_OPS_RECORD: {
      return {
        ...state,
        TempOpsRecordAggregate: (action as SetTempOpsRecordAggregate).payload,
      };
    }

    case ACTION_TYPE.UPDATE_OPS_RECORD: {
      const { index, key, value } = (action as UpdateOpsRecordAggregate)
        .payload;
      const { TempOpsRecordAggregate } = state;
      return {
        ...state,
        TempOpsRecordAggregate: updateOpsRecordByKey(
          index,
          key,
          value,
          TempOpsRecordAggregate
        ),
      };
    }

    default:
      return state;
  }
};
