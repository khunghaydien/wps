import { Dispatch } from 'redux';

import {
  getRole,
  initialStateRole,
  Role,
} from '../../../domain/models/psa/Role';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/ENTITIES/PSA/ROLE/GET_SUCCESS',
};

const getSuccess = (body: Role) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

export const actions = {
  get:
    (roleId: string) =>
    (dispatch: Dispatch): void | any =>
      getRole(roleId)
        .then((role: Role) => {
          role.assignment = role.assignments[0];
          dispatch(getSuccess(role));
          return role;
        })
        .catch((err) => {
          throw err;
        }),
};
const initialState = {
  role: initialStateRole,
};

type State = {
  role: Role;
};

export default (state: State = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return {
        role: action.payload,
      };

    default:
      return state;
  }
};
