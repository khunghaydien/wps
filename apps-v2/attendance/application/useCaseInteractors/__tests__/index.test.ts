import * as useCaseInteractors from '..';

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

const presenterMethodMock = jest.fn();
const Presenter = {
  complete: jest.fn(() => presenterMethodMock('complete')),
  start: jest.fn(() => presenterMethodMock('start')),
  finally: jest.fn(() => presenterMethodMock('finally')),
  error: jest.fn((_?: unknown) => presenterMethodMock('error')),
  other: jest.fn((_: string) => presenterMethodMock('other')),
};

describe('wrap()', () => {
  it('should do.', async () => {
    // Arrange
    const m2 = jest.fn(() => 'output');
    const m1 = jest.fn(() => m2);
    const useCaseMethodMock = m1 as unknown as () => (
      arg: string
    ) => Promise<string>;

    // Act
    const useCase = useCaseInteractors.wrap(useCaseMethodMock)(Presenter);
    const result = await useCase('input');

    // Assert
    expect(result).toEqual('output');
    expect(m1).toBeCalledTimes(1);
    expect(m1).toBeCalledWith(Presenter);
    expect(m2).toBeCalledTimes(1);
    expect(m2).toBeCalledWith('input');
    expect(Presenter.start).toBeCalledTimes(1);
    expect(Presenter.complete).toBeCalledWith('output');
    expect(Presenter.finally).toBeCalledTimes(1);
    expect(Presenter.error).toBeCalledTimes(0);
    expect(Presenter.other).toBeCalledTimes(0);
    expect(presenterMethodMock).toBeCalledTimes(3);
    expect(presenterMethodMock).toHaveBeenNthCalledWith(1, 'start');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(2, 'complete');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(3, 'finally');
  });
  it('should do if presenter is function.', async () => {
    // Arrange
    const presenterCreator = jest.fn(() => Presenter);
    const m2 = jest.fn(() => 'output');
    const m1 = jest.fn(() => m2);
    const useCaseMethodMock = m1 as unknown as () => (
      arg: string
    ) => Promise<string>;

    // Act
    const useCase =
      useCaseInteractors.wrap(useCaseMethodMock)(presenterCreator);
    const result = await useCase('input');

    // Assert
    expect(result).toEqual('output');
    expect(m1).toBeCalledTimes(1);
    expect(m1).toBeCalledWith(Presenter);
    expect(m2).toBeCalledTimes(1);
    expect(m2).toBeCalledWith('input');
    expect(Presenter.complete).toBeCalledWith('output');
    expect(presenterMethodMock).toBeCalledTimes(3);
    expect(presenterMethodMock).toHaveBeenNthCalledWith(1, 'start');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(2, 'complete');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(3, 'finally');
    expect(presenterCreator).toBeCalledTimes(1);
    expect(presenterCreator).toHaveBeenNthCalledWith(1, 'input');
    expect(presenterCreator).toHaveBeenNthCalledWith(1, 'input');
    await useCase('input again');
    expect(presenterCreator).toBeCalledTimes(2);
    expect(presenterCreator).toHaveBeenNthCalledWith(2, 'input again');
  });

  it('should do if presenter has only complete.', async () => {
    // Arrange
    const Presenter = {
      complete: jest.fn(() => presenterMethodMock('complete')),
    };
    const m2 = jest.fn(() => 'output');
    const m1 = jest.fn(() => m2);
    const useCaseMethodMock = m1 as unknown as () => (
      arg: string
    ) => Promise<string>;

    // Act
    const useCase = useCaseInteractors.wrap(useCaseMethodMock)(Presenter);
    const result = await useCase('input');

    // Assert
    expect(result).toEqual('output');
    expect(m1).toBeCalledTimes(1);
    expect(m1).toBeCalledWith(Presenter);
    expect(m2).toBeCalledTimes(1);
    expect(m2).toBeCalledWith('input');
    expect(Presenter.complete).toBeCalledWith('output');
    expect(presenterMethodMock).toBeCalledTimes(1);
    expect(presenterMethodMock).toBeCalledWith('complete');
  });

  it('should do with custom presenter.', async () => {
    // Arrange
    const m2 = jest.fn(() => {
      Presenter.other('custom');
      return 'output';
    });
    const m1 = jest.fn(() => m2);
    const useCaseMethodMock = m1 as unknown as () => (
      arg: string
    ) => Promise<string>;

    // Act
    const useCase = useCaseInteractors.wrap(useCaseMethodMock)(Presenter);
    const result = await useCase('input');

    // Assert
    expect(result).toEqual('output');
    expect(m1).toBeCalledTimes(1);
    expect(m1).toBeCalledWith(Presenter);
    expect(m2).toBeCalledTimes(1);
    expect(m2).toBeCalledWith('input');
    expect(Presenter.complete).toBeCalledTimes(1);
    expect(Presenter.complete).toBeCalledWith('output');
    expect(Presenter.other).toBeCalledTimes(1);
    expect(Presenter.other).toBeCalledWith('custom');
    expect(Presenter.error).toBeCalledTimes(0);
    expect(presenterMethodMock).toBeCalledTimes(4);
    expect(presenterMethodMock).toHaveBeenNthCalledWith(1, 'start');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(2, 'other');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(3, 'complete');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(4, 'finally');
  });

  it('should execute finally if error is occurred', async () => {
    // Arrange
    const error = new Error('Test');
    const m2 = jest.fn(() => {
      throw error;
    });
    const m1 = jest.fn(() => m2);
    const useCaseMethodMock = m1 as unknown as () => (
      arg: string
    ) => Promise<string>;

    // Act
    const useCase = useCaseInteractors.wrap(useCaseMethodMock)(Presenter);
    const result = useCase('input');

    // Assert
    await expect(result).rejects.toBe(error);
    expect(m1).toBeCalledTimes(1);
    expect(m1).toBeCalledWith(Presenter);
    expect(m2).toBeCalledTimes(1);
    expect(m2).toBeCalledWith('input');
    expect(Presenter.start).toBeCalledTimes(1);
    expect(Presenter.complete).toBeCalledTimes(0);
    expect(Presenter.other).toBeCalledTimes(0);
    expect(Presenter.error).toBeCalledTimes(1);
    expect(Presenter.error).toBeCalledWith(error);
    expect(Presenter.finally).toBeCalledTimes(1);
    expect(presenterMethodMock).toBeCalledTimes(3);
    expect(presenterMethodMock).toHaveBeenNthCalledWith(1, 'start');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(2, 'error');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(3, 'finally');
  });

  it('should execute finally if error is occurred in start', async () => {
    // Arrange
    const error = new Error('Test');
    const m2 = jest.fn(() => 'output');
    const m1 = jest.fn(() => m2);
    const useCaseMethodMock = m1 as unknown as () => (
      arg: string
    ) => Promise<string>;
    Presenter.start.mockImplementationOnce(() => {
      presenterMethodMock('start');
      throw error;
    });

    // Act
    const useCase = useCaseInteractors.wrap(useCaseMethodMock)(Presenter);
    const result = useCase('input');

    // Assert
    await expect(result).rejects.toBe(error);
    expect(m1).toBeCalledTimes(1);
    expect(m1).toBeCalledWith(Presenter);
    expect(m2).toBeCalledTimes(0);
    expect(Presenter.start).toBeCalledTimes(1);
    expect(Presenter.complete).toBeCalledTimes(0);
    expect(Presenter.other).toBeCalledTimes(0);
    expect(Presenter.error).toBeCalledTimes(1);
    expect(Presenter.error).toBeCalledWith(error);
    expect(Presenter.finally).toBeCalledTimes(1);
    expect(presenterMethodMock).toBeCalledTimes(3);
    expect(presenterMethodMock).toHaveBeenNthCalledWith(1, 'start');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(2, 'error');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(3, 'finally');
  });

  it('should execute finally if error is occurred in complete', async () => {
    // Arrange
    const error = new Error('Test');
    const m2 = jest.fn(() => 'output');
    const m1 = jest.fn(() => m2);
    const useCaseMethodMock = m1 as unknown as () => (
      arg: string
    ) => Promise<string>;
    Presenter.complete.mockImplementationOnce(() => {
      presenterMethodMock('complete');
      throw error;
    });

    // Act
    const useCase = useCaseInteractors.wrap(useCaseMethodMock)(Presenter);
    const result = useCase('input');

    // Assert
    await expect(result).rejects.toBe(error);
    expect(m1).toBeCalledTimes(1);
    expect(m1).toBeCalledWith(Presenter);
    expect(m2).toBeCalledTimes(1);
    expect(m2).toBeCalledWith('input');
    expect(Presenter.start).toBeCalledTimes(1);
    expect(Presenter.complete).toBeCalledTimes(1);
    expect(Presenter.other).toBeCalledTimes(0);
    expect(Presenter.error).toBeCalledTimes(1);
    expect(Presenter.error).toBeCalledWith(error);
    expect(Presenter.finally).toBeCalledTimes(1);
    expect(presenterMethodMock).toBeCalledTimes(4);
    expect(presenterMethodMock).toHaveBeenNthCalledWith(1, 'start');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(2, 'complete');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(3, 'error');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(4, 'finally');
  });

  it('should execute error once if error is catch in useCase.', async () => {
    // Arrange
    const error = new Error('Test');
    const m2 = jest.fn(() => {
      try {
        throw error;
      } catch (e) {
        Presenter.error(e);
        return 'inner catch';
      }
    });
    const m1 = jest.fn(() => m2);
    const useCaseMethodMock = m1 as unknown as () => (
      arg: string
    ) => Promise<string>;

    // Act
    const useCase = useCaseInteractors.wrap(useCaseMethodMock)(Presenter);
    const result = await useCase('input');

    // Assert
    expect(result).toBe('inner catch');
    expect(m1).toBeCalledTimes(1);
    expect(m1).toBeCalledWith(Presenter);
    expect(m2).toBeCalledTimes(1);
    expect(m2).toBeCalledWith('input');
    expect(Presenter.start).toBeCalledTimes(1);
    expect(Presenter.complete).toBeCalledTimes(1);
    expect(Presenter.other).toBeCalledTimes(0);
    expect(Presenter.error).toBeCalledTimes(1);
    expect(Presenter.error).toBeCalledWith(error);
    expect(Presenter.finally).toBeCalledTimes(1);
    expect(presenterMethodMock).toBeCalledTimes(4);
    expect(presenterMethodMock).toHaveBeenNthCalledWith(1, 'start');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(2, 'error');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(3, 'complete');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(4, 'finally');
  });
});

