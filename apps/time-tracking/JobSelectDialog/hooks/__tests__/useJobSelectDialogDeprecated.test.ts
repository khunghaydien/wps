import { act, renderHook } from '@testing-library/react-hooks';

import TimeTrackJobRepository from '../../../../repositories/time-tracking/TimeTrackJobRepository';

import { Jobable } from '../../../../domain/models/time-tracking/Job';

// @ts-ignore
import { __get__ } from '../useJobSelectDialogDeprecated';
import { JobTree } from '../useJobTree';

interface JobSelectDialogType<T extends Jobable> {
  readonly options: JobTree<T>;
  readonly selectedItem: T | null | undefined;
  initialize: () => Promise<void>;
  select: (level: number, job: T, key: string) => void;
  reset: () => void;
  publish: () => void;
  isVisitedItem: (arg0: T) => boolean;
}

const useJobSelectDialog = __get__('useJobSelectDialogDeprecated');

jest.mock(
  '../../../../repositories/time-tracking/TimeTrackJobRepository',
  () => {
    return {
      searchAll: jest.fn(),
    };
  }
);

beforeEach(() => {
  (TimeTrackJobRepository.searchAll as jest.Mock).mockReset();
  (TimeTrackJobRepository.searchAll as jest.Mock).mockImplementation(
    function* () {
      yield {
        id: '1',
        code: '1',
        name: '1',
        parentId: null,
        hasChildren: true,
      };
    }
  );
});

const toArray = async <T>(
  xs: AsyncGenerator<T, void, void>
): Promise<Array<T>> => {
  const arr = [];
  for await (const x of xs) {
    arr.push(x);
  }
  return arr;
};

const renderUseSelectDialog = (
  targetDate: string,
  repository?: { searchAll: Function }
) => {
  const onError = jest.fn();
  const onOk = jest.fn();
  const { result } = renderHook<any, JobSelectDialogType<Jobable>>(() =>
    useJobSelectDialog(targetDate, onOk, onError, repository)
  );

  return [result, onOk, onError] as const;
};

describe('initialize()', () => {
  it('should append jobs of root to job tree', async () => {
    // Arrange
    const targetDate = '2019-10-10';
    const [result] = renderUseSelectDialog(targetDate);

    // Act
    await act(async () => {
      await result.current.initialize();
    });

    // Assert
    const expected = [
      [
        {
          id: '1',
          code: '1',
          name: '1',
          parentId: null,
          hasChildren: true,
        },
      ],
    ];
    const actual = await Promise.all(
      result.current.options.map(({ value }) => value).map(toArray)
    );
    expect(actual).toStrictEqual(expected);
  });
  it('should fetch jobs of root over network', async () => {
    // Arrange
    const targetDate = '2019-10-10';
    const [result] = renderUseSelectDialog(targetDate);

    // Act
    await act(async () => {
      await result.current.initialize();
    });

    // Assert
    expect(TimeTrackJobRepository.searchAll).toHaveBeenCalledWith({
      codeOrName: '',
      empId: undefined,
      targetDate,
    });
  });
  it('should handle thrown error', async () => {
    // Arrange
    (TimeTrackJobRepository.searchAll as jest.Mock).mockImplementation(() => {
      throw new Error();
    });

    const targetDate = '2019-10-10';
    const [result, _onOk, onError] = renderUseSelectDialog(targetDate);

    // Act
    await act(async () => {
      await result.current.initialize();
    });

    // Assert
    expect(onError).toHaveBeenCalled();
  });
  it('should support custom lazy loading method', async () => {
    // Arrange
    const repository = { searchAll: jest.fn() };
    repository.searchAll.mockImplementation(function* () {
      yield {
        id: '2',
        code: '2',
        name: '2',
        parentId: null,
        hasChildren: true,
      };
    });
    const targetDate = '2019-10-10';
    const [result] = renderUseSelectDialog(targetDate, repository);

    // Act
    await act(async () => {
      await result.current.initialize();
    });

    // Assert
    expect(repository.searchAll).toHaveBeenCalled();
  });
});

