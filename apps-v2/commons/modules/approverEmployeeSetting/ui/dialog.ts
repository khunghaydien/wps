import { DialogType } from '../../approverEmployeeSearch/ui/dialog';

type State = {
  isOpen: boolean;
  type: DialogType;
};

const ACTIONS = {
  OPEN: 'COMMONS/APPROVER_EMPLOYEE_SETTING/UI/DIALOG/OPEN',
  CLOSE: 'COMMONS/APPROVER_EMPLOYEE_SETTING/UI/DIALOG/CLOSE',
};

export const actions = {
  open: (type: DialogType) => ({ type: ACTIONS.OPEN, payload: { type } }),
  close: () => ({ type: ACTIONS.CLOSE }),
};

const initialState: State = {
  isOpen: false,
  type: '',
};

export default function reducer(
  state: State = initialState,
  action: any
): State {
  switch (action.type) {
    case ACTIONS.OPEN:
      return {
        isOpen: true,
        type: action.payload.type,
      };
    case ACTIONS.CLOSE:
      return {
        isOpen: false,
        type: '',
      };
    default:
      return state;
  }
}
