import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  CLOSE_POPUP,
  initialState,
  OPEN_POPUP,
} from '../eventEditPopup';

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(OPEN_POPUP, () => {
    const next = reducer(
      initialState,
      actions.open({
        top: 215,
        left: 20,
      })
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(CLOSE_POPUP, () => {
    const next = reducer(initialState, actions.close());
    expect(
      snapshotDiff({ isOpen: true, top: 215, left: 20 }, next)
    ).toMatchSnapshot();
  });
});
