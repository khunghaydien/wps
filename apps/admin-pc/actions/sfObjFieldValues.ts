import { loadingEnd, loadingStart } from '../../commons/actions/app';

export const GET_SF_OBJ_FIELD_VALUES = 'GET_SF_OBJ_FIELD_VALUES';
export const GET_SF_OBJ_FIELD_VALUES_ERROR = 'GET_SF_OBJ_FIELD_VALUES_ERROR';

function getSFObjFieldValuesSuccess(param, result) {
  return {
    type: GET_SF_OBJ_FIELD_VALUES,
    payload: { param, result },
  };
}

function getSFObjFieldValuesError(param?, result?) {
  return {
    type: GET_SF_OBJ_FIELD_VALUES,
    payload: { param, result },
  };
}

export function getSFObjFieldValues(param) {
  const requests = param.map((item) => {
    return { path: item.path };
  });
  const req = { path: '/batch', param: { requests } };
  return (dispatch, getState) => {
    dispatch(loadingStart());
    const state = getState();
    return state.env.api.adminCommon.apiConnector(state, req).then((result) => {
      dispatch(loadingEnd());
      if (result.isSuccess) {
        dispatch(getSFObjFieldValuesSuccess(param, result));
      } else {
        dispatch(getSFObjFieldValuesError());
      }
    });
  };
}
