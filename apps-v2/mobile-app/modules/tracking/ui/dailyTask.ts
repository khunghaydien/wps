import cloneDeep from 'lodash/cloneDeep';
import defaultTo from 'lodash/defaultTo';

import { deleteTaskInTaskList } from '../../../../domain/models/time-tracking/Task';

import { State as DailyTaskState } from '../entity/dailyTask';

type State = {
  isEditing: boolean;
  dailyTask: DailyTaskState | null;
};

const initialState: State = {
  isEditing: false,
  dailyTask: null,
};

type ToggleEditing = {
  type: '/MOBILE-APP/MODULES/TRACKING/UI/DAILY_TASK/TOGGLE_EDITING';
  payload: DailyTaskState;
};

export const toggleEditing = (dailyTask: DailyTaskState): ToggleEditing => ({
  type: '/MOBILE-APP/MODULES/TRACKING/UI/DAILY_TASK/TOGGLE_EDITING',
  payload: dailyTask,
});

type DeleteTask = {
  type: '/MOBILE-APP/MODULES/TRACKING/UI/DAILY_TASK/DELETE_TASK';
  payload: string;
};

export const deleteTask = (taskId: string): DeleteTask => ({
  type: '/MOBILE-APP/MODULES/TRACKING/UI/DAILY_TASK/DELETE_TASK',
  payload: taskId,
});

type Reset = {
  type: '/MOBILE-APP/MODULES/TRACKING/UI/DAILY_TASK/RESET';
};

export const reset = (): Reset => ({
  type: '/MOBILE-APP/MODULES/TRACKING/UI/DAILY_TASK/RESET',
});

type Action = ToggleEditing | DeleteTask | Reset;

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case '/MOBILE-APP/MODULES/TRACKING/UI/DAILY_TASK/TOGGLE_EDITING':
      return state.isEditing
        ? initialState
        : {
            isEditing: true,
            dailyTask: cloneDeep(action.payload),
          };

    case '/MOBILE-APP/MODULES/TRACKING/UI/DAILY_TASK/DELETE_TASK':
      if (state.dailyTask === null) {
        return state;
      }

      const nextTaskList = deleteTaskInTaskList(
        defaultTo(state.dailyTask.realWorkTime, 100), // 実労働時間がない場合には暫定100分で計算する
        action.payload,
        state.dailyTask === null ? [] : state.dailyTask.taskList
      );
      return {
        isEditing: state.isEditing,
        dailyTask: {
          ...state.dailyTask,
          taskList: nextTaskList,
        },
      };

    case '/MOBILE-APP/MODULES/TRACKING/UI/DAILY_TASK/RESET':
      return initialState;

    default:
      return state;
  }
};