describe('select()', () => {
  const getArgs = (result) => {
    const rootLevel = 0;
    const parent = {
      id: '1',
      code: '1',
      name: '1',
      parentId: null,
      hasChildren: true,
    };
    const parentKey = result.current.options[0].key;
    return [rootLevel, parent, parentKey];
  };

  it('should update breadcrumb', async () => {
    // Arrange
    const targetDate = '2019-10-10';
    const [result] = renderUseSelectDialog(targetDate);
    await act(async () => {
      await result.current.initialize();
    });

    // Act
    const [rootLevel, parent, parentKey] = getArgs(result);
    await act(async () => {
      await result.current.select(rootLevel, parent, parentKey);
    });

    // Assert
    expect(result.current.selectedItem).toStrictEqual(parent);
  });
  it('should append children of a given parent to job tree', async () => {
    // Arrange
    const targetDate = '2019-10-10';
    const [result] = renderUseSelectDialog(targetDate);
    await act(async () => {
      await result.current.initialize();
    });

    // Act
    const [rootLevel, parent, parentKey] = getArgs(result);
    await act(async () => {
      await result.current.select(rootLevel, parent, parentKey);
    });

    // Assert
    const expected = [
      [
        {
          id: '1',
          code: '1',
          name: '1',
          parentId: null,
          hasChildren: true,
        },
      ],
      [
        {
          id: '1',
          code: '1',
          name: '1',
          parentId: null,
          hasChildren: true,
        },
      ],
    ];
    const actual = await Promise.all(
      result.current.options.map(({ value }) => value).map(toArray)
    );
    expect(actual).toStrictEqual(expected);
  });
  it('should fetch children of a given parent over network', async () => {
    // Arrange
    const targetDate = '2019-10-10';
    const [result] = renderUseSelectDialog(targetDate);
    await act(async () => {
      await result.current.initialize();
    });

    // Act
    const [rootLevel, parent, parentKey] = getArgs(result);
    await act(async () => {
      await result.current.select(rootLevel, parent, parentKey);
    });

    // Assert
    expect(TimeTrackJobRepository.searchAll).toHaveBeenCalledWith({
      parent,
      codeOrName: '',
      empId: undefined,
      targetDate,
    });
  });
  it('should handle thrown error', async () => {
    // Arrange
    const targetDate = '2019-10-10';
    const [result, _onOk, onError] = renderUseSelectDialog(targetDate);
    await act(async () => {
      await result.current.initialize();
    });

    // throw error after appendRoot called
    (TimeTrackJobRepository.searchAll as jest.Mock).mockImplementation(() => {
      throw new Error();
    });

    // Act
    const [rootLevel, parent, parentKey] = getArgs(result);
    await act(async () => {
      await result.current.select(rootLevel, parent, parentKey);
    });

    // Assert
    expect(onError).toHaveBeenCalled();
  });
  it('should support custom lazy loading method', async () => {
    // Arrange
    const repository = { searchAll: jest.fn() };
    repository.searchAll.mockImplementation(function* () {
      yield {
        id: '2',
        code: '2',
        name: '2',
        parentId: null,
        hasChildren: true,
      };
    });
    const targetDate = '2019-10-10';
    const [result] = renderUseSelectDialog(targetDate, repository);
    await act(async () => {
      await result.current.initialize();
    });

    // Act
    const [rootLevel, parent, parentKey] = getArgs(result);
    await act(async () => {
      await result.current.select(rootLevel, parent, parentKey);
    });

    // Assert
    expect(repository.searchAll).toHaveBeenCalled();
  });
});

describe('publish()', () => {
  const getArgs = (result) => {
    const rootLevel = 0;
    const parent = {
      id: '1',
      code: '1',
      name: '1',
      parentId: null,
      hasChildren: true,
    };
    const parentKey = result.current.options[0].key;
    return [rootLevel, parent, parentKey];
  };

  it('should return selected job', async () => {
    // Arrange
    const targetDate = '2019-10-10';
    const [result, onOk] = renderUseSelectDialog(targetDate);

    await act(async () => {
      await result.current.initialize();
    });
    const [rootLevel, parent, parentKey] = getArgs(result);
    await act(async () => {
      await result.current.select(rootLevel, parent, parentKey);
    });

    // Act
    act(() => {
      result.current.publish();
    });

    // Assert
    const expected = {
      id: '1',
      code: '1',
      name: '1',
      parentId: null,
      hasChildren: true,
    };
    expect(onOk).toHaveBeenCalledWith(expected);
  });
});

describe('reset()', () => {
  const getArgs = (result) => {
    const rootLevel = 0;
    const parent = {
      id: '1',
      code: '1',
      name: '1',
      parentId: null,
      hasChildren: true,
    };
    const parentKey = result.current.options[0].key;
    return [rootLevel, parent, parentKey];
  };

  it('should reset options', async () => {
    // Arrange
    const targetDate = '2019-10-10';
    const [result] = renderUseSelectDialog(targetDate);

    await act(async () => {
      await result.current.initialize();
    });
    const [rootLevel, parent, parentKey] = getArgs(result);
    await act(async () => {
      await result.current.select(rootLevel, parent, parentKey);
    });

    // Act
    act(() => {
      result.current.reset();
    });

    // Assert
    expect(result.current.options).toStrictEqual([]);
  });
  it('should reset selectedItem', async () => {
    // Arrange
    const targetDate = '2019-10-10';
    const [result] = renderUseSelectDialog(targetDate);

    await act(async () => {
      await result.current.initialize();
    });
    const [rootLevel, parent, parentKey] = getArgs(result);
    await act(async () => {
      await result.current.select(rootLevel, parent, parentKey);
    });

    // Act
    act(() => {
      result.current.reset();
    });

    // Assert
    expect(result.current.selectedItem).toStrictEqual(null);
  });
});
