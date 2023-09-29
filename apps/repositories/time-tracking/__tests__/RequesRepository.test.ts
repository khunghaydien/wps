import ApiMock from '../../../../__tests__/mocks/ApiMock';
import RequestRepository from '../RequestRepository';

const requestMock = {
  request: {
    id: '1',
    startDate: '2021-02-01',
    endDate: '2021-02-28',
    alert: true,
  },
};

beforeEach(() => {
  ApiMock.mockImplement('/time-track/request-alert/get', [
    [{ empId: undefined, targetDate: '2021-03-30' }, requestMock],
  ]);
});

afterEach(() => {
  ApiMock.reset();
});

test('fetchAlert()', async () => {
  // Arrange
  const param = {
    targetDate: '2021-03-30',
  };

  // Act
  const actual = await RequestRepository.fetchAlert(param);

  // Assert
  const expected = {
    id: '1',
    startDate: new Date(2021, 1, 1),
    endDate: new Date(2021, 1, 28),
    alert: true,
  };

  expect(actual).toStrictEqual(expected);
});
