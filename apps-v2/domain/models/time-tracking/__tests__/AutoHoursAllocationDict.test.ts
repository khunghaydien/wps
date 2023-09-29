import {
  // @ts-ignore
  __get__,
  updatePrioritiesOnChangeItemPriority,
  updatePrioritiesOnRemoveItem,
} from '../AutoHoursAllocationDict';

describe('updatePrioritiesOnChangeItemPriority(priorities, dictItems, nextPriority)', () => {
  test('If there is a target', () => {
    // Arrange
    const dictItems = {
      A: { key: 'A', priority: 1, anyFields: 'A' },
      B: { key: 'B', priority: 2, anyFields: 'B' },
      C: { key: 'C', priority: 4, anyFields: 'C' },
      D: { key: 'D', priority: 5, anyFields: 'D' },
      E: { key: 'E', priority: 7, anyFields: 'E' },
      F: { key: 'F', priority: 8, anyFields: 'F' },
    };
    const targetKey = 'C';
    const targetPri = 2;
    const expected = {
      A: { key: 'A', priority: 1, anyFields: 'A' },
      B: { key: 'B', priority: 3, anyFields: 'B' }, // <-To be updated
      C: { key: 'C', priority: 2, anyFields: 'C' }, // <-To be updated
      D: { key: 'D', priority: 4, anyFields: 'D' }, // <-To be updated
      E: { key: 'E', priority: 7, anyFields: 'E' },
      F: { key: 'F', priority: 8, anyFields: 'F' },
    };

    // Act
    const result = updatePrioritiesOnChangeItemPriority(
      dictItems as any,
      targetKey,
      targetPri
    );

    // Assert
    expect(result).toEqual(expected);
  });
});

describe('updatePrioritiesOnRemoveItem(dictItems, targetKey)', () => {
  test('If there is a target', () => {
    // Arrange
    const dictItems = {
      A: { key: 'A', priority: 1, anyFields: 'A' },
      B: { key: 'B', priority: 2, anyFields: 'B' },
      C: { key: 'C', priority: 4, anyFields: 'C' },
      D: { key: 'D', priority: 5, anyFields: 'D' },
      E: { key: 'E', priority: 7, anyFields: 'E' },
      F: { key: 'F', priority: 8, anyFields: 'F' },
    };
    const targetKey = 'C';
    const expected = {
      A: { key: 'A', priority: 1, anyFields: 'A' },
      B: { key: 'B', priority: 2, anyFields: 'B' },
      // C: { key: 'C', priority: 4, anyFields: 'C' }, <-To be removed
      D: { key: 'D', priority: 4, anyFields: 'D' }, // <-To be updated
      E: { key: 'E', priority: 7, anyFields: 'E' }, // <-Not to be updated
      F: { key: 'F', priority: 8, anyFields: 'F' }, // <-Not to be updated
    };

    // Act
    const result = updatePrioritiesOnRemoveItem(dictItems as any, targetKey);

    // Assert
    expect(result).toEqual(expected);
  });
});

describe.skip('updatePriority(priorities, targetKey, targetPriority)', () => {
  const updatePriority = __get__('updatePriority');

  test('If there is a target', () => {
    // Arrange                 ****************
    const priorities = { A: 1, B: 2, C: 4, D: 5, E: 7, F: 8 };
    const targetKey = 'C';
    const targetPri = 2; //  ****************
    const expected = { A: 1, B: 3, C: 2, D: 4, E: 7, F: 8 };

    // Act
    const result = updatePriority(priorities, targetKey, targetPri);

    // Assert
    expect(result).toEqual(expected);
  });
});

describe.skip('removePriority(priorities, targetKey)', () => {
  const removePriority = __get__('removePriority');

  test('If there is a target', () => {
    // Arrange                       **********
    const priorities = { A: 1, B: 2, C: 4, D: 5, E: 7, F: 8 };
    const targetKey = 'C'; //      ****
    const expected = { A: 1, B: 2, D: 4, E: 7, F: 8 };

    // Act
    const result = removePriority(priorities, targetKey);

    // Assert
    expect(result).toEqual(expected);
  });
});

describe.skip('shiftPriorities(priorities, startAt)', () => {
  const shiftPriorities = __get__('shiftPriorities');

  test('If there is a target', () => {
    // Arrange                       **********
    const priorities = { A: 1, B: 2, C: 4, D: 5, E: 7, F: 8 };
    const startAt = 4; //          **********
    const expected = { A: 1, B: 2, C: 3, D: 4, E: 7, F: 8 };

    // Act
    const result = shiftPriorities(priorities, startAt);

    // Assert
    expect(result).toEqual(expected);
  });

  test('If there is no target', () => {
    // Arrange
    const priorities = { A: 1, B: 2, C: 4, D: 5, E: 7, F: 8 };
    const startAt = 3;
    const expected = priorities;

    // Act
    const result = shiftPriorities(priorities, startAt);

    // Assert
    expect(result).toEqual(expected);
  });
});

describe.skip('unshiftPriorities(priorities, startAt)', () => {
  const unshiftPriorities = __get__('unshiftPriorities');

  test('If there is a target', () => {
    // Arrange                       **********
    const priorities = { A: 1, B: 2, C: 4, D: 5, E: 7, F: 8 };
    const startAt = 4; //          **********
    const expected = { A: 1, B: 2, C: 5, D: 6, E: 7, F: 8 };

    // Act
    const result = unshiftPriorities(priorities, startAt);

    // Assert
    expect(result).toEqual(expected);
  });

  test('If there is no target', () => {
    // Arrange
    const priorities = { A: 1, B: 2, C: 4, D: 5, E: 7, F: 8 };
    const startAt = 3;
    const expected = priorities;

    // Act
    const result = unshiftPriorities(priorities, startAt);

    // Assert
    expect(result).toEqual(expected);
  });
});
