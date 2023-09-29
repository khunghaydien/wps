import nanoid from 'nanoid';

import { act, renderHook } from '@testing-library/react-hooks';

import useRestTimes from '../useRestTimes';
import { time } from '@attendance/__tests__/helpers';

jest.mock('nanoid', () => ({
  __esModule: true,
  default: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe('initialize', () => {
  it('should be [] if array is empty.', () => {
    // Arrange
    (nanoid as jest.Mock).mockImplementation(() => 'nanoid');
    const handler = jest.fn();

    // Act
    const { result } = renderHook(() =>
      useRestTimes({
        restTimes: [],
        updateRestTimesHandler: handler,
      })
    );

    // Assert
    expect(result.current[0]).toEqual([]);
    expect(handler).toBeCalledTimes(1);
    expect(handler).toBeCalledWith([]);
  });

  it('should append ID to each value.', () => {
    // Arrange
    (nanoid as jest.Mock).mockImplementation(() => 'nanoid');
    const handler = jest.fn();

    // Act
    const { result } = renderHook(() =>
      useRestTimes({
        restTimes: [
          {
            startTime: time(9),
            endTime: time(18),
            restReason: {
              id: 'id',
              code: 'CODE',
              name: 'Name1',
            },
          },
        ],
        updateRestTimesHandler: handler,
      })
    );

    // Assert
    expect(result.current[0]).toEqual([
      {
        id: 'nanoid',
        startTime: time(9),
        endTime: time(18),
        restReason: {
          id: 'id',
          code: 'CODE',
          name: 'Name1',
        },
      },
    ]);
    expect(handler).toBeCalledTimes(1);
    expect(handler).toBeCalledWith([
      {
        startTime: time(9),
        endTime: time(18),
        restReason: {
          id: 'id',
          code: 'CODE',
          name: 'Name1',
        },
      },
    ]);
  });
});

describe('actions', () => {
  const restTimes = [
    {
      startTime: time(11),
      endTime: time(11, 15),
      restReason: {
        id: 'id',
        code: 'CODE',
        name: 'Name1',
      },
    },
    {
      startTime: time(12),
      endTime: time(12, 15),
      restReason: {
        id: 'id',
        code: 'CODE',
        name: 'Name1',
      },
    },
    {
      startTime: time(13),
      endTime: time(13, 15),
      restReason: {
        id: 'id',
        code: 'CODE',
        name: 'Name1',
      },
    },
  ];
  describe('update', () => {
    it.each`
      key             | value
      ${'startTime'}  | ${time(7)}
      ${'endTime'}    | ${time(7)}
      ${'restReason'} | ${{ id: 'new', code: 'NEW_CODE', name: 'New code' }}
    `('should update [key=$key, value=$value]', ({ key, value }) => {
      // Arrange
      let i = 1;
      (nanoid as jest.Mock).mockImplementation(() => i++);
      const handler = jest.fn();

      // Act
      const { result } = renderHook(() =>
        useRestTimes({
          restTimes,
          updateRestTimesHandler: handler,
        })
      );
      act(() => {
        result.current[1].update(1, key, value);
      });

      // Assert
      expect(result.current[0]).toEqual([
        { ...restTimes[0], id: 1 },
        { ...restTimes[1], id: 2, [key]: value },
        { ...restTimes[2], id: 3 },
      ]);
      expect(handler).toBeCalledTimes(2);
      expect(handler).toHaveBeenNthCalledWith(1, restTimes);
      expect(handler).toHaveBeenNthCalledWith(2, [
        restTimes[0],
        { ...restTimes[1], [key]: value },
        restTimes[2],
      ]);
    });
  });
  describe('add', () => {
    it('should add', () => {
      // Arrange
      let i = 1;
      (nanoid as jest.Mock).mockImplementation(() => i++);
      const handler = jest.fn();

      // Act
      const { result } = renderHook(() =>
        useRestTimes({
          restTimes,
          updateRestTimesHandler: handler,
        })
      );
      act(() => {
        result.current[1].add();
      });

      // Assert
      expect(result.current[0]).toEqual([
        { ...restTimes[0], id: 1 },
        { ...restTimes[1], id: 2 },
        { ...restTimes[2], id: 3 },
        { id: 4, startTime: null, endTime: null, restReason: null },
      ]);
      expect(handler).toBeCalledTimes(2);
      expect(handler).toHaveBeenNthCalledWith(1, restTimes);
      expect(handler).toHaveBeenNthCalledWith(2, [
        restTimes[0],
        restTimes[1],
        restTimes[2],
        { startTime: null, endTime: null, restReason: null },
      ]);
    });
  });
  describe('remove', () => {
    it('should remove', () => {
      // Arrange
      let i = 1;
      (nanoid as jest.Mock).mockImplementation(() => i++);
      const handler = jest.fn();

      // Act
      const { result } = renderHook(() =>
        useRestTimes({
          restTimes,
          updateRestTimesHandler: handler,
        })
      );
      act(() => {
        result.current[1].remove(1);
      });

      // Assert
      expect(result.current[0]).toEqual([
        { ...restTimes[0], id: 1 },
        { ...restTimes[2], id: 3 },
      ]);
      expect(handler).toBeCalledTimes(2);
      expect(handler).toHaveBeenNthCalledWith(1, restTimes);
      expect(handler).toHaveBeenNthCalledWith(2, [restTimes[0], restTimes[2]]);
    });
  });
});
