import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../leaveRequest';
import leaveRequest from './mock-data/leaveRequest';

const initialState = __get__('initialState');
const INITIALIZE = __get__('INITIALIZE');
const UPDATE = __get__('UPDATE');
const UPDATE_HAS_RANGE = __get__('UPDATE_HAS_RANGE');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(INITIALIZE, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(
      initialState,
      actions.initialize(leaveRequest.request, leaveRequest.attLeaveList)
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(UPDATE, () => {
    // Arrange
    const prev = leaveRequest;
    // Act
    const next = reducer(
      leaveRequest,
      actions.update('reason', 'testですtestです。')
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(UPDATE_HAS_RANGE, () => {
    // Arrange
    const prev = leaveRequest;
    // Act
    const next = reducer(leaveRequest, actions.updateHasRange(true));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
