import snapshotDiff from 'snapshot-diff';

import MockApi from '../../../../../../__tests__/mocks/ApiMock';
import fetch from '../fetch';
import { defaultValue } from './mocks/fetch.mock';

it('should do', async () => {
  // Arrange
  (MockApi.invoke as jest.Mock).mockResolvedValueOnce(defaultValue);

  // Act
  const result = await fetch('xxxx');

  // Assert
  expect(snapshotDiff(defaultValue, result)).toMatchSnapshot();
  expect(MockApi.invoke).toBeCalledTimes(1);
  expect(MockApi.invoke).toBeCalledWith({
    path: '/att/request/monthly/get',
    param: { requestId: 'xxxx' },
  });
});
