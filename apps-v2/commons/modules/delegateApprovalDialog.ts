import { Dispatch } from 'redux';

const ACTIONS = {
  NEW_ASSIGNMENT: 'DA_APPR_NEW_ASSIGNMENT',
};

type NewAssignment = {
  type: 'DA_APPR_NEW_ASSIGNMENT';
  payload: boolean;
};

const openNewAssignment = (isOpen: boolean): NewAssignment => ({
  type: 'DA_APPR_NEW_ASSIGNMENT',
  payload: isOpen,
});

type State = {
  isNewAssignment: boolean;
};

export const actions = {
  openNewAssignment: (isOpen: boolean) => (dispatch: Dispatch<any>) => {
    dispatch(openNewAssignment(isOpen));
  },
};

const initialState: State = {
  isNewAssignment: false,
};

export default (state: State = initialState, action: NewAssignment): State => {
  switch (action.type) {
    case ACTIONS.NEW_ASSIGNMENT: {
      return {
        isNewAssignment: action.payload,
      };
    }
    default:
      return state;
  }
};
