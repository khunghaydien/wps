import Collection, { bind } from '../Collection';

type TestCollection = {
  A: string;
  B: string;
  C: string;
};

describe('default()', () => {
  it('Initialize', () => {
    const collection = Collection<TestCollection>('TestCollection');
    expect(collection).toHaveProperty('register');
  });
  it('Returns collection', () => {
    const collection = Collection<TestCollection>('TestCollection');
    collection.register({
      A: 'a',
      B: 'b',
      C: 'c',
    });
    expect(collection()).toEqual({
      A: 'a',
      B: 'b',
      C: 'c',
    });
  });
  it("Throws error if it doesn't call `register()`", () => {
    const collection = Collection<TestCollection>('TestCollection');
    expect(() => collection()).toThrowError();
  });
});

describe('bind', () => {
  it('should wrap.', async () => {
    // Arrange
    const collection = {
      deep1: {
        deep11: {
          deep111: jest.fn(() => 'output'),
        },
        deep12: jest.fn(),
      },
      deep2: jest.fn(),
    };

    // Act
    const buildedCollection = bind(collection, 'input');

    // Assert
    expect(buildedCollection).toHaveProperty('deep1.deep11.deep111');
    expect(buildedCollection).toHaveProperty('deep1.deep12');
    expect(buildedCollection).not.toHaveProperty('deep1.deep13');
    expect(buildedCollection).toHaveProperty('deep2');
    expect(buildedCollection).not.toHaveProperty('deep3');
    expect(buildedCollection.deep1.deep11.deep111).toBe('output');
    expect(collection.deep1.deep11.deep111).toBeCalledWith('input');
    expect(collection.deep1.deep12).toBeCalledWith('input');
    expect(collection.deep2).toBeCalledWith('input');
  });
});
