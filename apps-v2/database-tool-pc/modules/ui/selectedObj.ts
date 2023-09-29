import { Reducer } from 'redux';

export type State = {
  objKey: string;
  sqlList: string;
  searchCondition: string;
  sortCondition: string;
  isDeletedIncludedChecked: boolean;
  isDisplayRecord: boolean;
  isHighlightRefItem: boolean;
};

const ACTIONS = {
  SET_SELECTED_OBJECT_KEY:
    'MODULES/UI/DB_TOOL/SELECTEDOBJ/SET_SELECTED_OBJECT_KEY',
  SET_SQL_QUERY: 'MODULES/UI/DB_TOOL/SELECTEDOBJ/SET_SQL_QUERY',
  SET_RECORD_DISPLAY: 'MODULES/UI/DB_TOOL/SELECTEDOBJ/SET_RECORD_DISPLAY',
  SET_IS_HIGHLIGHT_REF_ITEM:
    'MODULES/UI/DB_TOOL/SELECTEDOBJ/SET_IS_HIGHLIGHT_REF_ITEM',
  SET_DELETED_CHECKED: 'MODULES/UI/DB_TOOL/SELECTEDOBJ/SET_DELETED_CHECKED',
  SET_SEARCH_CONDITION: 'MODULES/UI/DB_TOOL/SELECTEDOBJ/SET_SEARCH_CONDITION',
  SET_SORT_CONDITION: 'MODULES/UI/DB_TOOL/SELECTEDOBJ/SET_SORT_CONDITION',
};

export const actions = {
  setSelectedObjKey: (sObjKey: string) => ({
    type: ACTIONS.SET_SELECTED_OBJECT_KEY,
    payload: sObjKey,
  }),
  setSqlList: (sqlList: Array<string>) => ({
    type: ACTIONS.SET_SQL_QUERY,
    payload: sqlList,
  }),
  setRecordDisplay: (isDisplay: boolean) => ({
    type: ACTIONS.SET_RECORD_DISPLAY,
    payload: isDisplay,
  }),
  setHighlightRefItem: (isHighlight: boolean) => ({
    type: ACTIONS.SET_IS_HIGHLIGHT_REF_ITEM,
    payload: isHighlight,
  }),
  setDeletedChecked: (isDeletedIncluded: boolean) => ({
    type: ACTIONS.SET_DELETED_CHECKED,
    payload: isDeletedIncluded,
  }),
  setSearchCondition: (where: string) => ({
    type: ACTIONS.SET_SEARCH_CONDITION,
    payload: where,
  }),
  setSortCondition: (sort: string) => ({
    type: ACTIONS.SET_SORT_CONDITION,
    payload: sort,
  }),
};

const initialState: State = {
  objKey: '',
  sqlList: '',
  searchCondition: '',
  sortCondition: '',
  isDeletedIncludedChecked: false,
  isDisplayRecord: false,
  isHighlightRefItem: false,
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SELECTED_OBJECT_KEY:
      return { ...state, objKey: action.payload };
    case ACTIONS.SET_SQL_QUERY:
      return {
        ...state,
        sqlList: action.payload,
      };
    case ACTIONS.SET_SEARCH_CONDITION:
      return { ...state, searchCondition: action.payload };
    case ACTIONS.SET_SORT_CONDITION:
      return { ...state, sortCondition: action.payload };
    case ACTIONS.SET_RECORD_DISPLAY:
      return {
        ...state,
        isDisplayRecord: action.payload,
      };
    case ACTIONS.SET_IS_HIGHLIGHT_REF_ITEM:
      return { ...state, isHighlightRefItem: action.payload };
    case ACTIONS.SET_DELETED_CHECKED:
      return { ...state, isDeletedIncludedChecked: action.payload };
    default:
      return state;
  }
}) as Reducer<State, any>;
