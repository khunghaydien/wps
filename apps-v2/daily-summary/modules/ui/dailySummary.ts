import orderBy from 'lodash/orderBy';

import {
  TASK_INPUT_MODE,
  TaskInputMode,
} from '../../constants/TASK_INPUT_MODE';

import { pipe } from '@commons/utils/FnUtil';

import STATUS, { Status } from '@apps/domain/models/approval/request/Status';
import { DailySummary } from '@apps/domain/models/time-management/DailySummary';
import {
  addErrorOfTotalTaskTime,
  calculateTaskTimesOfNonDirectInput,
  create as createDailySummaryTask,
  DailySummaryTask,
  findLargestRatioTask,
  makeRatioInputTaskTimeTo0,
  sumRatio,
} from '@apps/domain/models/time-management/DailySummaryTask';
import { Job } from '@apps/domain/models/time-tracking/Job';

// State

export type State = {
  targetDate: string;
  useTimeAutoWorkingHourAllocation: boolean;
  useWorkReportByJob: boolean;
  status: Status;
  note: string | null | undefined;
  output: string | null | undefined;
  taskInputMode: TaskInputMode;
  taskList: DailySummaryTask[];
  originalTaskList: DailySummaryTask[];
  timestampComment: string;
  isEnableEndStamp: boolean;
  realWorkTime: number | null | undefined;
  isTemporaryWorkTime: boolean | null | undefined;
  isJobSelectDialogOpened: boolean | null;
};

export const initialState: State = {
  targetDate: '',
  useTimeAutoWorkingHourAllocation: false,
  useWorkReportByJob: false,
  status: STATUS.NotRequested,
  note: '',
  output: '',
  timestampComment: '',
  isEnableEndStamp: false,
  taskInputMode: TASK_INPUT_MODE.WORK_DURATION,
  taskList: [],
  originalTaskList: [],
  realWorkTime: 0,
  isTemporaryWorkTime: false,
  isJobSelectDialogOpened: false,
};

// Actions
const ACTION_PREFIX = '/DAILY-SUMMARY/UI/DAILY_SUMMARY/';
export const ACTION = {
  ADD_JOB_TO_TASK_LIST: ACTION_PREFIX + 'ADD_JOB_TO_TASK_LIST',
  RESET: ACTION_PREFIX + 'RESET',
  DELETE_TASK: ACTION_PREFIX + 'DELETE_TASK',
  OPEN_JOB_SELECT_DIALOG: ACTION_PREFIX + 'OPEN_JOB_SELECT_DIALOG',
  CLOSE_JOB_SELECT_DIALOG: ACTION_PREFIX + 'CLOSE_JOB_SELECT_DIALOG',
  UPDATE: ACTION_PREFIX + 'UPDATE',
  UPDATE_TASK: ACTION_PREFIX + 'UPDATE_TASK',
  SWITCH_TASK_INPUT_MODE: ACTION_PREFIX + 'SWITCH_TASK_INPUT_MODE',
  TOGGLE_DIRECT_INPUT: ACTION_PREFIX + 'TOGGLE_DIRECT_INPUT',
  REPLACE_TASK_LIST: ACTION_PREFIX + 'REPLACE_TASK_LIST',
  SORT: 'DAILY-SUMMARY/UI/DAILY-SUMMARY/SORT',
  FETCH_SUCCESS: ACTION_PREFIX + 'FETCH_SUCCESS',
  SAVE_SUCCESS: ACTION_PREFIX + 'SAVE_SUCCESS',
  SET_IS_ENABLE_END_STAMP: ACTION_PREFIX + 'SET_IS_ENABLE_END_STAMP',
} as const;

type AddJobToTaskList = {
  type: typeof ACTION.ADD_JOB_TO_TASK_LIST;
  payload: {
    job: Job;
  };
};

type Reset = {
  type: typeof ACTION.RESET;
};

