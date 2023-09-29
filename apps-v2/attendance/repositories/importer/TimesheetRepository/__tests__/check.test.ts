import Api from '../../../../../../__tests__/mocks/ApiMock';
import check from '../check';

beforeEach(() => {
  jest.clearAllMocks();
});

it('should execute', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValue({
    errorList: [
      {
        errorDate: '2023-01-01',
        errorMessage: 'errorMessage',
      },
    ],
  });

  // Act
  const result = await check({
    employeeId: 'employeeId',
    startDate: 'startDate',
    endDate: 'endDate',
  });

  // Assert
  expect(result).toEqual(new Map([['2023-01-01', ['errorMessage']]]));
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/timesheet-import/check',
    param: {
      empId: 'employeeId',
      startDate: 'startDate',
      endDate: 'endDate',
    },
  });
});
