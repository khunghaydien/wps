import snapshotDiff from 'snapshot-diff';

import reducer, { actions, FETCH_SUCCESS } from '../requestAlert';

describe('reducer()', () => {
  test(FETCH_SUCCESS, () => {
    // Arrange
    const initialState = {
      id: '',
      startDate: new Date(2019, 3, 1),
      endDate: new Date(2100, 11, 31),
      alert: false,
    };

    const response = {
      id: '1',
      startDate: new Date(2021, 1, 1),
      endDate: new Date(2021, 1, 28),
      alert: true,
    };

    // Act
    const next = reducer(initialState, actions.fetchSuccess(response));

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
