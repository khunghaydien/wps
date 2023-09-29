import { Dispatch } from 'redux';

import { createSelector } from 'reselect';
import { $Shape } from 'utility-types';

import Repository from '../../../../repositories/TimeTaskDailyRepository';

import defaultValue, {
  DailyTask,
} from '../../../../domain/models/time-tracking/DailyTask';
import { Task } from '../../../../domain/models/time-tracking/Task';

import colors from '../../../styles/variables/_colors.scss';

// State

export type State = DailyTask;

const initialState: State = {
  ...defaultValue,
};

// Selectors

export const taskTimes = createSelector(
  (state: State) => state,
  (state: State) => {
    return [
      state.taskList.reduce(
        (acc, task) => ({
          color: colors.blue600,
          value:
            acc.value +
            (state.realWorkTime !== null || task.isDirectInput
              ? task.taskTime
              : 0),
        }),
        { color: '', value: 0 }
      ),
    ];
  }
);

// Actions

type ClearState = {
  type: '/MOBILE-APP/MODULES/TRACKING/ENTITY/DAILYTASK/CLEAR_STATE';
};

const clearState = (): ClearState => ({
  type: '/MOBILE-APP/MODULES/TRACKING/ENTITY/DAILYTASK/CLEAR_STATE',
});

type FetchSuccess = {
  type: '/MOBILE-APP/MODULES/TRACKING/ENTITY/DAILYTASK/FETCH_SUCCESS';
  payload: DailyTask;
};

const fetchSuccess = (payload: DailyTask): FetchSuccess => ({
  type: '/MOBILE-APP/MODULES/TRACKING/ENTITY/DAILYTASK/FETCH_SUCCESS',
  payload,
});

type UpdateTask = {
  type: '/MOBILE-APP/MODULES/TRACKING/ENTITY/UPDATE_TASK';
  payload: {
    id: string;
    task: $Shape<Task>;
  };
};

export const updateTask = (id: string, task: $Shape<Task>): UpdateTask => ({
  type: '/MOBILE-APP/MODULES/TRACKING/ENTITY/UPDATE_TASK',
  payload: { id, task },
});

type ToggleInputMode = {
  type: '/MOBILE-APP/MODULES/TRACKING/ENTITY/TOGGLE_INPUT_MODE';
  payload: { id: string };
};

export const toggleInputMode = (id: string): ToggleInputMode => ({
  type: '/MOBILE-APP/MODULES/TRACKING/ENTITY/TOGGLE_INPUT_MODE',
  payload: { id },
});

export const fetch =
  (param: { empId?: string; targetDate: string }) =>
  (dispatch: Dispatch<any>): Promise<DailyTask> => {
    dispatch(clearState());
    return Repository.fetch(param).then((result) => {
      dispatch(fetchSuccess(result));
      return result;
    });
  };

type Action = ClearState | FetchSuccess | UpdateTask | ToggleInputMode;

// Reducer

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case '/MOBILE-APP/MODULES/TRACKING/ENTITY/DAILYTASK/CLEAR_STATE': {
      return {
        ...initialState,
      };
    }

    case '/MOBILE-APP/MODULES/TRACKING/ENTITY/DAILYTASK/FETCH_SUCCESS': {
      return {
        ...action.payload,
      };
    }

    case '/MOBILE-APP/MODULES/TRACKING/ENTITY/UPDATE_TASK': {
      const payload = (action as UpdateTask).payload;
      const taskList = state.taskList.map<Task>((task) => {
        if (task.id !== payload.id) {
          return task;
        }
        return {
          ...task,
          ...payload.task,
        };
      });

      return {
        ...state,
        taskList,
      };
    }

    case '/MOBILE-APP/MODULES/TRACKING/ENTITY/TOGGLE_INPUT_MODE': {
      const { id } = (action as ToggleInputMode).payload;
      const targetTask = state.taskList.find((t) => t.id === id);
      let taskList = state.taskList.map<Task>((task) =>
        task.id !== id
          ? task
          : {
              ...targetTask,
              ratio: 0,
              taskTime: 0,
              isDirectInput: !targetTask?.isDirectInput,
            }
      );
      const includesOnlySingleNonDirectInput =
        taskList.filter((task) => !task.isDirectInput).length === 1;

      if (includesOnlySingleNonDirectInput) {
        taskList = taskList.map<Task>((task) =>
          !task.isDirectInput ? { ...task, ratio: 100 } : task
        );
      }

      return {
        ...state,
        taskList,
      };
    }

    default:
      return state;
  }
};
