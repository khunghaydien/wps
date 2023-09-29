import snapshotDiff from 'snapshot-diff';

import { CLOSE, OPEN } from '../constants';

import { close } from '../actions';

// @ts-ignore
import reducer, { __get__ } from '../index';

const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(OPEN, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(initialState, { type: OPEN });
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(CLOSE, () => {
    // Arrange
    const prev = { isOpen: true };
    // Act
    const next = reducer(initialState, close());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
