import { hasWorkCategory, includesNonDirectInput } from '../Task';

describe('hasWorkCategory()', () => {
  it.each`
    hasJobType | workCategoryId | expected
    ${true}    | ${'unique id'} | ${true}
    ${true}    | ${null}        | ${true}
    ${false}   | ${'unique id'} | ${true}
    ${false}   | ${null}        | ${false}
  `(
    'should be $expected for hasJobType($hasJobType) and workCategoryId($workCategoryId) of a given task ',
    ({ hasJobType, workCategoryId, expected }) => {
      // Arrange
      const task = { hasJobType, workCategoryId };

      // Act
      const actual = hasWorkCategory(task as any);

      // Assert
      expect(actual).toBe(expected);
    }
  );
});

describe('includesNonDirectInput()', () => {
  it.each`
    isDirectInput1 | isDirectInput2 | expected
    ${true}        | ${true}        | ${false}
    ${false}       | ${false}       | ${true}
    ${true}        | ${false}       | ${true}
  `(
    'should be $expected by containing task1($task1) and task2($task2) of a given task list',
    ({ isDirectInput1, isDirectInput2, expected }) => {
      // Act
      const actual = includesNonDirectInput([
        { isDirectInput: isDirectInput1 },
        { isDirectInput: isDirectInput2 },
      ]);

      // Assert
      expect(actual).toBe(expected);
    }
  );
});
