import snapshotDiff from 'snapshot-diff';

import reducer, {
  ACTION_TYPE,
  actions,
  initialState,
} from '../searchCondition';

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(ACTION_TYPE.INIT, () => {
    const prev = {
      origin: {
        targetDate: '2023-03-10',
        code: '001',
        name: 'pattern',
        workSystem: 'flex',
        withoutCore: false,
      },
      new: {
        targetDate: '2023-03-10',
        code: '001',
        name: 'pattern',
        workSystem: 'flex',
        withoutCore: false,
      },
    };
    const next = reducer(prev, actions.initialize());
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  it(ACTION_TYPE.SET_NEW, () => {
    const next = reducer(initialState, actions.setNew('name', 'pattern003'));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(ACTION_TYPE.SET_ORIGIN, () => {
    const next = reducer(
      initialState,
      actions.setOrigin({
        targetDate: '2023-03-10',
        code: '001',
        name: 'pattern',
        workSystem: 'flex',
        withoutCore: false,
      })
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
