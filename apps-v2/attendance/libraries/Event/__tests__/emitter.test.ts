import Emitter from '../emitter';

it('should subscribe to general event', () => {
  // Arrange
  const mock = jest.fn();
  Emitter.subscribe('test', mock);

  // Act
  Emitter.publish('test');

  // Assert
  expect(mock).toBeCalledTimes(1);
  expect(mock).toBeCalledWith(undefined);
});

it('should subscribe to custom event', () => {
  // Arrange
  const mock = jest.fn();
  Emitter.subscribe('test.customName', mock);

  // Act
  Emitter.publish('test');

  // Assert
  expect(mock).toBeCalledTimes(1);
  expect(mock).toBeCalledWith(undefined);
});

it('should subscribe to custom event if it has two separator(.)', () => {
  // Arrange
  const mock = jest.fn();
  Emitter.subscribe('test.customName.customName', mock);

  // Act
  Emitter.publish('test');

  // Assert
  expect(mock).toBeCalledTimes(1);
  expect(mock).toBeCalledWith(undefined);
});

it('should subscribe with multiple', () => {
  // Arrange
  const mock = jest.fn();
  Emitter.subscribe(['test1', 'test2'], mock);

  // Act
  Emitter.publish('test1');
  Emitter.publish('test2');

  // Assert
  expect(mock).toBeCalledTimes(2);
});

it('should not subscribe if it is not publish', () => {
  // Arrange
  const mock = jest.fn();
  Emitter.subscribe('test', mock);

  // Act
  Emitter.publish('TEST');

  // Assert
  expect(mock).toBeCalledTimes(0);
});

it('should not subscribe if it has not event name', () => {
  // Arrange
  const mock = jest.fn();
  Emitter.subscribe('', mock);

  // Act
  Emitter.publish('test');

  // Assert
  expect(mock).toBeCalledTimes(0);
});

it('should add subscription to general event', () => {
  // Arrange
  const mock1 = jest.fn();
  const mock2 = jest.fn();
  Emitter.subscribe('test', mock1);
  Emitter.subscribe('test', mock2);

  // Act
  Emitter.publish('test');

  // Assert
  expect(mock1).toBeCalledTimes(1);
  expect(mock1).toBeCalledWith(undefined);
  expect(mock2).toBeCalledTimes(1);
  expect(mock2).toBeCalledWith(undefined);
});

it('should rewrite subscription to custom event', () => {
  // Arrange
  const mock1 = jest.fn();
  const mock2 = jest.fn();
  Emitter.subscribe('test.customName', mock1);
  Emitter.subscribe('test.customName', mock2);

  // Act
  Emitter.publish('test');

  // Assert
  expect(mock1).toBeCalledTimes(0);
  expect(mock2).toBeCalledTimes(1);
  expect(mock2).toBeCalledWith(undefined);
});

it('should publish with parameter', () => {
  // Arrange
  const mock = jest.fn();
  Emitter.subscribe('test.customName', mock);

  // Act
  Emitter.publish('test', 'argument');

  // Assert
  expect(mock).toBeCalledTimes(1);
  expect(mock).toBeCalledWith('argument');
});

it('should unsubscribe all event', () => {
  // Arrange
  const mock1 = jest.fn();
  const mock2 = jest.fn();
  Emitter.subscribe('test', mock1);
  Emitter.subscribe('test.customName', mock2);
  Emitter.unsubscribe('test');

  // Act
  Emitter.publish('test');

  // Assert
  expect(mock1).toBeCalledTimes(0);
  expect(mock2).toBeCalledTimes(0);
});

it('should unsubscribe only custom event', () => {
  // Arrange
  const mock1 = jest.fn();
  const mock2 = jest.fn();
  Emitter.subscribe('test', mock1);
  Emitter.subscribe('test.customName', mock2);
  Emitter.unsubscribe('test.customName');

  // Act
  Emitter.publish('test');

  // Assert
  expect(mock1).toBeCalledTimes(1);
  expect(mock1).toBeCalledWith(undefined);
  expect(mock2).toBeCalledTimes(0);
});

it('should unsubscribe with callback', () => {
  // Arrange
  const mock1 = jest.fn();
  const mock2 = jest.fn();
  const unsubscribe = Emitter.subscribe('test', mock1);
  Emitter.subscribe('test.customName', mock2);

  // Act
  unsubscribe();

  // Assert
  Emitter.publish('test');
  expect(mock1).toBeCalledTimes(0);
  expect(mock2).toBeCalledTimes(1);
  expect(mock2).toBeCalledWith(undefined);
});

it('should unsubscribe multiple with callback', () => {
  // Arrange
  const mock = jest.fn();
  const unsubscribe = Emitter.subscribe(['test1', 'test2'], mock);

  // Act
  unsubscribe();

  // Assert
  Emitter.publish('test1');
  Emitter.publish('test2');
  expect(mock).toBeCalledTimes(0);
});

it('should unsubscribe with multiple', () => {
  // Arrange
  const mock1 = jest.fn();
  const mock2 = jest.fn();
  Emitter.subscribe('test1', mock1);
  Emitter.subscribe('test2', mock2);
  Emitter.unsubscribe(['test1', 'test2']);

  // Act
  Emitter.publish('test1');
  Emitter.publish('test2');

  // Assert
  expect(mock1).toBeCalledTimes(0);
  expect(mock2).toBeCalledTimes(0);
});

it('should not unsubscribe if it has not event name', () => {
  // Arrange
  const mock = jest.fn();
  Emitter.subscribe('test', mock);
  Emitter.unsubscribe('');

  // Act
  Emitter.publish('test');

  // Assert
  expect(mock).toBeCalledTimes(1);
});

it('should not stop if subscription occur error', () => {
  // Arrange
  const mock1 = jest.fn();
  const mock2 = jest.fn();
  mock1.mockImplementationOnce(() => {
    throw new Error('Error');
  });
  Emitter.subscribe('test', mock1);
  Emitter.subscribe('test', mock2);

  // Act
  Emitter.publish('test');

  // Assert
  expect(mock1).toBeCalledTimes(1);
  expect(mock2).toBeCalledTimes(1);
});

it('should clear', () => {
  // Arrange
  const mock = jest.fn();
  Emitter.subscribe('test', mock);

  // Act
  Emitter.clear();
  Emitter.publish('test');

  // Assert
  expect(mock).toBeCalledTimes(0);
});
