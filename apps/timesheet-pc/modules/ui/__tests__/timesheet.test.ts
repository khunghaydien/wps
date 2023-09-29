import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../timesheet';

const ACTION_TYPES = __get__('ACTION_TYPES');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTION_TYPES.TOGGLE_MAN_HOURS_GRAPH, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(initialState, actions.toggleManHoursGraph());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(`${ACTION_TYPES.TOGGLE_MAN_HOURS_GRAPH} from true to false`, () => {
    // Arrange
    const prev = { isManHoursGraphOpened: true };
    // Act
    const next = reducer(prev, actions.toggleManHoursGraph());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
