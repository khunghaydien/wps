import { bindActionCreators, Dispatch } from 'redux';

import WorkCategoryRepository, {
  Param,
} from '../../../repositories/time-tracking/WorkCategoryRepository';

import { actions as workCategories } from '../modules/entities/workCategories';
import { actions as workCategoryList } from '../modules/ui/workCategoryList';

export interface WorkCategoryList {
  load: (param: Param) => Promise<void>;
  clear: (param?: Param) => void;
}

export default (dispatch: Dispatch): WorkCategoryList => {
  const workCategoryService = bindActionCreators(workCategories, dispatch);
  const workCategoryListService = bindActionCreators(
    workCategoryList,
    dispatch
  );

  return {
    load: async (param: Param): Promise<void> => {
      const results = await WorkCategoryRepository.fetchList(param);

      let targetDate = param.targetDate;
      if (!targetDate) {
        targetDate = `${param.startDate}${param.endDate}`;
      }

      workCategoryService.fetchSuccess(results);
      workCategoryListService.add({
        targetDate,
        jobId: param.jobId,
        workCategoryIds: results.map(({ id }) => id),
      });
    },

    clear: (param: Partial<Param> = {}): void => {
      if (param.jobId) {
        let targetDate = param.targetDate;
        if (!targetDate) {
          targetDate = `${param.startDate}${param.endDate}`;
        }
        workCategoryService.clear();
        workCategoryListService.clear({
          targetDate,
          jobId: param.jobId,
        });
      } else {
        workCategoryService.clear();
        workCategoryListService.clear();
      }
    },
  };
};
