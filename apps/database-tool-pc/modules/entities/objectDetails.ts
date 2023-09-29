import { Reducer } from 'redux';

import { loadingEnd, loadingStart } from '../../../commons/actions/app';

import { getObjectDetail, sObjDetail } from '../../models/ObjectDetail';

import { AppDispatch } from '../AppThunk';

type State = { string: sObjDetail };

const ACTIONS = {
  SET_DETAIL: 'MODULES/ENTITIES/DB_TOOL/OBJECT_DETAILS/SET_DETAIL',
};

const setObjDetail = (sObjKey: string, objDetail: sObjDetail) => ({
  type: ACTIONS.SET_DETAIL,
  payload: { [sObjKey]: objDetail },
});

export const fetchObjDetail =
  (sObjKey: string) =>
  (dispatch: AppDispatch): Promise<any> => {
    dispatch(loadingStart());
    return getObjectDetail(sObjKey).then((res: sObjDetail) => {
      dispatch(loadingEnd());
      dispatch(setObjDetail(sObjKey, res));
      return res;
    });
  };

const initialState = {} as State;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_DETAIL:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}) as Reducer<State, any>;
