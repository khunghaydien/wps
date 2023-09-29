import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  CLEAR,
  FETCH_SUCCESS,
  initialState,
} from '../workCategories';
import { payload } from './mocks/workCategories.mock';

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(FETCH_SUCCESS, () => {
    const next = reducer(initialState, actions.fetchSuccess(payload));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(CLEAR, () => {
    // Arrange
    const prev = initialState;

    // Act
    const next = [actions.fetchSuccess(payload), actions.clear()].reduce(
      reducer,
      prev
    );

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
