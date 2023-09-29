import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  CLEAR,
  FETCH_SUCCESS,
  initialState,
} from '../workCategories';
import { workCategories } from './mocks/workCategories.mock';

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(FETCH_SUCCESS, () => {
    const next = reducer(initialState, actions.fetchSuccess(workCategories));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(CLEAR, () => {
    const init = reducer(initialState, actions.fetchSuccess(workCategories));
    const next = reducer(initialState, actions.clear());
    expect(snapshotDiff(init, next)).toMatchSnapshot();
  });
});
