import { $PropertyType } from 'utility-types';

import { Record } from '../../../../../../../domain/models/exp/Record';

import { ACTIONS as ENTITIES_RECORD_LIST_ACTIONS } from '../../../../entities/recordList';

type State = {
  selectedIds: string[];
  flagsById: {
    [key: string]: boolean;
  };
};

const initialState: State = {
  selectedIds: [],
  flagsById: {},
};

const ACTIONS = {
  TOGGLE: 'MOBILE-APP/MODULES/EXPENSE/UI/RECORD/LIST/SELECT/TOGGLE',
  CLEAR: 'MOBILE-APP/MODULES/EXPENSE/UI/RECORD/LIST/SELECT/CLEAR',
};

export const actions = {
  toggle: (id: string, isSingleLink: boolean) => ({
    type: ACTIONS.TOGGLE,
    payload: { id, isSingleLink },
  }),
  fetchSuccess: (recordList: Record[]) => ({
    type: ENTITIES_RECORD_LIST_ACTIONS.LIST_SUCCESS,
    payload: recordList,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const getStateByIds = (ids: $PropertyType<State, 'selectedIds'>): State => ({
  selectedIds: [...ids],
  flagsById: ids.reduce((obj, id) => {
    obj[id] = true;
    return obj;
  }, {}),
});

const getStateByFlags = (flags: $PropertyType<State, 'flagsById'>): State => ({
  selectedIds: Object.keys(flags).filter((id) => flags[id]),
  flagsById: { ...flags },
});

export default (state: State = initialState, action: any): State => {
  const { type, payload } = action;
  switch (type) {
    case ENTITIES_RECORD_LIST_ACTIONS.LIST_SUCCESS: {
      const { selectedIds } = state;
      const newSelectedIds = selectedIds.filter((id) =>
        payload.find(({ recordId }: Record) => recordId && recordId === id)
      );
      return getStateByIds(newSelectedIds);
    }
    case ACTIONS.TOGGLE: {
      const { id, isSingleLink } = payload;
      // This is for temporary single link of existing record. Remove when multiple record linkage is
      if (isSingleLink) {
        const isChecked = state.flagsById[id];
        return {
          selectedIds: isChecked ? [] : [id],
          flagsById: { [id]: !isChecked },
        };
      }
      const flagsById = {
        ...state.flagsById,
        [id]: !state.flagsById[id],
      };
      return getStateByFlags(flagsById);
    }
    case ACTIONS.CLEAR: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};
