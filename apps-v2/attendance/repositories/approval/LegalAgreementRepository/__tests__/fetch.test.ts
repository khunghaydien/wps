import MockApi from '../../../../../../__tests__/mocks/ApiMock';
import fetch from '../fetch';
import * as fetchMock from './mocks/fetch.mock';

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do when monthly', async () => {
  // Arrange
  (MockApi.invoke as jest.Mock).mockResolvedValueOnce(
    fetchMock.defaultMonthlyValue
  );

  // Act
  const result = await fetch('xxxx');

  // Assert
  expect(result).toMatchSnapshot();
  expect(MockApi.invoke).toBeCalledTimes(1);
  expect(MockApi.invoke).toBeCalledWith({
    path: '/att/request/legal-agreement/get',
    param: { requestId: 'xxxx' },
  });
});

it('should do when monthly with originRequest', async () => {
  // Arrange
  (MockApi.invoke as jest.Mock).mockResolvedValueOnce(
    fetchMock.defaultMonthlyReapplyValue
  );

  // Act
  const result = await fetch('xxxx');

  // Assert
  expect(result).toMatchSnapshot();
  expect(MockApi.invoke).toBeCalledTimes(1);
  expect(MockApi.invoke).toBeCalledWith({
    path: '/att/request/legal-agreement/get',
    param: { requestId: 'xxxx' },
  });
});

it('should do when yearly', async () => {
  // Arrange
  (MockApi.invoke as jest.Mock).mockResolvedValueOnce(
    fetchMock.defaultYearlyValue
  );

  // Act
  const result = await fetch('xxxx');

  // Assert
  expect(result).toMatchSnapshot();
  expect(MockApi.invoke).toBeCalledTimes(1);
  expect(MockApi.invoke).toBeCalledWith({
    path: '/att/request/legal-agreement/get',
    param: { requestId: 'xxxx' },
  });
});

it('should do when yearly with originalRequest', async () => {
  // Arrange
  (MockApi.invoke as jest.Mock).mockResolvedValueOnce(
    fetchMock.defaultYearlyReapplyValue
  );

  // Act
  const result = await fetch('xxxx');

  // Assert
  expect(result).toMatchSnapshot();
  expect(MockApi.invoke).toBeCalledTimes(1);
  expect(MockApi.invoke).toBeCalledWith({
    path: '/att/request/legal-agreement/get',
    param: { requestId: 'xxxx' },
  });
});
