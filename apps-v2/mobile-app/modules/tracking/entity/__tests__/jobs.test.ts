import snapshotDiff from 'snapshot-diff';

import { Job } from '../../../../../domain/models/time-tracking/Job';

import reducer, {
  ABORT,
  actions,
  CLEAR,
  DONE,
  EVAL_STREAM,
  FETCH_SUCCESS,
  initialState,
  RESUME,
} from '../jobs';
import { payload } from './mocks/jobs.mock';

async function* stream(): any {
  for (const item of payload) {
    yield item;
  }
}

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(FETCH_SUCCESS, () => {
    const next = reducer(
      initialState,
      actions.fetchSuccess('DEV-001', stream())
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(CLEAR, () => {
    // Arrange
    const prev = initialState;

    // Act
    const next = [
      actions.fetchSuccess('DEV-001', stream()),
      actions.clear(),
    ].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(EVAL_STREAM, () => {
    // Arrange
    const prev = initialState;

    // Act
    const next = [
      actions.fetchSuccess('DEV-001', stream()),
      actions.evalStream('DEV-001', stream(), payload as Job[]),
    ].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(ABORT, () => {
    // Arrange
    const parentId = 'DEV-001';
    const prev = [
      actions.fetchSuccess(parentId, stream()),
      actions.evalStream(parentId, stream(), payload as Job[]),
    ].reduce(reducer, initialState);

    // Act
    const next = [actions.abort(parentId)].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(RESUME, () => {
    // Arrange
    const parentId = 'DEV-001';
    const prev = [
      actions.fetchSuccess(parentId, stream()),
      actions.evalStream(parentId, stream(), payload as Job[]),
      actions.abort(parentId),
    ].reduce(reducer, initialState);

    // Act
    const next = [actions.resume(parentId)].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(DONE, () => {
    // Arrange
    const parentId = 'DEV-001';
    const prev = [
      actions.fetchSuccess(parentId, stream()),
      actions.evalStream(parentId, stream(), payload as Job[]),
      actions.abort(parentId),
      actions.resume(parentId),
    ].reduce(reducer, initialState);

    // Act
    const next = [actions.done(parentId)].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
