import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../holidayWorkRequest';
import { defaultValue, patterns } from './mock-data/holidayWorkRequest';

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
      actions.initialize(defaultValue.request)
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  describe(UPDATE, () => {
    it('should not set.', () => {
      // Arrange
      const prev = initialState;
      // Act
      const next = reducer(
        prev,
        actions.update('reason', 'testですtestです。')
      );
      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    it('should set.', () => {
      // Arrange
      const prev = defaultValue;
      // Act
      const next = reducer(
        prev,
        actions.update('reason', 'testですtestです。')
      );
      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    it('should set code', () => {
      // Arrange
      const prev = {
        request: {
          ...defaultValue.request,
          patterns,
          patternCode: patterns[0].code,
        },
        selectedAttPattern: patterns[0],
      };
      // Act
      const next = reducer(
        prev,
        actions.update('patternCode', patterns[1].code)
      );
      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
  });
});
