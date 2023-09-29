import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../directRequest';
import directRequest from './mock-data/directRequest';

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
      actions.initialize(directRequest.request)
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(UPDATE, () => {
    // Arrange
    const prev = directRequest;
    // Act
    const next = reducer(
      directRequest,
      actions.update('reason', 'testですtestです。')
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(UPDATE_HAS_RANGE, () => {
    // Arrange
    const prev = directRequest;
    // Act
    const next = reducer(directRequest, actions.updateHasRange(true));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
