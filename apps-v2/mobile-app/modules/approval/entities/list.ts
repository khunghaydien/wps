import {
  ApprRequest,
  ApprRequestList,
  REQUEST_TYPE,
  RequestType,
} from '@apps/domain/models/approval/request/Request';

export const CHECKED_MAX = 100;

export type FilterType = 'all' | RequestType;

type Options = {
  canBulkApproveAttDailyRequest;
  canBulkApproveAttRequest;
};

export type State = {
  original: ApprRequestList;
  filterType: FilterType;
  filteredList: ApprRequestList;
  targetList: ApprRequestList;
  checked: string[];
  checkedAll: boolean;
  options: Options;
};

const initialState: State = {
  filterType: 'all',
  original: [],
  filteredList: [],
  targetList: [],
  checked: [],
  checkedAll: false,
  options: {
    canBulkApproveAttDailyRequest: false,
    canBulkApproveAttRequest: false,
  },
};

const ACTION_ROOT = 'MODULES/ENTITIES/APPROVAL' as const;

const ACTION_TYPES = {
  INITIALIZE: `${ACTION_ROOT}/INITIALIZE`,
  SET_RECORDS: `${ACTION_ROOT}/SET_RECORDS`,
  SET_FILTER_TYPE: `${ACTION_ROOT}/SET_FILTER`,
  CHECK: `${ACTION_ROOT}/CHECK`,
  CHECK_ALL: `${ACTION_ROOT}/CHECK_ALL`,
  UNCHECK: `${ACTION_ROOT}/UNCHECK`,
  UNCHECK_ALL: `${ACTION_ROOT}/UNCHECK_ALL`,
  TOGGLE: `${ACTION_ROOT}/TOGGLE`,
  TOGGLE_ALL: `${ACTION_ROOT}/TOGGLE_ALL`,
} as const;

export type InitializeAction = {
  type: typeof ACTION_TYPES.INITIALIZE;
  payload: Options;
};

export type SetRecordsAction = {
  type: typeof ACTION_TYPES.SET_RECORDS;
  payload: ApprRequestList;
};

export type SetFilterTypeAction = {
  type: typeof ACTION_TYPES.SET_FILTER_TYPE;
  payload: FilterType;
};

export type CheckAction = {
  type: typeof ACTION_TYPES.CHECK;
  payload: string[];
};

export type CheckAllAction = {
  type: typeof ACTION_TYPES.CHECK_ALL;
};

export type UncheckAction = {
  type: typeof ACTION_TYPES.UNCHECK;
  payload: string[];
};

export type UncheckAllAction = {
  type: typeof ACTION_TYPES.UNCHECK_ALL;
};

export type ToggleAction = {
  type: typeof ACTION_TYPES.TOGGLE;
  payload: string[];
};

export type ToggleAllAction = {
  type: typeof ACTION_TYPES.TOGGLE_ALL;
};

export const initialize = (options: Options): InitializeAction => ({
  type: ACTION_TYPES.INITIALIZE,
  payload: options,
});

export const setRecords = (list: ApprRequestList): SetRecordsAction => ({
  type: ACTION_TYPES.SET_RECORDS,
  payload: list,
});

export const setFilterType = (selection: FilterType): SetFilterTypeAction => ({
  type: ACTION_TYPES.SET_FILTER_TYPE,
  payload: selection,
});

export const check = (...id: string[]): CheckAction => ({
  type: ACTION_TYPES.CHECK,
  payload: id,
});

export const uncheck = (...id: string[]): UncheckAction => ({
  type: ACTION_TYPES.UNCHECK,
  payload: id,
});

export const checkAll = (): CheckAllAction => ({
  type: ACTION_TYPES.CHECK_ALL,
});

export const uncheckAll = (): UncheckAllAction => ({
  type: ACTION_TYPES.UNCHECK_ALL,
});

export const toggle = (...id: string[]): ToggleAction => ({
  type: ACTION_TYPES.TOGGLE,
  payload: id,
});

export const toggleAll = (): ToggleAllAction => ({
  type: ACTION_TYPES.TOGGLE_ALL,
});

export type Actions =
  | InitializeAction
  | SetRecordsAction
  | SetFilterTypeAction
  | CheckAction
  | CheckAllAction
  | UncheckAction
  | UncheckAllAction
  | ToggleAction
  | ToggleAllAction;

const filterByType = (records: ApprRequestList, filterType: FilterType) =>
  filterType === 'all'
    ? records
    : records.filter((record) => record.requestType === filterType);

