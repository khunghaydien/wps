import create from '../create';

it('should create event', () => {
  // Arrange
  const mock = jest.fn();

  // Act
  const event = create('EVENT_NAME');
  const unsubscribe = event.subscribe(mock);
  event.publish('test');
  unsubscribe();
  event.publish('test');

  // Assert
  expect(event.eventName).toEqual('EVENT_NAME');
  expect(mock).toBeCalledTimes(1);
  expect(mock).toBeCalledWith('test');
});
