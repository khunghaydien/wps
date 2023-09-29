import { act, renderHook } from '@testing-library/react-hooks';

import { useLevelState } from '../useLevelState';

const level1 = [
  {
    id: '11',
    code: 'C12',
    name: 'First Level Job11',
    hasChildren: false,
  },
  {
    id: '12',
    code: 'C12',
    name: 'First Level Job12',
    hasChildren: true,
  },
  {
    id: '13',
    code: 'C13',
    name: 'First Level Job13',
    hasChildren: false,
  },
];
const level2 = [
  {
    id: '21',
    code: 'C12',
    name: 'Level Job11',
    hasChildren: false,
  },
  {
    id: '22',
    code: 'C12',
    name: 'Level Job12',
    hasChildren: true,
  },
];

describe('select()', () => {
  test('should get first level jobs on mounting hook', async () => {
    // Arrange
    const searchChildren = jest.fn().mockReturnValue(level1);

    // Act
    const { result, waitForNextUpdate } = renderHook(() =>
      useLevelState({
        searchChildren,
      })
    );
    result.current.initialize();

    // Assert
    await waitForNextUpdate({ timeout: 100 });

    const { key: _key, ...actual } = result.current.state[0];
    expect(actual).toEqual({
      level: 0,
      value: level1,
      searchQuery: { parent: undefined, codeOrName: '' },
    });
  });
  test('should update current selected item', async () => {
    // Arrange
    const searchChildren = jest
      .fn()
      .mockReturnValue(level1)
      .mockReturnValue(level2);

    const { result, waitForNextUpdate } = renderHook(() =>
      useLevelState({
        searchChildren,
      })
    );
    result.current.initialize();
    await waitForNextUpdate({ timeout: 100 });

    // Act
    act(() => {
      result.current.select(1, level1[1]);
    });

    // Assert
    await waitForNextUpdate({ timeout: 100 });
    expect(result.current.current).toEqual(level1[1]);
  });
  test('should update selected items', async () => {
    // Arrange
    const searchChildren = jest
      .fn()
      .mockReturnValue(level1)
      .mockReturnValue(level2);

    const { result, waitForNextUpdate } = renderHook(() =>
      useLevelState({
        searchChildren,
      })
    );
    result.current.initialize();
    await waitForNextUpdate({ timeout: 100 });

    // Act
    act(() => {
      result.current.select(0, level1[1]);
      result.current.select(1, level2[0]);
    });

    // Assert
    await waitForNextUpdate({ timeout: 100 });
    expect(result.current.selectedItems).toEqual([level1[1], level2[0]]);
  });
  test('should update state', async () => {
    // Arrange
    const searchChildren = jest
      .fn()
      .mockReturnValue(level1)
      .mockReturnValue(level2);

    const { result, waitForNextUpdate } = renderHook(() =>
      useLevelState({
        searchChildren,
      })
    );
    result.current.initialize();
    await waitForNextUpdate({ timeout: 100 });

    // Act
    act(() => {
      result.current.select(0, level1[1]);
      result.current.select(1, level2[0]);
    });

    // Assert
    await waitForNextUpdate({ timeout: 100 });
    const { key: _key, ...actual } = result.current.state[1];
    expect(actual).toEqual({
      level: 1,
      value: level2,
      searchQuery: { parent: level1[1], codeOrName: '' },
    });
  });
});

describe('clear()', () => {
  test('should reset state', async () => {
    // Arrange
    const searchChildren = jest
      .fn()
      .mockReturnValue(level1)
      .mockReturnValue(level2);

    const { result, waitForNextUpdate } = renderHook(() =>
      useLevelState({
        searchChildren,
      })
    );
    result.current.initialize();
    await waitForNextUpdate({ timeout: 100 });

    act(() => {
      result.current.select(0, level1[1]);
      result.current.select(1, level2[0]);
    });

    await waitForNextUpdate({ timeout: 100 });

    // Act
    act(() => result.current.clear());

    // Assert
    expect([
      result.current.state,
      result.current.selectedItems,
      result.current.current,
    ]).toEqual([[], [], null]);
  });
});
