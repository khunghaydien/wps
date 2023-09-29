import {
  AutoHoursAllocationResult,
  calcTotalSelectedTaskTime,
  judgeModifiedOrNot,
  MATCHING_TYPE,
} from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';

type State = {
  original: { [eventId: string]: AutoHoursAllocationResult };
  editing: AutoHoursAllocationResult[];
  checkAll: boolean;
  selectedTime: number;
};

const initialState = {
  original: {},
  editing: [],
  checkAll: false,
  selectedTime: 0,
};

// Actions
const ActionType = {
  INIT: '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-RESULT-DIALOG/UI/ALLOCATE_RESULT_LIST/INIT',
  SELECT_JOB:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-RESULT-DIALOG/UI/ALLOCATE_RESULT_LIST/SELECT_JOB',
  EDIT_WORK:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-RESULT-DIALOG/UI/ALLOCATE_RESULT_LIST/EDIT_WORK',
  EDIT_TASK_TIME:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-RESULT-DIALOG/UI/ALLOCATE_RESULT_LIST/EDIT_TASK_TIME',
  TOGGLE_CHECKBOX:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-RESULT-DIALOG/UI/ALLOCATE_RESULT_LIST/TOGGLE_CHECKBOX',
  TOGGLE_CHECKALL:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-RESULT-DIALOG/UI/ALLOCATE_RESULT_LIST/TOGGLE_CHECKALL',
} as const;

type InitAllocateResultListAction = {
  type: typeof ActionType.INIT;
  payload: AutoHoursAllocationResult[];
};

type SelectAllocateResultRowJobAction = {
  type: typeof ActionType.SELECT_JOB;
  payload: {
    id: string;
    job: AutoHoursAllocationResult['job'];
  };
};

type EditAutoHoursAllocateRowWorkAction = {
  type: typeof ActionType.EDIT_WORK;
  payload: {
    id: string;
    work: AutoHoursAllocationResult['workCategory'];
  };
};

type EditAutoHoursAllocateTaskTimeAction = {
  type: typeof ActionType.EDIT_TASK_TIME;
  payload: {
    id: string;
    taskTime: number;
  };
};

type EditAutoHoursAllocateCheckboxAction = {
  type: typeof ActionType.TOGGLE_CHECKBOX;
  payload: {
    id: string;
    checkboxFlg: boolean;
  };
};

type EditAutoHoursAllocateCheckAllAction = {
  type: typeof ActionType.TOGGLE_CHECKALL;
  payload: {
    checkAllFlg: boolean;
  };
};

type Action =
  | InitAllocateResultListAction
  | SelectAllocateResultRowJobAction
  | EditAutoHoursAllocateRowWorkAction
  | EditAutoHoursAllocateTaskTimeAction
  | EditAutoHoursAllocateCheckboxAction
  | EditAutoHoursAllocateCheckAllAction;

