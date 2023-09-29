import snapshotDiff from 'snapshot-diff';

// @ts-ignore
import reducer, { __get__, actions } from '../selectedPeriodStartDate';

const ACTIONS = __get__('ACTIONS');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@INIT', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff(undefined, next)).toMatchSnapshot();
  });
  test(ACTIONS.SET, () => {
    // Act
    const next = reducer(initialState, actions.set('2020-04-15'));

    // Assert
    expect(snapshotDiff('', next)).toMatchSnapshot();
  });
});
