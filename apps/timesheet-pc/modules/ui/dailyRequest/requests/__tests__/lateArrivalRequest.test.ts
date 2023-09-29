import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../lateArrivalRequest';
import lateArrivalRequest from './mock-data/lateArrivalRequest';

const initialState = __get__('initialState');
const INITIALIZE = __get__('INITIALIZE');
const UPDATE = __get__('UPDATE');

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
      actions.initialize(lateArrivalRequest.request)
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(UPDATE, () => {
    // Arrange
    const prev = lateArrivalRequest;
    // Act
    const next = reducer(
      lateArrivalRequest,
      actions.update('reason', 'testですtestです。')
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
