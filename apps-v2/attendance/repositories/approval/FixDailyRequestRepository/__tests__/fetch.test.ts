import MockApi from '../../../../../../__tests__/mocks/ApiMock';
import fetch from '../fetch';
import * as fetchMock from './mocks/fetch.mock';

it('should do', async () => {
  // Arrange
  (MockApi.invoke as jest.Mock).mockResolvedValueOnce(fetchMock.defaultValue);

  // Act
  const result = await fetch('xxxx');

  // Assert
  expect(result).toMatchSnapshot();
  expect(MockApi.invoke).toBeCalledTimes(1);
  expect(MockApi.invoke).toBeCalledWith({
    path: '/att/request/fix-daily/get',
    param: { requestId: 'xxxx' },
  });
});
