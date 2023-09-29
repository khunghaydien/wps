import flatten from 'lodash/flatten';
import values from 'lodash/values';
import { createSelector } from 'reselect';

import { Job } from '../../../domain/models/time-tracking/Job';

import { State as WorkCategoriesState } from './entity/workCategories';
import { State } from './index';

const selectJob = (state: State): Job[] =>
  flatten(values(state.entity.jobs).map((job) => job.items || []));

const selectSelectedJobId = (state: State): string =>
  state.ui.dailyTaskJob.jobId;

export const selectedJob: (arg0: State) => Job | null | undefined =
  createSelector(
    selectJob,
    selectSelectedJobId,
    (jobs: Job[] = [], selectedJobId: string): Job | null | undefined => {
      return jobs.find((job) => job.id === selectedJobId);
    }
  );

export const workCategoryOptionList = createSelector(
  (state: State) => state.entity.workCategories,
  (workCategories: WorkCategoriesState) => {
    const defaultOption = {
      label: '',
      value: '',
    };
    return [
      defaultOption,
      ...workCategories.map((wc) => ({
        label: `${wc.code} ${wc.name}`,
        value: wc.id,
      })),
    ];
  }
);
