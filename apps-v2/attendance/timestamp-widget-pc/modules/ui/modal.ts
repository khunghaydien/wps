type State = {
  insufficientRestTime: number;
  isShowModal: boolean;
};

export const initialState: State = {
  insufficientRestTime: 0,
  isShowModal: false,
};

// Actions

type ShowModal = {
  type: 'TIMESTAMP_WIDGET_SHOW_MODAL';
  payload: {
    insufficientRestTime: number;
  };
};

type CloseModal = {
  type: 'TIMESTAMP_WIDGET_CLOSE_MODAL';
};

type Action = ShowModal | CloseModal;

export const SHOW_MODAL: ShowModal['type'] = 'TIMESTAMP_WIDGET_SHOW_MODAL';

export const CLOSE_MODAL: CloseModal['type'] = 'TIMESTAMP_WIDGET_CLOSE_MODAL';

export const actions = {
  showModal: (insufficientRestTime: number) => ({
    type: SHOW_MODAL,
    payload: {
      insufficientRestTime,
    },
  }),
  closeModal: () => ({
    type: CLOSE_MODAL,
  }),
};

// Reducer

export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        insufficientRestTime: action.payload.insufficientRestTime,
        isShowModal: true,
      };
    case CLOSE_MODAL:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
