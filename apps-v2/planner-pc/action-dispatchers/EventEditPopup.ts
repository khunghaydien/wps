import DateUtil from '../../commons/utils/DateUtil';

import { Job } from '../../domain/models/time-tracking/Job';

import {
  clearWorkCategoryList,
  fetchWorkCategoryList,
  selectJobFromDialog,
} from '../actions/eventEditPopup';

import { AppDispatch } from './AppThunk';

interface EventEditPopup {
  selectJob: (job: Job) => Promise<void>;
}

export default (dispatch: AppDispatch, targetDate: string): EventEditPopup => {
  return {
    /**
     * Select a job
     */
    selectJob: async (job: Job): Promise<void> => {
      dispatch(selectJobFromDialog(job));

      dispatch(clearWorkCategoryList());
      const formattedTargetDate = DateUtil.formatISO8601Date(targetDate);
      await dispatch(fetchWorkCategoryList(job.id, formattedTargetDate));
    },
  };
};
