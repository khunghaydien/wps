import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  initialize,
  setComment,
  State,
} from '../list';

const ACTION_TYPES = __get__('ACTION_TYPES');
const initialState = __get__('initialState');

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(`${ACTION_TYPES.INITIALIZE}`, () => {
    const prev: State = {
      comment: 'abc',
    };
    const next = reducer(prev, initialize());
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  it(`${ACTION_TYPES.SET_COMMENT}`, () => {
    const next = reducer(initialState, setComment('abc'));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
