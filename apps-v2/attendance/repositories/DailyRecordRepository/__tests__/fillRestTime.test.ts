import Api from '../../../../../__tests__/mocks/ApiMock';
import fillRestTime from '../fillRestTime';

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValue('response');

  // Act
  const result = await fillRestTime({
    targetDate: '2022-02-22',
    employeeId: 'employeeId',
  });

  // Assert
  expect(result).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-rest-time/fill',
    param: {
      empId: 'employeeId',
      targetDate: '2022-02-22',
    },
  });
});

it('should do without employeeId.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValue('response');

  // Act
  const result = await fillRestTime({
    targetDate: '2022-02-22',
  });

  // Assert
  expect(result).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-rest-time/fill',
    param: {
      empId: null,
      targetDate: '2022-02-22',
    },
  });
});

it('should do without targetDate.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValue('response');

  // Act
  const result = await fillRestTime({
    employeeId: 'employeeId',
  });

  // Assert
  expect(result).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-rest-time/fill',
    param: {
      empId: 'employeeId',
      targetDate: null,
    },
  });
});

it('should do without param.', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValue('response');

  // Act
  const result = await fillRestTime();

  // Assert
  expect(result).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-rest-time/fill',
    param: {
      empId: null,
      targetDate: null,
    },
  });
});
