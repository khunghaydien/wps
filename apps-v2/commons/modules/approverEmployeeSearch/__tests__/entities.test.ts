import snapshotDiff from 'snapshot-diff';

import {
  convertedRecords,
  employeeRecords,
} from '../../../../../widgets/dialogs/ProxyEmployeeSelectDialog/mocks/EmployeeRecords';
// @ts-ignore
import reducer, { __get__, actions } from '../entities';

const ACTIONS = __get__('ACTIONS');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@INIT', () => {
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(`${ACTIONS.SET_BY_REPOSITORY_RESPONSE_DATA}`, () => {
    // Arrange
    const prev = initialState;

    // Run
    const next = reducer(
      initialState,
      actions.setByRepositoryResponseData(employeeRecords.records)
    );

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(`${ACTIONS.CLEAR}`, () => {
    // Arrange
    const prev = convertedRecords;

    // Run
    const next = reducer(convertedRecords, actions.clear());

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
