import snapshotDiff from 'snapshot-diff';

// @ts-ignore
import reducer, { __get__, actions, DIALOG_TYPE } from '../dialog';

const ACTIONS = __get__('ACTIONS');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@INIT', () => {
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(`${ACTIONS.OPEN}`, () => {
    // Arrange
    const prev = initialState;

    // Run
    const next = reducer(
      initialState,
      actions.open(DIALOG_TYPE.AttDailyRequest)
    );

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(`${ACTIONS.CLOSE}`, () => {
    // Arrange
    const prev = initialState;

    // Run
    const next = reducer(initialState, actions.close());

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
