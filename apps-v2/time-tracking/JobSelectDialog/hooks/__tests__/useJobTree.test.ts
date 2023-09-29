import { act, renderHook } from '@testing-library/react-hooks';

import useJobTree from '../useJobTree';

jest.mock('nanoid', () => {
  let i = 0;
  return jest.fn().mockImplementation(() => {
    if (i >= 3) {
      i = 0;
    }
    // eslint-disable-next-line no-plusplus
    return (i++).toString();
  });
});
beforeEach(() => {
  jest.clearAllMocks();
});

const jobTree = [
  // level1
  [
    {
      id: '1',
      code: '1',
      name: '1',
      hasChildren: true,
      parentId: null,
    },
  ], // level2
  [
    {
      id: '02',
      code: '02',
      name: '02',
      hasChildren: true,
      parentId: '1',
    },
    {
      id: '03',
      code: '03',
      name: '03',
      hasChildren: true,
      parentId: '1',
    },
    {
      id: '04',
      code: '04',
      name: '04',
      hasChildren: true,
      parentId: '1',
    },
  ], // level3
  [
    {
      id: '005',
      code: '005',
      name: '005',
      hasChildren: false,
      parentId: '03',
    },
  ],
] as any;

const searchQuery = { parentJobId: '', codeOrName: '' };

describe('append', () => {
  it('should append children of a given parent', () => {
    // Arrange
    const { result } = renderHook(() => useJobTree());

    // Act
    const [level1, level2, level3] = jobTree;
    act(() => {
      result.current.append(level1, searchQuery);
      result.current.append(level2, searchQuery);
      result.current.append(level3, searchQuery);
    });

    // Assert
    const expected = [
      { key: '0', value: level1, searchQuery },
      { key: '1', value: level2, searchQuery },
      { key: '2', value: level3, searchQuery },
    ];
    expect(result.current.state).toStrictEqual(expected);
  });
});

describe('getLevelByKey', () => {
  it('should return the level(0-based) for given key', () => {
    const SAMPLE_LEVEL = 1;

    // Arrange
    const { result } = renderHook(() => useJobTree());

    // Act
    const [level1, level2, level3] = jobTree;
    act(() => {
      result.current.append(level1, searchQuery);
      result.current.append(level2, searchQuery);
      result.current.append(level3, searchQuery);
    });
    const key = result.current.state[SAMPLE_LEVEL].key;
    const level = result.current.getLevelByKey(key);

    // Assert
    expect(level).toEqual(SAMPLE_LEVEL);
  });
});

describe('remove', () => {
  it('should remove the item with the given key and its descendants', () => {
    // Arrange
    const { result } = renderHook(() => useJobTree());

    // Act
    const [level1, level2, level3] = jobTree;
    act(() => {
      result.current.append(level1, searchQuery);
      result.current.append(level2, searchQuery);
      result.current.append(level3, searchQuery);
      result.current.remove('1');
    });

    // Assert
    const expected = [{ key: '0', value: level1, searchQuery }];
    expect(result.current.state).toStrictEqual(expected);
  });
  it('should not remove any item and descendants if a item having a given key is not found', () => {
    // Arrange
    const { result } = renderHook(() => useJobTree());

    // Act
    const [level1, level2, level3] = jobTree;
    act(() => {
      result.current.append(level1, searchQuery);
      result.current.append(level2, searchQuery);
      result.current.append(level3, searchQuery);
      result.current.remove('100');
    });

    // Assert
    const expected = [
      { key: '0', value: level1, searchQuery },
      { key: '1', value: level2, searchQuery },
      { key: '2', value: level3, searchQuery },
    ];
    expect(result.current.state).toStrictEqual(expected);
  });
});

describe('removeBelow', () => {
  it('should remove descendants of a parent having a given key', () => {
    // Arrange
    const { result } = renderHook(() => useJobTree());

    // Act
    const [level1, level2, level3] = jobTree;
    act(() => {
      result.current.append(level1, searchQuery);
      result.current.append(level2, searchQuery);
      result.current.append(level3, searchQuery);
      result.current.removeBelow('0');
    });

    // Assert
    const expected = [{ key: '0', value: level1, searchQuery }];
    expect(result.current.state).toStrictEqual(expected);
  });
  it('should not remove any descendants if a parent having a given key is not found', () => {
    // Arrange
    const { result } = renderHook(() => useJobTree());

    // Act
    const [level1, level2, level3] = jobTree;
    act(() => {
      result.current.append(level1, searchQuery);
      result.current.append(level2, searchQuery);
      result.current.append(level3, searchQuery);
      result.current.removeBelow('100');
    });

    // Assert
    const expected = [
      { key: '0', value: level1, searchQuery },
      { key: '1', value: level2, searchQuery },
      { key: '2', value: level3, searchQuery },
    ];
    expect(result.current.state).toStrictEqual(expected);
  });
});

describe('reset', () => {
  it('should reset jobTree to initial state', () => {
    // Arrange
    const { result } = renderHook(() => useJobTree());

    // Act
    const [level1, level2, level3] = jobTree;
    act(() => {
      result.current.append(level1, searchQuery);
      result.current.append(level2, searchQuery);
      result.current.append(level3, searchQuery);
      result.current.reset();
    });

    // Assert
    const expected = [];
    expect(result.current.state).toStrictEqual(expected);
  });
});
