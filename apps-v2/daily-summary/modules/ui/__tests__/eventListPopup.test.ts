import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  CLOSE_POPUP,
  initialState,
  MOVE_POPUP,
  OPEN_POPUP,
} from '../eventListPopup';

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(OPEN_POPUP, () => {
    const next = reducer(
      initialState,
      actions.open(new Date(2019, 1, 5), 117, 133)
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(CLOSE_POPUP, () => {
    const init = reducer(
      initialState,
      actions.open(new Date(2019, 1, 5), 117, 133)
    );
    const next = reducer(initialState, actions.close());
    expect(snapshotDiff(init, next)).toMatchSnapshot();
  });
  test(MOVE_POPUP, () => {
    const init = reducer(
      initialState,
      actions.open(new Date(2019, 1, 5), 117, 133)
    );
    const next = reducer(initialState, actions.move(200, 400));
    expect(snapshotDiff(init, next)).toMatchSnapshot();
  });
});
