export const initialState = false;

// Actions
type Show = { type: 'ADMIN-PC-V2/MODULES/EMPLOYEE/UI/POSITION_DIALOG/SHOW' };
type Hide = { type: 'ADMIN-PC-V2/MODULES/EMPLOYEE/UI/POSITION_DIALOG/HIDE' };

type Action = Show | Hide;

export const SHOW: Show['type'] =
  'ADMIN-PC-V2/MODULES/EMPLOYEE/UI/POSITION_DIALOG/SHOW';

export const HIDE: Hide['type'] =
  'ADMIN-PC-V2/MODULES/EMPLOYEE/UI/POSITION_DIALOG/HIDE';

export const actions = {
  show: () => ({ type: SHOW }),
  hide: () => ({ type: HIDE }),
};

// Reducer
export default (state: boolean = initialState, action: Action): boolean => {
  switch (action.type) {
    case SHOW:
      return true;
    case HIDE:
      return false;
    default:
      return state;
  }
};
