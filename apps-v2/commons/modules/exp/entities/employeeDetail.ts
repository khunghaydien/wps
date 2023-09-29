import { Dispatch, Reducer } from 'redux';

export const ACTIONS = {
  SET_DETAILS: 'COMMONS/EXP/ENTITIES/EMPLOYEE_DETAILS/SET_DETAILS',
  CLEAR: 'COMMONS/EXP/ENTITIES/EMPLOYEE_DETAILS/CLEAR',
};

const setDetails = (employeeDetails: any) => ({
  type: ACTIONS.SET_DETAILS,
  payload: employeeDetails,
});

const clear = () => ({ type: ACTIONS.CLEAR });

export const actions = {
  setDetails:
    (details: any) =>
    (dispatch: Dispatch<any>): void => {
      dispatch(setDetails(details));
    },
  clear:
    () =>
    (dispatch: Dispatch<any>): void => {
      dispatch(clear());
    },
};

export type EmployeeDetailsState = {
  details?: any;
};
const initialState = {
  details: [],
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_DETAILS:
      return { ...state, details: action.payload };
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<EmployeeDetailsState, any>;