const isCanUseChecked = (
  { requestType }: ApprRequest,
  { canBulkApproveAttDailyRequest, canBulkApproveAttRequest }: Options
) =>
  (requestType === REQUEST_TYPE.ATTENDANCE_DAILY &&
    canBulkApproveAttDailyRequest) ||
  (requestType === REQUEST_TYPE.ATTENDANCE_FIX && canBulkApproveAttRequest);

const isCheckedAll = ({
  checked,
  targetList,
}: {
  checked: string[];
  targetList: ApprRequestList;
}) =>
  CHECKED_MAX <= checked.length ||
  !!(
    targetList.length &&
    targetList.every(({ requestId }) => checked.includes(requestId))
  );

export default (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case ACTION_TYPES.INITIALIZE: {
      return {
        original: [],
        filterType: 'all',
        filteredList: [],
        targetList: [],
        checked: [],
        checkedAll: false,
        options: action.payload,
      };
    }
    case ACTION_TYPES.SET_RECORDS: {
      const { filterType, options, checked: $checked } = state;
      const original = action.payload;
      const filteredList = filterByType(original, filterType);
      const targetList = filteredList.filter((record) =>
        isCanUseChecked(record, options)
      );
      const checked = [...$checked]
        .filter((id) => targetList.find(({ requestId }) => requestId === id))
        .splice(0, CHECKED_MAX);
      const checkedAll = isCheckedAll({
        checked,
        targetList,
      });

      return {
        ...state,
        original,
        filterType,
        filteredList,
        targetList,
        checked,
        checkedAll,
      };
    }
    case ACTION_TYPES.SET_FILTER_TYPE: {
      const { original, options } = state;
      const filterType = action.payload;
      const filteredList = filterByType(original, filterType);
      const targetList = filteredList.filter((record) =>
        isCanUseChecked(record, options)
      );
      const checked = [];
      return {
        ...state,
        filterType,
        filteredList,
        targetList,
        checked,
        checkedAll: false,
      };
    }
    case ACTION_TYPES.CHECK: {
      const { checked: $checked, targetList } = state;
      const checked = []
        .concat($checked, action.payload)
        .filter((id, idx, arr) => arr.indexOf(id) === idx)
        .filter((id) => targetList.find(({ requestId }) => requestId === id))
        .splice(0, CHECKED_MAX);
      const checkedAll = isCheckedAll({
        checked,
        targetList,
      });
      return {
        ...state,
        checked,
        checkedAll,
      };
    }
    case ACTION_TYPES.UNCHECK: {
      const { checked: $checked, targetList } = state;
      const ids = [].concat(action.payload);
      const checked = $checked
        .filter((id) => !ids.includes(id))
        .filter((id, idx, arr) => arr.indexOf(id) === idx)
        .filter((id) => targetList.find(({ requestId }) => requestId === id));
      const checkedAll = isCheckedAll({
        checked,
        targetList,
      });
      return {
        ...state,
        checked,
        checkedAll,
      };
    }
    case ACTION_TYPES.CHECK_ALL: {
      const { targetList } = state;
      return {
        ...state,
        checked: targetList
          .map(({ requestId }) => requestId)
          .splice(0, CHECKED_MAX),
        checkedAll: true,
      };
    }
    case ACTION_TYPES.UNCHECK_ALL: {
      return {
        ...state,
        checked: [],
        checkedAll: false,
      };
    }
    case ACTION_TYPES.TOGGLE: {
      const ids = action.payload;
      const { targetList, checked: $checked } = state;
      const checked = []
        .concat($checked, ids)
        .filter((id) => !$checked.includes(id) || !ids.includes(id))
        .filter((id) => targetList.find(({ requestId }) => requestId === id))
        .splice(0, CHECKED_MAX);
      const checkedAll = isCheckedAll({
        checked,
        targetList,
      });
      return {
        ...state,
        checked,
        checkedAll,
      };
    }
    case ACTION_TYPES.TOGGLE_ALL: {
      const { targetList, checked } = state;
      const checkedAll =
        CHECKED_MAX <= checked.length ||
        (targetList.length &&
          targetList.every(({ requestId }) => checked.includes(requestId)));

      if (checkedAll) {
        return {
          ...state,
          checked: [],
          checkedAll: false,
        };
      } else {
        return {
          ...state,
          checked: targetList
            .map(({ requestId }) => requestId)
            .splice(0, CHECKED_MAX),
          checkedAll: true,
        };
      }
    }
    default:
      return state;
  }
};
