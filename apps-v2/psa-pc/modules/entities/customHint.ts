import { Dispatch, Reducer } from 'redux';

import { CustomHint, getCustomHint } from '@apps/domain/models/psa/CustomHint';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/ENTITIES/CUSTOM_HINT/GET',
};

const getSuccess = (body: CustomHint) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

export const actions = {
  get:
    (companyId: string) =>
    (dispatch: Dispatch): Promise<{ payload: CustomHint; type: string }> => {
      return getCustomHint(companyId, 'Project')
        .then((res: CustomHint) => dispatch(getSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
};

const initialState = {};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<CustomHint, any>;