describe('wrapAll()', () => {
  it('should reduce', async () => {
    // Arrange
    const m2 = jest.fn(() => 'output');
    const m1 = jest.fn(() => m2);
    const useCaseMethodMock = m1 as unknown as (
      _: unknown
    ) => (arg: string) => Promise<string>;
    const interactors = {
      test1: useCaseMethodMock,
      test2: jest.fn(),
    };

    // Act
    const result = useCaseInteractors.wrapAll(interactors);

    // Assert
    expect(result).toHaveProperty('test1');
    expect(result).toHaveProperty('test2');
    expect(result).not.toHaveProperty('test3');

    expect(m1).toBeCalledTimes(0);
    expect(m2).toBeCalledTimes(0);
    const resultTest1 = await result.test1(Presenter)('input');
    expect(resultTest1).toEqual('output');
    expect(m1).toBeCalledTimes(1);
    expect(m1).toBeCalledWith(Presenter);
    expect(m2).toBeCalledTimes(1);
    expect(m2).toBeCalledWith('input');
    expect(Presenter.start).toBeCalledTimes(1);
    expect(Presenter.complete).toBeCalledWith('output');
    expect(Presenter.finally).toBeCalledTimes(1);
    expect(Presenter.error).toBeCalledTimes(0);
    expect(Presenter.other).toBeCalledTimes(0);
    expect(presenterMethodMock).toBeCalledTimes(3);
    expect(presenterMethodMock).toHaveBeenNthCalledWith(1, 'start');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(2, 'complete');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(3, 'finally');
  });
});

