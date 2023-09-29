import snapshotDiff from 'snapshot-diff';

import reducer, { actions, initialState } from '../request';

describe('/TRACK_SUMMARY/UI/REQUEST', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it('UPDATE', () => {
    const next = reducer(initialState, actions.update({ isOpen: true }));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it('RESET', () => {
    const next = reducer(initialState, actions.reset());
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
