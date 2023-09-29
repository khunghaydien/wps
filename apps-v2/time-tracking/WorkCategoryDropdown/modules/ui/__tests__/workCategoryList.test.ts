import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  ADD,
  CLEAR,
  initialState,
} from '../workCategoryList';

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ADD, () => {
    const next = reducer(
      initialState,
      actions.add({
        targetDate: '2019-10-10',
        jobId: '0a0a0a0a0a',
        workCategoryIds: ['a', 'b', 'c'],
      })
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(CLEAR, () => {
    const prev = reducer(
      initialState,
      actions.add({
        targetDate: '2019-10-10',
        jobId: '0a0a0a0a0a',
        workCategoryIds: ['a', 'b', 'c'],
      })
    );
    const next = reducer(prev, actions.clear());
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
