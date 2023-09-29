import { TabType } from '../constants/tabType';

export const SELECT_TAB = 'SELECT_TAB';

export type SelectTabAction = {
  type: 'SELECT_TAB';
  payload: TabType;
};

export function selectTab(tabType: TabType): SelectTabAction {
  return {
    type: SELECT_TAB,
    payload: tabType,
  };
}

export type Action = SelectTabAction;
