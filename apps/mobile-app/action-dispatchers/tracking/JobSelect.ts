import { loadingEnd, loadingStart } from '../../../commons/actions/app';
import { catchApiError } from '../../modules/commons/error';

import TimeTrackJobRepository from '../../../repositories/time-tracking/TimeTrackJobRepository';

import { Job } from '../../../domain/models/time-tracking/Job';

import { actions as jobs, Stream } from '../../modules/tracking/entity/jobs';

import { AppDispatch } from '../AppThunk';

async function* chunk<T>(
  iter: AsyncGenerator<T, void, void>,
  size: number,
  initialSize: number
): Stream<T> {
  let arr = [];
  let chunkSize = initialSize;
  for await (const item of iter) {
    arr.push(item);
    if (arr.length >= chunkSize) {
      yield [...arr];
      arr = [];
      chunkSize = size;
    }
  }
  return arr;
}

export const initialize =
  (
    targetDate: string,
    parentJobId: null | string = null,
    empId: null | string = null
  ) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(loadingStart());

      const result = await TimeTrackJobRepository.fetchAll({
        targetDate,
        parentJobId: parentJobId || undefined,
        empId: empId || undefined,
      });
      const stream = chunk(result, 3000, 30);

      dispatch(jobs.fetchSuccess(parentJobId, stream));
    } catch (e) {
      dispatch(catchApiError(e));
    } finally {
      dispatch(loadingEnd());
    }
  };

export const abort = (parentJob?: string) => (dispatch: AppDispatch) => {
  dispatch(jobs.abort(parentJob));
};

export const clear = () => (dispatch: AppDispatch) => {
  dispatch(jobs.clear());
};

export const resume =
  (stream: Stream<Job>, parentJobId?: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch(jobs.resume(parentJobId));

    const { value: items = [], done } = await stream.next();
    dispatch(jobs.evalStream(parentJobId, stream, items));
    if (done) {
      dispatch(jobs.done(parentJobId));
    }

    return done;
  };
