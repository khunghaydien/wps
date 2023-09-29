import { Department } from '../../../../domain/models/organization/Department';

// State

export type Item = Department & {
  isGroup: boolean;
};

export type ItemList = Item | ItemList[];

export type State = {
  itemLists: ItemList[];
  isOpenedDialog: boolean;
  selectedDepartment: Department | null;
};

const initialState: State = {
  itemLists: [],
  isOpenedDialog: false,
  selectedDepartment: null,
};

// Actions

type SearchSuccess = {
  type: '/APPS/TEAM-PC/MODULES/UI/ATTREQUESTSTATUS/SEARCH_SUCCESS';
  payload: ItemList[];
};

type OpenDialog = {
  type: '/APPS/TEAM-PC/MODULES/UI/ATTREQUESTSTATUS/OPEN_DIALOG';
};

type CloseDialog = {
  type: '/APPS/TEAM-PC/MODULES/UI/ATTREQUESTSTATUS/CLOSE_DIALOG';
};

type Select = {
  type: '/APPS/TEAM-PC/MODULES/UI/ATTREQUESTSTATUS/SELECT';
  payload: Department;
};

type Action = SearchSuccess | OpenDialog | CloseDialog | Select;

const SEARCH_SUCCESS: SearchSuccess['type'] =
  '/APPS/TEAM-PC/MODULES/UI/ATTREQUESTSTATUS/SEARCH_SUCCESS';
const OPEN_DIALOG: OpenDialog['type'] =
  '/APPS/TEAM-PC/MODULES/UI/ATTREQUESTSTATUS/OPEN_DIALOG';
const CLOSE_DIALOG: CloseDialog['type'] =
  '/APPS/TEAM-PC/MODULES/UI/ATTREQUESTSTATUS/CLOSE_DIALOG';
const SELECT: Select['type'] =
  '/APPS/TEAM-PC/MODULES/UI/ATTREQUESTSTATUS/SELECT';

export const actions = {
  searchSuccess: (departments: ItemList[]) => ({
    type: SEARCH_SUCCESS,
    payload: departments,
  }),

  openDialog: (): OpenDialog => ({
    type: OPEN_DIALOG,
  }),

  closeDialog: (): CloseDialog => ({
    type: CLOSE_DIALOG,
  }),

  select: (item: Item) => ({
    type: SELECT,
    payload: item,
  }),
};

// Reducers

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SEARCH_SUCCESS: {
      return { ...state, itemLists: [...action.payload] };
    }

    case OPEN_DIALOG: {
      return {
        ...state,
        isOpenedDialog: true,
      };
    }

    case CLOSE_DIALOG: {
      return {
        ...state,
        isOpenedDialog: false,
      };
    }

    case SELECT: {
      return {
        ...state,
        selectedDepartment: action.payload,
      };
    }

    default:
      return state;
  }
};