describe('create()', () => {
  it('should do', async () => {
    // Arrange
    const m2 = jest.fn(() => 'output');
    const m1 = jest.fn(() => m2);
    const useCaseMethodMock = m1 as unknown as (
      _: unknown
    ) => (arg: string) => Promise<string>;
    const interactors = {
      test1: useCaseMethodMock,
      test2: jest.fn(),
    };

    // Act
    const result = useCaseInteractors.create(interactors);

    // Assert
    expect(result).toHaveProperty('test1');
    expect(result).toHaveProperty('test2');
    expect(result).not.toHaveProperty('test3');

    expect(m1).toBeCalledTimes(0);
    expect(m2).toBeCalledTimes(0);
    const resultTest1 = await result.test1(Presenter)('input');
    expect(resultTest1).toEqual('output');
    expect(m1).toBeCalledTimes(1);
    expect(m1).toBeCalledWith(Presenter);
    expect(m2).toBeCalledTimes(1);
    expect(m2).toBeCalledWith('input');
    expect(Presenter.start).toBeCalledTimes(1);
    expect(Presenter.complete).toBeCalledWith('output');
    expect(Presenter.finally).toBeCalledTimes(1);
    expect(Presenter.error).toBeCalledTimes(0);
    expect(Presenter.other).toBeCalledTimes(0);
    expect(presenterMethodMock).toBeCalledTimes(3);
    expect(presenterMethodMock).toHaveBeenNthCalledWith(1, 'start');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(2, 'complete');
    expect(presenterMethodMock).toHaveBeenNthCalledWith(3, 'finally');
  });
});
