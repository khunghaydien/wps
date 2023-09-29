import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Param } from '@apps/repositories/time-tracking/WorkCategoryRepository';

import { WorkCategory } from '../../../../domain/models/time-tracking/WorkCategory';

import { State } from '../../modules';

import WorkCategoryList from '../../action-dispatchers/WorkCategoryList';

interface WorkCategoryResource {
  isLoading: boolean;
  load: () => Promise<void>;
  workCategories: readonly WorkCategory[];
}

function useWorkCategories(param: Param): undefined | readonly WorkCategory[] {
  let targetDate = param.targetDate;
  if (!targetDate) {
    targetDate = `${param.startDate}${param.endDate}`;
  }

  const ids = useSelector(
    (state: State) => state.ui.workCategoryList[targetDate]?.[param.jobId]
  );
  return useSelector((state: State) => {
    return ids?.map((id) => state.entities.workCategories.byId[id]);
  });
}

const useWorkCategoryResource = (param: Param): WorkCategoryResource => {
  const workCategories = useWorkCategories(param);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const workCategoryList = useMemo(
    () => WorkCategoryList(dispatch),
    [dispatch]
  );

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      if (workCategories === undefined) {
        await workCategoryList.load(param);
      }
    } catch (e) {
      workCategoryList.clear(param);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [param, workCategories, workCategoryList]);

  const resource = useMemo(
    () => ({
      isLoading,
      load,
      workCategories: workCategories ?? [],
    }),
    [isLoading, load, workCategories]
  );

  return resource;
};

export default useWorkCategoryResource;
