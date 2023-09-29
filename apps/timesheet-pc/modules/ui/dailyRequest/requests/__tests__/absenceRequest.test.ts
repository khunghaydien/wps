import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../absenceRequest';
import absenceRequest from './mock-data/absenceRequest';

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
      actions.initialize(absenceRequest.request)
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(UPDATE, () => {
    // Arrange
    const prev = absenceRequest;
    // Act
    const next = reducer(
      absenceRequest,
      actions.update('reason', 'testですtestです。')
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(UPDATE_HAS_RANGE, () => {
    // Arrange
    const prev = absenceRequest;
    // Act
    const next = reducer(absenceRequest, actions.updateHasRange(true));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
