import { Dispatch } from 'redux';

export type Action = { type: string };
export type ThunkAction = (dispatch: Dispatch<Action>) => void | Promise<void>;

// search, get
export type QueryAction = (param?: Record<string, unknown>) => ThunkAction;

// create, update, delete
export type CommandAction = (param: Record<string, unknown>) => ThunkAction;

// CRUD
export type BaseMasterCRUDActions = {
  search: QueryAction;
  create: CommandAction;
  update: CommandAction;
  delete: CommandAction;
};

// CRUD(親子型履歴管理)
export type ParentChildTypeMasterCRUDActions = BaseMasterCRUDActions & {
  searchHistory: QueryAction;
  createHistory: CommandAction;
  updateHistory: CommandAction;
  deleteHistory: CommandAction;
};

export type AdditionalSearchAction = QueryAction;
