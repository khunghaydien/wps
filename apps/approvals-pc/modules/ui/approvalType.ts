import ApprovalType, {
  ApprovalTypeValue,
} from '../../../domain/models/approval/ApprovalType';

type State = ApprovalTypeValue;

const ACTIONS = {
  SWITCH: 'MODULES/UI/APPROVER_TYPE/SWITCH',
  RESET: 'MODULES/UI/APPROVER_TYPE/RESET',
};

type SwitchAction = {
  type: 'MODULES/UI/APPROVER_TYPE/SWITCH';
  payload: ApprovalTypeValue;
};

type ResetAction = {
  type: 'MODULES/UI/APPROVER_TYPE/RESET';
};

export const actions = {
  switch: (type: ApprovalTypeValue) => ({
    type: ACTIONS.SWITCH,
    payload: type,
  }),

  reset: () => ({
    type: ACTIONS.RESET,
  }),
};

type Action = SwitchAction | ResetAction;

const initialState: State = ApprovalType.ByEmployee;

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTIONS.SWITCH:
      return (action as SwitchAction).payload;

    case ACTIONS.RESET:
      return initialState;

    default:
      return state;
  }
};
