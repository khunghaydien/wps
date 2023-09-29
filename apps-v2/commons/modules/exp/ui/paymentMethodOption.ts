export type PaymentMethodOptionList = {
  text: string;
  value: string;
}[];

type Set = {
  type: typeof ACTIONS.SET;
  payload: PaymentMethodOptionList;
};

export const ACTIONS = {
  SET: 'MODULES/EXP/UI/PAYMENT_METHOD_OPTION/SET',
} as const;

export const actions = {
  set: (optionList: PaymentMethodOptionList) => ({
    type: ACTIONS.SET,
    payload: optionList,
  }),
};

const initialState = [];

export default (state = initialState, action: Set): PaymentMethodOptionList => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
};
