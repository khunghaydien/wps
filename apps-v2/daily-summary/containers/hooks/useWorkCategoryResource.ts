import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { WorkCategory } from '../../../domain/models/time-tracking/WorkCategory';

import { State } from '../../modules';

import App from '../../action-dispatchers/App';
import WorkCategoryList from '../../action-dispatchers/WorkCategoryList';

interface WorkCategoryResource {
  isLoading: boolean;
  load: () => Promise<void>;
  workCategories: readonly WorkCategory[];
}

function useWorkCategories(
  targetDate: string,
  jobId: string
): undefined | readonly WorkCategory[] {
  const ids = useSelector(
    (state: State) => state.ui.workCategoryList[targetDate]?.[jobId]
  );
  return useSelector((state: State) => {
    return ids?.map((id) => state.entities.workCategories.byId[id]);
  });
}

const useWorkCategoryResource = (jobId: string): WorkCategoryResource => {
  const targetDate = useSelector(
    (state: State) => state.ui.dailySummary.targetDate
  );
  const workCategories = useWorkCategories(targetDate, jobId);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const app = useMemo(() => App(dispatch), [dispatch]);
  const workCategoryList = useMemo(
    () => WorkCategoryList(dispatch),
    [dispatch]
  );

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      if (workCategories === undefined) {
        await workCategoryList.load(targetDate, jobId);
      }
    } catch (e) {
      app.showErrorNotification(e);
      workCategoryList.clear(targetDate, jobId);
    } finally {
      setIsLoading(false);
    }
  }, [app, jobId, targetDate, workCategories, workCategoryList]);

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
