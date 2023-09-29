import { Reducer } from 'redux';

const SELECT = 'MODULES/UI/TABS/SELECT';

export type Tab = string;

type InitialState = {
  selected: Tab;
};

type SelectAction = {
  payload: Tab;
  type: string;
};

export const constants = {
  SELECT,
};

export const TABS = {
  EXPENSES: 'EXPENSES',
  REQUESTS: 'REQUESTS',
};

export const isRequestTab = (tab: Tab): boolean => tab === TABS.REQUESTS;

export const selectTab = (tab: Tab): SelectAction => {
  return {
    type: SELECT,
    payload: tab,
  };
};

const initialState = {
  selected: TABS.EXPENSES,
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case SELECT:
      return { selected: action.payload };
    default:
      return state;
  }
}) as Reducer<InitialState>;
