import snapshotDiff from 'snapshot-diff';

import SearchStrategy from '../../../../../../widgets/dialogs/ProxyEmployeeSelectDialog/models/SearchStrategy';

import { employeeRecords } from '../../../../../../widgets/dialogs/ProxyEmployeeSelectDialog/mocks/EmployeeRecords';
// @ts-ignore
import reducer, { __get__, actions } from '../operation';

const ACTIONS = __get__('ACTIONS');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@INIT', () => {
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(`${ACTIONS.CLEAR}`, () => {
    // Arrange
    const prev = initialState;

    // Run
    const next = reducer(initialState, actions.clear());

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(`${ACTIONS.OVER_LIMIT}`, () => {
    // Arrange
    const prev = initialState;

    // Run
    const next = reducer(initialState, actions.overLimit(true));

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(`${ACTIONS.SWITCH_SEARCH_STRATEGY}`, () => {
    // Arrange
    const prev = initialState;

    // Run
    const next = reducer(
      initialState,
      actions.switchSearchStrategy(SearchStrategy.SEARCH_BY_QUERIES)
    );

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(`${ACTIONS.EDIT_DEPARTMENT_CODE}`.toString(), () => {
    // Arrange
    const prev = initialState;

    // Run
    const next = reducer(
      initialState,
      actions.editDepartmentCode('testDepartmentCode')
    );

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(`${ACTIONS.EDIT_DEPARTMENT_NAME}`, () => {
    // Arrange
    const prev = initialState;

    // Run
    const next = reducer(
      initialState,
      actions.editDepartmentName('testDepartmentName')
    );

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(`${ACTIONS.EDIT_EMPLOYEE_CODE}`, () => {
    // Arrange
    const prev = initialState;

    // Run
    const next = reducer(
      initialState,
      actions.editEmployeeCode('testEmployeeCode')
    );

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(`${ACTIONS.EDIT_EMPLOYEE_NAME}`, () => {
    // Arrange
    const prev = initialState;

    // Run
    const next = reducer(
      initialState,
      actions.editEmployeeName('testEmployeeName')
    );

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(`${ACTIONS.EDIT_TITLE}`, () => {
    // Arrange
    const prev = initialState;

    // Run
    const next = reducer(initialState, actions.editTitle('testTitleName'));

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(`${ACTIONS.SET_TARGET_DATE}`, () => {
    // Arrange
    const prev = initialState;

    // Run
    const next = reducer(initialState, actions.setTargetDate('2019-11-15'));

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(`${ACTIONS.EDIT_TITLE}`, () => {
    // Arrange
    const prev = initialState;

    // Run
    const next = reducer(
      initialState,
      actions.selectEmployee(employeeRecords.records[0].id)
    );

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
