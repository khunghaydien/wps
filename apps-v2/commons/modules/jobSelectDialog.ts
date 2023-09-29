type ShowDialogAction = {
  type: 'SHOW_JOB_SELECT_DIALOG';
};

/**
 * Creates an action to show the dialog of the Job Select Dialog.
 * @return {ShowDialogAction}
 */
export const show = (): ShowDialogAction => ({
  type: 'SHOW_JOB_SELECT_DIALOG',
});

type HideDialogAction = {
  type: 'HIDE_JOB_SELECT_DIALOG';
};

/**
 * Creates an action to hide the dialog of the Job Select Dialog.
 * @return {HideDialogAction}
 */
export const hide = (): HideDialogAction => ({
  type: 'HIDE_JOB_SELECT_DIALOG',
});

type State = {
  isVisible: boolean;
};

const initialState: State = {
  isVisible: false,
};

type Action = ShowDialogAction | HideDialogAction;

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'SHOW_JOB_SELECT_DIALOG':
      return {
        ...state,
        isVisible: true,
      };
    case 'HIDE_JOB_SELECT_DIALOG':
      return {
        ...state,
        isVisible: false,
      };

    default:
      return state;
  }
};
