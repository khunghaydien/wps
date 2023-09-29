import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../mobileSetting';

const ACTIONS = __get__('ACTIONS');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTIONS.INITIALIZE, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(
      initialState,
      actions.initialize({
        requireLocationAtMobileStamp: true,
        useManageCommuteCount: true,
        defaultCommuteForwardCount: 0,
        defaultCommuteBackwardCount: 0,
      })
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
