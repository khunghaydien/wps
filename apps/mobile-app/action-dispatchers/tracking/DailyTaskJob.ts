import TimeUtil from '../../../commons/utils/TimeUtil';
import { catchApiError } from '../../modules/commons/error';
import { withLoading } from '../../modules/commons/loading';

import WorkCategoryRepository from '../../../repositories/time-tracking/WorkCategoryRepository';
import DailyTaskRepository from '../../../repositories/TimeTaskDailyRepository';

import { State as DailyTaskState } from '../../modules/tracking/entity/dailyTask';
import { actions as workCategories } from '../../modules/tracking/entity/workCategories';
import {
  actions as dailyTaskJob,
  State as DailyTaskJobState,
} from '../../modules/tracking/ui/dailyTaskJob';

import { AppDispatch } from '../AppThunk';

export const initialize = (
  _targetDate: string,
  _jobId?: string,
  _empId?: string
) => {
  // Nothing to do
};

export const selectJob =
  (targetDate: string, jobId: string) => (dispatch: AppDispatch) => {
    const fetchData = (dispatch: AppDispatch) => {
      return WorkCategoryRepository.fetchList({ jobId, targetDate })
        .then((result) => dispatch(workCategories.fetchSuccess(result)))
        .catch((err) => dispatch(catchApiError(err)));
    };

    dispatch(dailyTaskJob.update('jobId', jobId));
    dispatch(dailyTaskJob.update('workCategoryId', null));
    dispatch(withLoading(fetchData));
  };

export const selectWorkCategory =
  (workCategoryId: string) =>
  (dispatch: AppDispatch): void => {
    dispatch(dailyTaskJob.update('workCategoryId', workCategoryId));
  };

export const editTaskTime =
  (taskTime: number | null | undefined) => (dispatch: AppDispatch) => {
    dispatch(dailyTaskJob.update('taskTime', TimeUtil.toHHmm(taskTime)));
  };

export const discard = () => (dispatch: AppDispatch) => {
  dispatch(dailyTaskJob.reset());
};

export const save = (
  dailyTaskJobState: DailyTaskJobState,
  dailyTaskState: DailyTaskState
) => {
  const newTask = {
    jobId: dailyTaskJobState.jobId,
    workCategoryId: dailyTaskJobState.workCategoryId,
    taskTime: TimeUtil.toMinutes(dailyTaskJobState.taskTime || 0),
    isDirectInput: true,
    ratio: null,
    volume: dailyTaskJobState.taskTime,
    taskNote: null,
  };

  const saveData = (dispatch: AppDispatch): Promise<any> =>
    DailyTaskRepository.update({
      ...dailyTaskState,
      // @ts-ignore
      taskList: [...dailyTaskState.taskList, newTask],
    })
      .then(() => {
        dispatch(dailyTaskJob.reset());
      })
      .catch((err) => {
        dispatch(catchApiError(err));
        return Promise.reject(err);
      });

  return withLoading(saveData);
};
