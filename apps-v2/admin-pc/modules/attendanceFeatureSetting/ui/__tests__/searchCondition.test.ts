import snapshotDiff from 'snapshot-diff';

import reducer, {
  ACTION_TYPE,
  actions,
  initialState,
} from '../searchCondition';

describe('reducer()', () => {
  it('@@init', () => {
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(ACTION_TYPE.INIT, () => {
    const state = {
      targetDate: '2019-10-01',
    };
    const next = reducer(state, actions.initialize());
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });
  it(ACTION_TYPE.SET, () => {
    const next = reducer(initialState, actions.set('targetDate', 'xxx'));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
