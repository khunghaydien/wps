import { act, renderHook } from '@testing-library/react-hooks';

import useBreadcrumb from '../useBreadcrumb';

it('should reset breadcrumb', () => {
  // Arrange
  const { result } = renderHook(() => useBreadcrumb());

  const item1 = { id: 'item1' };
  const item2 = { id: 'item2' };
  const item3 = { id: 'item3' };

  // Act
  act(() => {
    result.current.visit(0, item1);
    result.current.visit(1, item2);
    result.current.visit(2, item3);
    result.current.reset();
  });

  // Assert
  expect(result.current.current).toBe(null);
});

it.each(['item1', 'item2', 'item3'])('should visit %p', (expectedItem) => {
  // Arrange
  const { result } = renderHook(() => useBreadcrumb());

  const item1 = { id: 'item1' };
  const item2 = { id: 'item2' };
  const item3 = { id: 'item3' };

  // Act
  act(() => {
    result.current.visit(0, item1);
    result.current.visit(1, item2);
    result.current.visit(2, item3);
  });

  // Assert
  expect(result.current.isVisited({ id: expectedItem })).toBe(true);
});

it('should go back any visited items', () => {
  // Arrange
  const { result } = renderHook(() => useBreadcrumb());

  const item1 = { id: 'item1' };
  const item2 = { id: 'item2' };
  const item3 = { id: 'item3' };

  // Act
  act(() => {
    result.current.visit(0, item1);
    result.current.visit(1, item2);
    result.current.visit(2, item3);

    result.current.visit(1, item2);
  });

  // Assert
  const expected = {
    item1: true,
    item2: true,
    item3: false,
  };
  const actual = {
    item1: result.current.isVisited(item1),
    item2: result.current.isVisited(item2),
    item3: result.current.isVisited(item3),
  };
  expect(actual).toStrictEqual(expected);
});

it('should visit another item in the same level', () => {
  // Arrange
  const { result } = renderHook(() => useBreadcrumb());

  const item1 = { id: 'item1' };
  const item2 = { id: 'item2' };
  const item3 = { id: 'item3' };
  const item4 = { id: 'item4' };
  const item22 = { id: 'item2-2' };

  // Act
  act(() => {
    result.current.visit(0, item1);
    result.current.visit(1, item2);
    result.current.visit(2, item3);
    result.current.visit(3, item4);

    result.current.visit(1, item22);
  });

  // Assert
  const expected = {
    item1: true,
    item2: false,
    item3: false,
    item4: false,
    item22: true,
  };
  const actual = {
    item1: result.current.isVisited(item1),
    item2: result.current.isVisited(item2),
    item3: result.current.isVisited(item3),
    item4: result.current.isVisited(item4),
    item22: result.current.isVisited(item22),
  };
  expect(actual).toStrictEqual(expected);
});

it('should should leave from the specified level', () => {
  // Arrange
  const { result } = renderHook(() => useBreadcrumb());

  const item1 = { id: 'item1' };
  const item2 = { id: 'item2' };
  const item3 = { id: 'item3' };
  const item4 = { id: 'item4' };

  // Act
  act(() => {
    result.current.visit(0, item1);
    result.current.visit(1, item2);
    result.current.visit(2, item3);
    result.current.visit(3, item4);

    result.current.leave(1);
  });

  // Assert
  const expected = {
    item1: true,
    item2: false,
    item3: false,
    item4: false,
  };
  const actual = {
    item1: result.current.isVisited(item1),
    item2: result.current.isVisited(item2),
    item3: result.current.isVisited(item3),
    item4: result.current.isVisited(item4),
  };
  expect(actual).toStrictEqual(expected);
});

it.each([null, undefined])(
  'should reset breadcrumb when %p is given',
  (empty) => {
    // Arrange
    const { result } = renderHook(() => useBreadcrumb());

    const item1 = { id: 'item1' };
    const item2 = { id: 'item2' };
    const item3 = { id: 'item3' };

    // Act
    act(() => {
      result.current.visit(0, item1);
      result.current.visit(1, item2);
      result.current.visit(2, item3);

      result.current.visit(empty);
    });

    // Assert
    const expected = {
      item1: false,
      item2: false,
      item3: false,
    };
    const actual = {
      item1: result.current.isVisited(item1),
      item2: result.current.isVisited(item2),
      item3: result.current.isVisited(item3),
    };
    expect(actual).toStrictEqual(expected);
  }
);

it('should return current item', () => {
  // Arrange
  const { result } = renderHook(() => useBreadcrumb());

  const item1 = { id: 'item1' };
  const item2 = { id: 'item2' };
  const item3 = { id: 'item3' };

  // Act
  act(() => {
    result.current.visit(0, item1);
    result.current.visit(1, item2);
    result.current.visit(2, item3);
    result.current.visit(1, item2);
  });

  // Assert
  expect(result.current.current).toStrictEqual(item2);
});
