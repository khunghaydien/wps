import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  initialState,
  SET_SELECTED_ROW_INDEX,
} from '../list';

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(SET_SELECTED_ROW_INDEX, () => {
    const next = reducer(initialState, actions.setSelectedRowIndex(0));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