type DeleteTask = {
  type: typeof ACTION.DELETE_TASK;
  payload: {
    index: number;
  };
};

type OpenJobSelectDialog = {
  type: typeof ACTION.OPEN_JOB_SELECT_DIALOG;
};

type CloseJobSelectDialog = {
  type: typeof ACTION.CLOSE_JOB_SELECT_DIALOG;
};

type Update = {
  type: typeof ACTION.UPDATE;
  payload: {
    key: keyof State;
    value: State[keyof State];
  };
};

type UpdateTask = {
  type: typeof ACTION.UPDATE_TASK;
  payload: {
    index: number;
    prop: string;
    value: unknown;
  };
};

type SwitchTaskInputMode = {
  type: typeof ACTION.SWITCH_TASK_INPUT_MODE;
  payload: TaskInputMode;
};

type ToggleDirectInput = {
  type: typeof ACTION.TOGGLE_DIRECT_INPUT;
  payload: {
    index: number;
  };
};

type ReplaceTaskList = {
  type: typeof ACTION.REPLACE_TASK_LIST;
  payload: DailySummaryTask[];
};

type Sort = {
  type: typeof ACTION.SORT;
  payload: {
    sortKey: 'taskTime' | 'jobCode' | 'workCategoryCode';
    order: 'asc' | 'desc';
  };
};

type FetchSuccess = {
  type: typeof ACTION.FETCH_SUCCESS;
  payload: {
    dailySummary: DailySummary;
    targetDate: string;
  };
};

type SaveSuccess = {
  type: typeof ACTION.SAVE_SUCCESS;
};

type SetIsEnableEndStamp = {
  type: typeof ACTION.SET_IS_ENABLE_END_STAMP;
  payload: {
    isEnableEndStamp: boolean;
    targetDate: string;
  };
};

type Action =
  | AddJobToTaskList
  | Reset
  | DeleteTask
  | OpenJobSelectDialog
  | CloseJobSelectDialog
  | Update
  | UpdateTask
  | SwitchTaskInputMode
  | ToggleDirectInput
  | ReplaceTaskList
  | Sort
  | FetchSuccess
  | SaveSuccess
  | SetIsEnableEndStamp;

