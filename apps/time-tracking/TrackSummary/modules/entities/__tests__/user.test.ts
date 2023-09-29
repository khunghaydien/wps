import snapshotDiff from 'snapshot-diff';

import reducer, { actions, initialState, RESET, SET } from '../user';
import user from './mocks/user.mock';

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(SET, () => {
    const next = reducer(initialState, actions.set(user));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(RESET, () => {
    const init = reducer(initialState, actions.set(user));
    const next = reducer(initialState, actions.reset());
    expect(snapshotDiff(init, next)).toMatchSnapshot();
  });
});
