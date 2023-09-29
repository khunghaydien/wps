import { Reducer } from 'redux';

import { OptionProps as Option } from '../../../../../commons/components/fields/SearchableDropdown';

import {
  getRequestTypes,
  RequestTypeList,
} from '../../../../../domain/models/exp/CustomRequest';

import { AppDispatch } from '../../AppThunk';

export const ACTIONS = {
  GET_SUCCESS:
    'MODULES/EXPENSE/ENTITIES/ADV_SEARCH/CUSTOM_REQUEST_TYPE_LIST/GET_SUCESS',
};

export type RequestTypeOptionList = Array<Option>;

const getSuccess = (body: RequestTypeOptionList) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

const convertStyle = (
  requestTypeList: RequestTypeList
): RequestTypeOptionList =>
  requestTypeList.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

type Action = {
  payload: RequestTypeOptionList;
  type: string;
};

export const actions = {
  get:
    () =>
    async (dispatch: AppDispatch): Promise<Action> => {
      return getRequestTypes()
        .then((res) => {
          const options = convertStyle(res);
          return dispatch(getSuccess(options));
        })
        .catch((err) => {
          throw err;
        });
    },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<RequestTypeList, any>;
