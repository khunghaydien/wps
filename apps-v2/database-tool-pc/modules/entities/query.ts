import { Reducer } from 'redux';

import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import merge from 'lodash/merge';
import { $Shape } from 'utility-types';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';

import {
  deleteQueryTemplate,
  getQueryTemplate,
  QueryTemplate,
  saveQueryTemplate,
} from '../../models/Query';

import { AppDispatch } from '../AppThunk';
import { setDeleteDialog, setSaveDialog, setSelectedId } from '../ui/query';
import { actions as selectedObjAction } from '../ui/selectedObj';

type Query = $Shape<QueryTemplate>;
type State = {
  templateList: Array<Query>;
  isFetched: boolean;
};

const ACTIONS = {
  SET_QUERYS: 'MODULES/ENTITIES/DB_TOOL/QUERY/SET_QUERYS',
  DELETE_QUERY: 'MODULES/ENTITIES/DB_TOOL/QUERY/DELETE_QUERY',
  INSERT_QUERY: 'MODULES/ENTITIES/DB_TOOL/QUERY/INSERT_QUERY',
  UPDATE_QUERY: 'MODULES/ENTITIES/DB_TOOL/QUERY/UPDATE_QUERY',
};

const setQuerys = (querys: Array<Query>) => ({
  type: ACTIONS.SET_QUERYS,
  payload: querys,
});

const deleteQuery = (id: string) => ({
  type: ACTIONS.DELETE_QUERY,
  payload: id,
});

const insertQuery = (query: Query) => ({
  type: ACTIONS.INSERT_QUERY,
  payload: query,
});

const updateQuery = (query: Query) => ({
  type: ACTIONS.UPDATE_QUERY,
  payload: query,
});

export const actions = {
  fetchQuery:
    (companyId: string) =>
    (dispatch: AppDispatch): Promise<any> => {
      dispatch(loadingStart());
      return getQueryTemplate(companyId)
        .then((res: Array<Query>) => {
          dispatch(loadingEnd());
          dispatch(setQuerys(res));
        })
        .catch((err: Error) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
  deleteQuery:
    (id: string, sqlList: Array<string>) =>
    (dispatch: AppDispatch): Promise<any> => {
      dispatch(loadingStart());
      return deleteQueryTemplate(id)
        .then(() => {
          dispatch(loadingEnd());
          dispatch(deleteQuery(id));
          dispatch(setDeleteDialog(false));
          dispatch(setSelectedId(''));
          dispatch(selectedObjAction.setSqlList(sqlList));
          dispatch(selectedObjAction.setSearchCondition(''));
          dispatch(selectedObjAction.setSortCondition(''));
        })
        .catch((err: Error) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
  saveQuery:
    (
      id: string,
      name: string,
      companyId: string,
      fieldsToSelect: string[],
      searchCondition?: string,
      sortCondition?: string
    ) =>
    (dispatch: AppDispatch): Promise<any> => {
      dispatch(loadingStart());
      return saveQueryTemplate(
        id,
        name,
        companyId,
        fieldsToSelect,
        searchCondition,
        sortCondition
      )
        .then((res: Record<string, any>) => {
          dispatch(loadingEnd());
          if (!id) {
            dispatch(
              insertQuery({
                id: res.id,
                sObjName: name,
                companyId,
                fieldsToSelect,
                searchCondition,
                sortCondition,
              })
            );
          } else {
            dispatch(
              updateQuery({
                id,
                sObjName: name,
                companyId,
                fieldsToSelect,
                searchCondition,
                sortCondition,
              })
            );
          }
          dispatch(setSaveDialog(false, ''));
          dispatch(setSelectedId(res.id));
        })
        .catch((err: Error) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
};

const initialState: State = {
  isFetched: false,
  templateList: [],
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_QUERYS:
      return {
        ...state,
        templateList: cloneDeep(action.payload),
        isFetched: true,
      };
    case ACTIONS.DELETE_QUERY:
      return {
        ...state,
        templateList: state.templateList.filter((q) => q.id !== action.payload),
      };
    case ACTIONS.INSERT_QUERY:
      return {
        ...state,
        templateList: [...state.templateList, action.payload],
      };
    case ACTIONS.UPDATE_QUERY:
      const copyList = cloneDeep(state.templateList);
      const selectedQuery = find(copyList, ['id', action.payload.id]);
      merge(selectedQuery, action.payload);
      return {
        ...state,
        templateList: copyList,
      };
    default:
      return state;
  }
}) as Reducer<State, any>;
