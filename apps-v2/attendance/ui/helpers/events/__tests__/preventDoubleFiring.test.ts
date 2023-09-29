import preventDoubleFiring from '../preventDoubleFiring';

const timer = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

it('should not do if double click.', async () => {
  // Arrange
  const mock = jest.fn();

  // Act
  const method = preventDoubleFiring(mock);
  method();
  method();

  // Assert
  expect(mock).toBeCalledTimes(1);
});

it('should do twice after 500ms', async () => {
  // Arrange
  const mock = jest.fn();

  // Act
  const method = preventDoubleFiring(mock);
  method();
  await timer(600);
  method();

  // Assert
  expect(mock).toBeCalledTimes(2);
});

it('should do once before 500ms', async () => {
  // Arrange
  const mock = jest.fn();

  // Act
  const method = preventDoubleFiring(mock);
  method();
  await timer(300);
  method();

  // Assert
  expect(mock).toBeCalledTimes(1);
});
