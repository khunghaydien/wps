import { bindActionCreators, Dispatch } from 'redux';

import WorkCategoryRepository from '../../repositories/time-tracking/WorkCategoryRepository';

import { actions as workCategories } from '../modules/entities/workCategories';
import { actions as workCategoryList } from '../modules/ui/workCategoryList';

export interface WorkCategoryList {
  load: (targetDate: string, jobId: string) => Promise<void>;
  clear: (targetDate?: string, jobId?: string) => void;
}

export default (dispatch: Dispatch): WorkCategoryList => {
  const workCategoryService = bindActionCreators(workCategories, dispatch);
  const workCategoryListService = bindActionCreators(
    workCategoryList,
    dispatch
  );

  return {
    load: async (targetDate: string, jobId: string): Promise<void> => {
      const results = await WorkCategoryRepository.fetchList({
        jobId,
        targetDate,
      });
      workCategoryService.fetchSuccess(results);
      workCategoryListService.add({
        targetDate,
        jobId,
        workCategoryIds: results.map(({ id }) => id),
      });
    },

    clear: (targetDate?: string, jobId?: string): void => {
      if (targetDate || jobId) {
        workCategoryService.clear();
        workCategoryListService.clear({
          targetDate,
          jobId,
        });
      } else {
        workCategoryService.clear();
        workCategoryListService.clear();
      }
    },
  };
};
