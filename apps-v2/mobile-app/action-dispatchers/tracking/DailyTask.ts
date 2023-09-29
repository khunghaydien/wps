import { $Shape } from 'utility-types';

import msg from '../../../commons/languages';
import * as personalSetting from '../../../commons/modules/personalSetting';
import { showAlert } from '../../modules/commons/alert';
import { catchApiError } from '../../modules/commons/error';
import { withLoading } from '../../modules/commons/loading';

import Repository from '../../../repositories/TimeTaskDailyRepository';

import {
  calculateTotalRatio,
  includesNonDirectInput,
  Task,
} from '../../../domain/models/time-tracking/Task';

import * as dailyTask from '../../modules/tracking/entity/dailyTask';
import * as dailyTaskUIActions from '../../modules/tracking/ui/dailyTask';

import { AppDispatch } from '../AppThunk';

export const initialize = (param: { empId?: string; targetDate: string }) => {
  const fetchData = (dispatch: AppDispatch) =>
    Promise.all([
      dispatch(personalSetting.fetch()),
      dispatch(dailyTask.fetch(param)),
    ]);

  return withLoading(fetchData);
};

export const editTask =
  (id: string, task: $Shape<Task>) => (dispatch: AppDispatch) => {
    dispatch(dailyTask.updateTask(id, task));
  };

export const saveTask = (task: dailyTask.State, empId?: string) => {
  const update = (dispatch: AppDispatch): Promise<any> => {
    if (
      includesNonDirectInput(task.taskList) &&
      calculateTotalRatio(task.taskList) !== 100
    ) {
      return dispatch(showAlert(msg().Trac_Err_CannotSaveJob));
    }
    return Repository.update(task, empId)
      .then(() => dispatch(dailyTaskUIActions.reset()))
      .then(() =>
        dispatch(dailyTask.fetch({ targetDate: task.targetDate, empId }))
      )
      .catch((err) => dispatch(catchApiError(err)));
  };

  return withLoading(update);
};
