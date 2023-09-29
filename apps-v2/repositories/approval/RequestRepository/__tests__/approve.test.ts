import MockApi from '../../../../../__tests__/mocks/ApiMock';
import approve from '../approve';

beforeEach(() => {
  (MockApi.invoke as jest.Mock).mockClear();
});

it('should do', async () => {
  // Arrange
  (MockApi.invoke as jest.Mock).mockResolvedValueOnce(null);

  // Act
  const result = await approve({
    ids: ['X1', 'X2', 'X3'],
    comment: 'comment',
  });

  // Assert
  expect(result).toBeNull();
  expect(MockApi.invoke).toBeCalledTimes(1);
  expect(MockApi.invoke).toBeCalledWith({
    path: '/approval/request/approve',
    param: {
      requestIdList: ['X1', 'X2', 'X3'],
      comment: 'comment',
    },
  });
});
