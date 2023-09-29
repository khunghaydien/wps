import { Reducer } from 'redux';

import { cloneDeep, filter, isEmpty, sortBy } from 'lodash';

import { catchApiError } from '@apps/commons/actions/app';

import {
  Repository,
  SearchQuery,
  Vendor,
  VendorList,
} from '@apps/domain/models/exp/Vendor';

import { AppDispatch } from '@apps/requests-pc/modules/AppThunk';

export const ACTIONS = {
  FETCH_LIST: 'MODULES/UI/EXPENSES/DIALOG/VENDOR/PERSONAL_LIST/FETCH_LIST',
  CLEAR: 'MODULES/UI/EXPENSES/DIALOG/VENDOR/PERSONAL_LIST/CLEAR',
  ADD: 'MODULES/UI/EXPENSES/DIALOG/VENDOR/PERSONAL_LIST/ADD',
  UPDATE: 'MODULES/UI/EXPENSES/DIALOG/VENDOR/PERSONAL_LIST/UPDATE',
  REMOVE: 'MODULES/UI/EXPENSES/DIALOG/VENDOR/PERSONAL_LIST/REMOVE',
  REVERT: 'MODULES/UI/EXPENSES/DIALOG/VENDOR/PERSONAL_LIST/REVERT',
  DELETE: 'MODULES/UI/EXPENSES/DIALOG/VENDOR/PERSONAL_LIST/DELETE',
  TOGGLE: 'MODULES/UI/EXPENSES/DIALOG/VENDOR/PERSONAL_LIST/TOGGLE',
};

type State = {
  isInvalidDisplay: boolean;
  list: VendorList;
  removed: VendorList;
};

const initialState = {
  list: null,
  removed: [],
  isInvalidDisplay: false,
};

const set = (items: VendorList) => ({
  type: ACTIONS.FETCH_LIST,
  payload: items,
});

const removeItem = (item: Vendor) => ({
  type: ACTIONS.REMOVE,
  payload: item,
});

const deleteItem = (id: string) => ({
  type: ACTIONS.DELETE,
  payload: id,
});

export const actions = {
  add: (item: Vendor) => ({
    type: ACTIONS.ADD,
    payload: item,
  }),
  update: (item: Vendor) => ({
    type: ACTIONS.UPDATE,
    payload: item,
  }),
  remove: (item: Vendor) => async (dispatch: AppDispatch) => {
    dispatch(removeItem(item));
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(deleteItem(item.id));
        resolve();
      }, 4000);
    });
  },
  revert: (item: Vendor) => ({
    type: ACTIONS.REVERT,
    payload: item.id,
  }),
  get:
    (param: SearchQuery) =>
    (dispatch: AppDispatch): Promise<void> => {
      return Repository.searchIds(param)
        .then(({ ids }: { ids: string[] }) => {
          if (!isEmpty(ids)) {
            return Repository.getRecords(ids)
              .then((res: VendorList) => {
                dispatch(set(res));
              })
              .catch((err) => {
                dispatch(catchApiError(err, { isContinuable: true }));
              });
          }
          dispatch(set([]));
        })
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
  delete:
    (id) =>
    (dispatch: AppDispatch): void => {
      dispatch(deleteItem(id));
    },
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
  toggle: (isChecked: boolean) => ({
    type: ACTIONS.TOGGLE,
    payload: isChecked,
  }),
};

const orderList = (list) =>
  sortBy(list, [(o) => o.code.toLowerCase()], ['asc']);

export default ((state = initialState, action) => {
  let copyList = [];
  switch (action.type) {
    case ACTIONS.FETCH_LIST:
      const list = action.payload;
      return { ...state, list };
    case ACTIONS.CLEAR:
      return initialState;
    case ACTIONS.ADD:
      copyList = [...state.list, action.payload];
      return { ...state, list: orderList(copyList) };
    case ACTIONS.UPDATE:
      const idx = state.list.findIndex((v) => v.id === action.payload.id);
      copyList = cloneDeep(state.list);
      copyList.splice(idx, 1, action.payload);
      return { ...state, list: orderList(copyList) };
    case ACTIONS.REMOVE:
      const removed = [...state.removed, action.payload];
      copyList = filter(state.list, (o) => o.id !== action.payload.id);
      return { ...state, removed, list: copyList };
    case ACTIONS.DELETE:
    case ACTIONS.REVERT:
      copyList = filter(state.removed, (o) => o.id !== action.payload);
      return { ...state, removed: copyList };
    case ACTIONS.TOGGLE:
      return {
        ...state,
        isInvalidDisplay: action.payload,
      };
    default:
      return state;
  }
}) as Reducer<State, any>;
