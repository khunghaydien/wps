import { act, renderHook } from '@testing-library/react-hooks';
import snapshotDiff from 'snapshot-diff';

import { useFilter } from '../index';
import jobs from './mocks/jobs';

describe('useFilter()', () => {
  const selector = (job) => `${job.code} ${job.name}`;

  it('should change value to given value from event handler', () => {
    const { result } = renderHook(() => useFilter(jobs, selector));

    act(() => {
      result.current[2](
        {
          currentTarget: {
            value: 'Development',
          },
        } as any,
        ['Development']
      );
    });

    expect(result.current[0]).toBe('Development');
  });

  it('should filter by given terms from event handler', () => {
    const { result } = renderHook(() => useFilter(jobs, selector));

    act(() => {
      result.current[2](
        {
          currentTarget: {
            value: 'Development',
          },
        } as any,
        ['Development']
      );
    });

    expect(snapshotDiff(jobs, result.current[1])).toMatchSnapshot();
  });

  it('should filter case-insensitive', () => {
    const { result } = renderHook(() => useFilter(jobs, selector));

    act(() => {
      result.current[2](
        {
          currentTarget: {
            value: 'Recruiting',
          },
        } as any,
        ['Recruiting']
      );
    });

    expect(snapshotDiff(jobs, result.current[1])).toMatchSnapshot();
  });

  it('should filter by AND-search', () => {
    const { result } = renderHook(() => useFilter(jobs, selector));

    act(() => {
      result.current[2](
        {
          currentTarget: {
            value: 'External Activities',
          },
        } as any,
        ['External', 'Activities']
      );
    });

    expect(snapshotDiff(jobs, result.current[1])).toMatchSnapshot();
  });

  it('should escape items to process by RegExp.', () => {
    // Arrange
    const items = [{ value: '[ \\ ^ $ . | ? * + ( )' }];
    const { result } = renderHook(() => useFilter(items, ({ value }) => value));

    // Act
    const [_i, _filteredItems, onChange] = result.current;
    const event = { currentTarget: { value: '[ \\ ^ $ . | ? * + ( )' } };
    const terms = ['\\', '^', '$', '.', '|', '?', '*', '+', '(', ')'];
    act(() => {
      onChange(event as any, terms);
    });

    // Assert
    const [inputValue, filteredItems] = result.current;
    const expected = [
      '[ \\ ^ $ . | ? * + ( )',
      [{ value: '[ \\ ^ $ . | ? * + ( )' }],
    ];
    expect([inputValue, filteredItems]).toEqual(expected);
  });
});
