import snapshotDiff from 'snapshot-diff';

// @ts-ignore
import reducer, { __get__, actions } from '../stampWidget';

const ACTIONS = __get__('ACTIONS');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTIONS.TOGGLE, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(initialState, actions.toggle());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(`${ACTIONS.TOGGLE} from false to true`, () => {
    // Arrange
    const prev = { isOpened: false };
    // Act
    const next = reducer(prev, actions.toggle());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
