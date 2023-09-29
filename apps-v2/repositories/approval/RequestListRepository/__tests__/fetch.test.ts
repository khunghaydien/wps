import MockApi from '../../../../../__tests__/mocks/ApiMock';
import fetch from '../fetch';
import { defaultValue } from './mocks/fetch.mock';

beforeEach(() => {
  (MockApi.invoke as jest.Mock).mockClear();
});

it('should do', async () => {
  // Arrange
  (MockApi.invoke as jest.Mock).mockResolvedValueOnce({
    requestList: defaultValue,
  });

  // Act
  const result = await fetch();

  // Assert
  expect(result).toEqual(defaultValue);
  expect(MockApi.invoke).toBeCalledTimes(1);
  expect(MockApi.invoke).toBeCalledWith({
    path: '/approval/request/all',
    param: {},
  });
});
