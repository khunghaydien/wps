import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../patternRequest';
import patternRequest from './mock-data/patternRequest';

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
      actions.initialize(patternRequest.request, patternRequest.attPatternList)
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(UPDATE, () => {
    // Arrange
    const prev = patternRequest;
    // Act
    const next = reducer(
      patternRequest,
      actions.update('reason', 'testですtestです。')
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(UPDATE_HAS_RANGE, () => {
    // Arrange
    const prev = patternRequest;
    // Act
    const next = reducer(patternRequest, actions.updateHasRange(true));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
