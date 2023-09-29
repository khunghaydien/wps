import _ from 'lodash';
import flow from 'lodash/fp/flow';
import map from 'lodash/fp/map';
import uniqBy from 'lodash/fp/uniqBy';

import { Task } from './Task';

/**
 * 作業分類
 */
export type WorkCategory = {
  /**
   * 作業分類ID
   */
  id: string;

  /**
   * 作業分類コード
   */
  code: string;

  /**
   * 作業分類名
   */
  name: string;

  /**
   * 作業分類名
   */
  order?: number | null | undefined;

  validDateFrom?: string;
  validDateTo?: string;
};

export const defaultValue = {
  id: '',
  code: '',
  name: '',
  order: null,
};

// eslint-disable-next-line import/prefer-default-export
export const createWorkCategoryMap = (
  tasks: Task[]
): {
  [jobId: string]: WorkCategory[];
} => {
  if (_.isEmpty(tasks)) {
    return {};
  }

  const workCategoryLists = flow(
    map((task: Task) => ({
      jobId: task.jobId,
      // @ts-ignore
      list: task.workCategoryList,
    })),
    uniqBy('jobId')
  )(tasks);

  const workCategoryMap = workCategoryLists.reduce(
    (acc, workCategoryList) => ({
      ...acc,
      [workCategoryList.jobId]: workCategoryList.list,
    }),
    {}
  );

  tasks.forEach((task) => {
    const workCategoryList = workCategoryMap[task.jobId];
    if (Array.isArray(workCategoryList) && task.workCategoryId !== null) {
      // Add an unavailable work category expired the date
      const notExistsInList = workCategoryList.every((workCategory) => {
        return workCategory.id !== task.workCategoryId;
      });
      // Add an unavailable work category tied with a job does not have job type
      const hasNoJobType = !task.hasJobType && task.workCategoryId;
      if (notExistsInList || hasNoJobType) {
        workCategoryList.push({
          id: task.workCategoryId,
          code: task.workCategoryCode,
          name: task.workCategoryName,
        });
      }
    }
  });

  return workCategoryMap;
};
