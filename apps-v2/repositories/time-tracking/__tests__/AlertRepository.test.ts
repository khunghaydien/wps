import ApiMock from '../../../../__tests__/mocks/ApiMock';
import AlertRepository from '../AlertRepository';
import { alerts } from './mocks/Responses';

beforeEach(() => {
  ApiMock.mockImplement('/time-track/alert/list', [
    [
      { empId: undefined, startDate: '2019-10-01', endDate: '2019-11-01' },
      alerts,
    ],
  ]);
});

afterEach(() => {
  ApiMock.reset();
});

test('search()', async () => {
  // Arrange
  const param = {
    startDate: '2019-10-01',
    endDate: '2019-11-01',
  };

  const expected = {
    '2019-10-01': [
      {
        level: 'Warn',
        code: 'TIME_ATT_CONSISTENCY',
      },
    ],
    '2019-10-02': [
      {
        level: 'Warn',
        code: 'TIME_ATT_CONSISTENCY',
      },
    ],
    '2019-10-03': [
      {
        level: 'Warn',
        code: 'TIME_ATT_CONSISTENCY',
      },
    ],
    '2019-10-04': [
      {
        level: 'Warn',
        code: 'TIME_ATT_CONSISTENCY',
      },
    ],
    '2019-10-07': [
      {
        level: 'Warn',
        code: 'TIME_ATT_CONSISTENCY',
      },
    ],
    '2019-10-08': [
      {
        level: 'Warn',
        code: 'TIME_ATT_CONSISTENCY',
      },
    ],
    '2019-10-09': [
      {
        level: 'Warn',
        code: 'TIME_ATT_CONSISTENCY',
      },
    ],
    '2019-10-10': [
      {
        level: 'Warn',
        code: 'TIME_ATT_CONSISTENCY',
      },
    ],
  };

  // Act
  const actual = await AlertRepository.search(param);

  // Assert
  expect(actual).toStrictEqual(expected);
});