export const actions = {
  addJobToTaskList: (job: Job): AddJobToTaskList => ({
    type: ACTION.ADD_JOB_TO_TASK_LIST,
    payload: {
      job,
    },
  }),
  reset: (): Reset => ({
    type: ACTION.RESET,
  }),
  deleteTask: (index: number): DeleteTask => ({
    type: ACTION.DELETE_TASK,
    payload: {
      index,
    },
  }),
  openJobSelectDialog: (): OpenJobSelectDialog => ({
    type: ACTION.OPEN_JOB_SELECT_DIALOG,
  }),
  closeJobSelectDialog: (): CloseJobSelectDialog => ({
    type: ACTION.CLOSE_JOB_SELECT_DIALOG,
  }),
  update: (key: keyof State, value: State[keyof State]): Update => ({
    type: ACTION.UPDATE,
    payload: {
      key,
      value,
    },
  }),
  updateTask: (index: number, prop: string, value: unknown): UpdateTask => ({
    type: ACTION.UPDATE_TASK,
    payload: {
      index,
      prop,
      value,
    },
  }),
  switchTaskInputMode: (mode: TaskInputMode): SwitchTaskInputMode => ({
    type: ACTION.SWITCH_TASK_INPUT_MODE,
    payload: mode,
  }),
  toggleDirectInput: (index: number): ToggleDirectInput => ({
    type: ACTION.TOGGLE_DIRECT_INPUT,
    payload: { index },
  }),
  replaceTaskList: (taskList: DailySummaryTask[]): ReplaceTaskList => ({
    type: ACTION.REPLACE_TASK_LIST,
    payload: taskList,
  }),
  sort: (
    sortKey: 'jobCode' | 'workCategoryCode' | 'taskTime',
    order: 'asc' | 'desc'
  ): Sort => ({
    type: ACTION.SORT,
    payload: { sortKey, order },
  }),
  fetchSuccess: (
    dailySummary: DailySummary,
    targetDate: string
  ): FetchSuccess => ({
    type: ACTION.FETCH_SUCCESS,
    payload: {
      dailySummary,
      targetDate,
    },
  }),
  saveSuccess: (): SaveSuccess => ({ type: ACTION.SAVE_SUCCESS }),
  setIsEnableEndStamp: (
    isEnableEndStamp: boolean,
    targetDate: string
  ): SetIsEnableEndStamp => ({
    type: ACTION.SET_IS_ENABLE_END_STAMP,
    payload: {
      isEnableEndStamp,
      targetDate,
    },
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  const updateIn = (
    task: DailySummaryTask,
    tasks: DailySummaryTask[]
  ): DailySummaryTask[] => {
    return tasks.map((t) => (t.id === task.id ? { ...t, ...task } : { ...t }));
  };

  switch (action.type) {
    case ACTION.ADD_JOB_TO_TASK_LIST: {
      const task = createDailySummaryTask(
        state.taskList.length,
        (action as AddJobToTaskList).payload.job
      );
      const taskList = [...state.taskList, { ...task }];
      return {
        ...state,
        taskList,
      };
    }
    case ACTION.RESET: {
      return { ...initialState };
    }
    case ACTION.DELETE_TASK: {
      const { index } = (action as DeleteTask).payload;

      const taskList = pipe(
        (ts: DailySummaryTask[]) => ts.filter((_, i) => i !== index),
        (ts) => {
          return calculateTaskTimesOfNonDirectInput(
            ts,
            state.realWorkTime || 0
          );
        },
        (ts) => {
          const target = findLargestRatioTask(ts);
          if (target !== null) {
            const updatedTask = addErrorOfTotalTaskTime(
              ts,
              state.realWorkTime || 0,
              { ...target }
            );
            return updateIn(updatedTask, ts);
          } else {
            return ts;
          }
        }
      )([...state.taskList]);

      const nonDirectInputTasks = taskList.filter(
        (task) => !task.isDirectInput
      );

      return {
        ...state,
        taskList: taskList.map<DailySummaryTask>((task) => {
          if (!task.isDirectInput && nonDirectInputTasks.length === 1) {
            task.ratio = 100;
          }

          return task;
        }),
      };
    }

    case ACTION.OPEN_JOB_SELECT_DIALOG: {
      return {
        ...state,
        isJobSelectDialogOpened: true,
      };
    }

    case ACTION.CLOSE_JOB_SELECT_DIALOG: {
      return {
        ...state,
        isJobSelectDialogOpened: false,
      };
    }

    case ACTION.UPDATE: {
      const { key, value } = (action as Update).payload;
      return { ...state, [key]: value };
    }

    case ACTION.UPDATE_TASK: {
      const { index, prop, value } = (action as UpdateTask).payload;

      const target = {
        ...state.taskList[index],
        [prop]: value,
      };
      if (target[prop] === state.taskList[index][prop]) {
        return {
          ...state,
        };
      }

      const updatedTaskList = updateIn(target, [...state.taskList]);
      const totalRatio = sumRatio(updatedTaskList);
      if (totalRatio !== 100) {
        const taskList = makeRatioInputTaskTimeTo0(updatedTaskList);
        return {
          ...state,
          taskList,
        };
      }

      const taskList = pipe(
        () => {
          return calculateTaskTimesOfNonDirectInput(
            updatedTaskList,
            state.realWorkTime || 0
          );
        },
        (taskList) => {
          const ratioTask = findLargestRatioTask(taskList);
          if (ratioTask !== null) {
            const updatedTask = addErrorOfTotalTaskTime(
              taskList,
              state.realWorkTime || 0,
              { ...ratioTask }
            );
            return updateIn(updatedTask, taskList);
          } else {
            return taskList;
          }
        }
      )([...state.taskList]);

      return {
        ...state,
        taskList,
      };
    }

    case ACTION.SWITCH_TASK_INPUT_MODE: {
      return {
        ...state,
        taskInputMode: (action as SwitchTaskInputMode).payload,
      };
    }

    case ACTION.TOGGLE_DIRECT_INPUT: {
      const { index } = (action as ToggleDirectInput).payload;

      const targetTask = {
        ...state.taskList[index],
        ratio: 0,
        taskTime: 0,
        isDirectInput: !state.taskList[index].isDirectInput,
      };

      let nextTaskList = state.taskList.map<DailySummaryTask>((task, i) =>
        i !== index ? task : targetTask
      );

      const includesOnlySingleNonDirectInput =
        nextTaskList.filter((task) => !task.isDirectInput).length === 1;

      if (includesOnlySingleNonDirectInput) {
        nextTaskList = nextTaskList.map<DailySummaryTask>((task) =>
          !task.isDirectInput ? { ...task, ratio: 100 } : task
        );
      }

      const updatedTaskList = pipe(
        (taskList: DailySummaryTask[]) => {
          return calculateTaskTimesOfNonDirectInput(
            taskList,
            state.realWorkTime || 0
          );
        },
        (taskList) => {
          const ratioTask = findLargestRatioTask(taskList);
          if (ratioTask !== null) {
            const updatedTask = addErrorOfTotalTaskTime(
              taskList,
              state.realWorkTime || 0,
              { ...ratioTask }
            );
            return updateIn(updatedTask, taskList);
          } else {
            return taskList;
          }
        }
      )([...nextTaskList]);

      return {
        ...state,
        taskList: updatedTaskList,
      };
    }

    case ACTION.REPLACE_TASK_LIST: {
      return {
        ...state,
        taskList: (action as ReplaceTaskList).payload,
      };
    }

    case ACTION.SORT: {
      const taskList = [...state.taskList];
      const { sortKey, order } = (action as Sort).payload;
      const sortKeys: Array<keyof DailySummaryTask> = [sortKey];
      const orders: Array<typeof order> = [order];
      if (sortKey === 'workCategoryCode') {
        sortKeys.push('hasJobType');
        orders.push(order === 'desc' ? 'asc' : 'desc');
      }
      if (sortKey === 'taskTime') {
        sortKeys.push('isDirectInput', 'ratio', 'jobCode');
        orders.push(order === 'desc' ? 'asc' : 'desc', order, order);
      }
      return {
        ...state,
        taskList: orderBy(taskList, sortKeys, orders),
      };
    }

    case ACTION.FETCH_SUCCESS: {
      const { dailySummary, targetDate } = (action as FetchSuccess).payload;

      if (targetDate !== state.targetDate) {
        return state;
      }

      const taskList = [...dailySummary.taskList];
      return {
        ...state,
        status: dailySummary.status,
        note: dailySummary.note,
        output: dailySummary.output,
        taskList,
        originalTaskList: taskList,
        realWorkTime: dailySummary.realWorkTime,
        isTemporaryWorkTime: dailySummary.isTemporaryWorkTime,
        useWorkReportByJob: dailySummary.useWorkReportByJob,
        useTimeAutoWorkingHourAllocation:
          dailySummary.useTimeAutoWorkingHourAllocation,
      };
    }

    case ACTION.SAVE_SUCCESS: {
      return {
        ...state,
        originalTaskList: state.taskList,
      };
    }

    case ACTION.SET_IS_ENABLE_END_STAMP: {
      const { isEnableEndStamp, targetDate } = (action as SetIsEnableEndStamp)
        .payload;

      if (targetDate !== state.targetDate) {
        return state;
      }

      return {
        ...state,
        isEnableEndStamp,
      };
    }

    default:
      return state;
  }
};
