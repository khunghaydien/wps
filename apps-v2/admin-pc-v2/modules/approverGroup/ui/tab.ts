import { APPROVER_MODULES } from '@admin-pc-v2/models/approverGroup';

const modulesList = Object.keys(APPROVER_MODULES);

type State = typeof modulesList[number];

type Select = {
  type: typeof ACTIONS.SELECT;
  payload: State;
};

type Reset = {
  type: typeof ACTIONS.RESET;
};

type Actions = Select | Reset;

const ACTIONS = {
  SELECT: 'ADMIN-PC-V2/MODULES/APPROVER_GROUP/UI/TAB/SELECT',
  RESET: 'ADMIN-PC-V2/MODULES/APPROVER_GROUP/UI/TAB/RESET',
};

export const actions = {
  select: (selectedKey: string): Select => ({
    type: ACTIONS.SELECT,
    payload: selectedKey,
  }),
  reset: (): Reset => ({ type: ACTIONS.RESET }),
};

const initialState = modulesList[0];

export default (state = initialState, action: Actions): State => {
  switch (action.type) {
    case ACTIONS.SELECT:
      return (action as Select).payload;
    case ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
};