export const actions = {
  initAutoHoursAllocate: (
    allocateList: AutoHoursAllocationResult[]
  ): InitAllocateResultListAction => ({
    type: ActionType.INIT,
    payload: allocateList,
  }),
  selectRowJob: (
    id: string,
    job: AutoHoursAllocationResult['job']
  ): SelectAllocateResultRowJobAction => ({
    type: ActionType.SELECT_JOB,
    payload: {
      id,
      job,
    },
  }),
  selectRowWork: (
    id: string,
    work: AutoHoursAllocationResult['workCategory']
  ): EditAutoHoursAllocateRowWorkAction => ({
    type: ActionType.EDIT_WORK,
    payload: {
      id,
      work,
    },
  }),
  selectTaskTime: (
    id: string,
    taskTime: number
  ): EditAutoHoursAllocateTaskTimeAction => ({
    type: ActionType.EDIT_TASK_TIME,
    payload: {
      id,
      taskTime,
    },
  }),
  toggleCheckbox: (
    id: string,
    checkboxFlg: boolean
  ): EditAutoHoursAllocateCheckboxAction => ({
    type: ActionType.TOGGLE_CHECKBOX,
    payload: {
      id,
      checkboxFlg,
    },
  }),
  toggleCheckAll: (
    checkAllFlg: boolean
  ): EditAutoHoursAllocateCheckAllAction => ({
    type: ActionType.TOGGLE_CHECKALL,
    payload: {
      checkAllFlg,
    },
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  const { original, editing } = state;
  switch (action.type) {
    case ActionType.INIT:
      const result = (action as InitAllocateResultListAction).payload;

      const originalData = {};
      const editingData = [];
      result.forEach((item) => {
        const eventId = item.eventId;
        originalData[eventId] = item;
        editingData.push(item);
      });

      return {
        original: originalData,
        editing: editingData,
        checkAll: false,
        selectedTime: calcTotalSelectedTaskTime(editingData),
      };
    case ActionType.SELECT_JOB:
      const { id, job } = (action as SelectAllocateResultRowJobAction).payload;

      return {
        ...state,
        editing: editing.map((item) => {
          if (item.eventId !== id) {
            return item;
          }
          const updated = {
            ...item,
            job: job || null,
            workCategory: null,
          };

          const isModified = judgeModifiedOrNot(updated, original[id]);

          return {
            ...updated,
            isModified,
            // differFromDictionary:
            //   isModified || updated.allocateResult === MATCHING_TYPE.UNMATCHED,
          };
        }),
      };
    case ActionType.EDIT_WORK:
      const { id: dataId, work } = (
        action as EditAutoHoursAllocateRowWorkAction
      ).payload;
      return {
        ...state,
        editing: editing.map((item) => {
          if (item.eventId !== dataId) {
            return item;
          }
          const { id, code, name } = work;
          const updated = {
            ...item,
            workCategory: {
              id,
              code,
              name,
            },
          };
          const isModified = judgeModifiedOrNot(updated, original[dataId]);

          return {
            ...updated,
            isModified,
            // differFromDictionary:
            //   isModified || updated.allocateResult === MATCHING_TYPE.UNMATCHED,
          };
        }),
      };
    case ActionType.EDIT_TASK_TIME:
      const { id: rowId, taskTime } = (
        action as EditAutoHoursAllocateTaskTimeAction
      ).payload;
      const editingTaskTime = editing.map((item) => {
        if (item.eventId !== rowId) {
          return item;
        }

        const updated = {
          ...item,
          taskTime,
        };
        const isModified = judgeModifiedOrNot(updated, original[rowId]);

        return {
          ...updated,
          isModified,
          // differFromDictionary:
          //   isModified || updated.allocateResult === MATCHING_TYPE.UNMATCHED,
        };
      });

      return {
        ...state,
        editing: editingTaskTime,
        selectedTime: calcTotalSelectedTaskTime(editingTaskTime),
      };
    case ActionType.TOGGLE_CHECKBOX:
      const { id: listRowId, checkboxFlg } = (
        action as EditAutoHoursAllocateCheckboxAction
      ).payload;
      const editingCheckbox = editing.map((item) =>
        item.eventId === listRowId
          ? {
              ...item,
              import: !checkboxFlg,
            }
          : item
      );

      return {
        ...state,
        editing: editingCheckbox,
        selectedTime: calcTotalSelectedTaskTime(editingCheckbox),
      };
    case ActionType.TOGGLE_CHECKALL:
      const { checkAllFlg } = (action as EditAutoHoursAllocateCheckAllAction)
        .payload;
      const checkAll = !checkAllFlg;
      const editingCheckAll = editing.map((item) => {
        if (
          checkAll &&
          (item.isModified === true ||
            item.allocateResult === MATCHING_TYPE.MATCHED)
        ) {
          return {
            ...item,
            import: true,
          };
        } else {
          return {
            ...item,
            import: false,
          };
        }
      });

      return {
        ...state,
        checkAll,
        editing: editingCheckAll,
        selectedTime: calcTotalSelectedTaskTime(editingCheckAll),
      };
    default:
      return state;
  }
};
