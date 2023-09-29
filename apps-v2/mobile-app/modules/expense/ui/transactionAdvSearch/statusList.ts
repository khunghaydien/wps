import { Reducer } from 'redux';

import msg from '../../../../../commons/languages';
import { OptionProps as Option } from '@apps/commons/components/fields/SearchableDropdown';

import { STATUS_MAP } from '@apps/domain/models/exp/TransportICCard';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/TRANSACTION_ADV_SEARCH/STATUS_LIST/SET',
  CLEAR: 'MODULES/EXPENSE/UI/TRANSACTION_ADV_SEARCH/STATUS_LIST/CLEAR',
};

export const getStatusText = (status: string): string => {
  const key = STATUS_MAP[status];
  return msg()[key];
};

export const statusOptions = (): Option[] =>
  Object.keys(STATUS_MAP).map((key) => {
    const msgKey = STATUS_MAP[key];
    const label = msg()[msgKey];
    return { value: key, label };
  });

type StatusList = Array<string>;

type SetAction = {
  type: string;
  payload: StatusList;
};

type ClearAction = {
  type: string;
};

export const actions = {
  set: (status: StatusList): SetAction => ({
    type: ACTIONS.SET,
    payload: status,
  }),
  clear: (): ClearAction => ({
    type: ACTIONS.CLEAR,
  }),
};

export const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<StatusList, any>;
