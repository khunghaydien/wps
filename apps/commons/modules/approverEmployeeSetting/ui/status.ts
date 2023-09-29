type State = {
  isReadOnly: boolean;
  targetDate: string;
};

const ACTIONS = {
  SET_READ_ONLY: 'COMMONS/APPROVER_EMPLOYEE_SETTING/UI/STATUS/SET_READ_ONLY',
  SET_SET_TARGET_DATE:
    'COMMONS/APPROVER_EMPLOYEE_SETTING/UI/STATUS/SET_SET_TARGET_DATE',
};

export const actions = {
  setReadOnly: (isReadOnly: boolean) => ({
    type: ACTIONS.SET_READ_ONLY,
    payload: isReadOnly,
  }),
  setTargetDate: (targetDate: string) => ({
    type: ACTIONS.SET_SET_TARGET_DATE,
    payload: targetDate,
  }),
};

const initialState: State = {
  isReadOnly: true,
  targetDate: '',
};

export default function reducer(
  state: State = initialState,
  action: any
): State {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.SET_READ_ONLY:
      return {
        ...state,
        isReadOnly: payload,
      };
    case ACTIONS.SET_SET_TARGET_DATE:
      return {
        ...state,
        targetDate: payload,
      };
    default:
      return state;
  }
}
