import Api from '../api';
import { catchApiError, loadingEnd, loadingStart } from './app';

export const FETCH_JOB_LIST = 'FETCH_JOB_LIST';

export const CLEAR_JOB_LIST = 'CLEAR_JOB_LIST';

/**
 * ジョブを取得
 */
function fetchJobListSuccess(result) {
  return {
    type: FETCH_JOB_LIST,
    payload: result,
  };
}

export const fetchJobListByParent =
  (targetDate, parentItem = null, existingItems = []) =>
  (dispatch) => {
    const req = {
      path: '/time/job/get',
      param: {
        targetDate,
        parentId: parentItem ? parentItem.id : null,
      },
    };

    dispatch(loadingStart());

    return Api.invoke(req)
      .then((result) => {
        const { jobList } = result;
        const newItems = Object.assign([], existingItems);
        const resultItems = Object.assign([], jobList);
        newItems.push(resultItems);
        dispatch(fetchJobListSuccess(newItems));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(loadingEnd()));
  };

export const clearJobList = () => ({
  type: CLEAR_JOB_LIST,
});
