import tabType, { TabType } from '../constants/tabType';

import { Action, SELECT_TAB, SelectTabAction } from '../actions/tab';

export type State = TabType;

export default function tabReducer(
  state: State = tabType.NONE,
  action: Action
): State {
  switch (action.type) {
    case SELECT_TAB:
      return (action as SelectTabAction).payload;

    default:
      return state;
  }
}
