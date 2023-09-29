import snapshotDiff from 'snapshot-diff';

import request from '../../__tests__/mocks/request';
import requestState from '../../__tests__/mocks/requestState';
import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../monthlyRequest';

const ACTION_TYPE = __get__('ACTION_TYPE');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.INIT, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(initialState, actions.initialize(request));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.UPDATE, () => {
    // Arrange
    const prev = {
      ...initialState,
      request,
    };
    // Act
    const next = reducer(prev, actions.update('reason', 'reason2'));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.CLEAR, () => {
    // Arrange
    const prev = {
      ...initialState,
      request,
    };
    // Act
    const next = reducer(prev, actions.clear());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.SETOVERTIME, () => {
    // Arrange
    const prev = initialState;
    // Act
    const { overtime, workSystem } = requestState.requests.monthlyRequest;
    const next = reducer(
      initialState,
      actions.setOvertime(overtime, workSystem)
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
