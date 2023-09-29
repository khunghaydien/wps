import snapshotDiff from 'snapshot-diff';

import reducer, {
  ACTION_TYPE,
  actions,
  initialState,
  OPTION_VALUE,
} from '../../pattern/tab';

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(ACTION_TYPE.SET, () => {
    const next = reducer(initialState, actions.set(OPTION_VALUE.CHOSEN));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(ACTION_TYPE.RESET, () => {
    const prev = {
      tabValue: OPTION_VALUE.CHOSEN,
    };
    const next = reducer(prev, actions.reset());
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
