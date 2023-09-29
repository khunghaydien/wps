import ApiMock from '../../../../__tests__/mocks/ApiMock';
import repository from '../ManageCommuteCountRepository';

beforeEach(() => {
  ApiMock.reset();
  ApiMock.invoke.mockReset();
});

describe('update()', () => {
  it('should be called by correct params', async () => {
    // Arrange
    ApiMock.invoke.mockResolvedValueOnce();

    // Act
    await repository.update({
      commuteCount: {
        forwardCount: 0,
        backwardCount: 1,
      },
      targetDate: '2020-01-01',
      employeeId: 'employeeId',
    });

    // Assert
    expect(ApiMock.invoke).toBeCalledWith({
      path: '/att/daily-commute-count/save',
      param: {
        empId: 'employeeId',
        targetDate: '2020-01-01',
        commuteForwardCount: 0,
        commuteBackwardCount: 1,
      },
    });
  });
});
