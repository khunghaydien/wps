import debounce from 'lodash/debounce';

import { renderHook } from '@testing-library/react-hooks';

import { useDebouncedHandleChange } from '../index';

jest.mock('lodash/debounce', () => {
  return jest.fn((callback) => (e) => callback(e));
});

const debounceMock = debounce as jest.Mock;

describe('useDebounceHandleChange', () => {
  it('should call handler with Event and terms if `debounce` is given', () => {
    const handler = jest.fn();
    // @ts-ignore
    const eventMock = {
      persist: jest.fn(),
      target: {
        value: 'TEST',
      },
    } as React.SyntheticEvent<HTMLInputElement>;

    const { result } = renderHook(() =>
      useDebouncedHandleChange(false, 500, handler)
    );

    result.current(eventMock);
    expect(handler).toHaveBeenCalledWith(eventMock, ['TEST']);
  });

  it('should call handler with Event and terms if `debounce` is not given', () => {
    const handler = jest.fn();

    // @ts-ignore
    const eventMock = {
      persist: jest.fn(),
      target: {
        value: 'TEST',
      },
    } as React.SyntheticEvent<HTMLInputElement>;

    const { result } = renderHook(() =>
      useDebouncedHandleChange(true, 500, handler)
    );

    result.current(eventMock);
    expect(handler).toHaveBeenCalledWith(eventMock, ['TEST']);
  });

  it('should call event handler every `wait` milliseconds', () => {
    renderHook(() => useDebouncedHandleChange(true, 500, jest.fn()));

    expect(debounceMock.mock.calls[0][1]).toBe(500);
  });

  it('should call handler with terms', () => {
    const handler = jest.fn();

    // @ts-ignore
    const eventMock = {
      persist: jest.fn(),
      target: {
        value: '   Job1   2019 Meeting      ',
      },
    } as React.SyntheticEvent<HTMLInputElement>;

    const { result } = renderHook(() =>
      useDebouncedHandleChange(true, 500, handler)
    );

    result.current(eventMock);
    expect(handler).toHaveBeenCalledWith(eventMock, [
      'Job1',
      '2019',
      'Meeting',
    ]);
  });
});
