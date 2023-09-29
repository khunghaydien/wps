import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  INITIALIZE,
  initialState,
  SET_COMMENT,
  State,
} from '../detail';

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(`${INITIALIZE}`, () => {
    const prev: State = {
      comment: 'abc',
    };
    const next = reducer(prev, actions.initialize());
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  it(`${SET_COMMENT}`, () => {
    const next = reducer(initialState, actions.setComment('abc'));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
