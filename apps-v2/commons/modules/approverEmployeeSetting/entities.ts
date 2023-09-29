import { ApproverEmployee } from '../../../domain/models/approval/ApproverEmployee';

// 将来的に複数の承認者や複数のステップに対応できるようにする
type State = ApproverEmployee;

type Action = {
  type: string;
  payload: State;
};

const ACTIONS = {
  SET: 'COMMONS/APPROVAL_EMPLOYEE_SETTING/ENTITIES/SET',
};

export const actions = {
  set: (setting: State) => ({
    type: ACTIONS.SET,
    payload: setting,
  }),
};

const initialState: State = {
  id: '',
  employeeName: '',
};

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.SET:
      return payload;
    default:
      return state;
  }
}
