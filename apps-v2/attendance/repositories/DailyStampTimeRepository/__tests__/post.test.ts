import {
  CLOCK_TYPE,
  STAMP_SOURCE,
} from '@attendance/domain/models/DailyStampTime';

import Api from '../../../../../__tests__/mocks/ApiMock';
import post from '../post';

beforeEach(() => {
  jest.clearAllMocks();
});

it('should do with min param', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce('response');

  // Act
  const response = await post({
    clockType: CLOCK_TYPE.IN,
    source: STAMP_SOURCE.WEB,
  });

  // Assert
  expect(response).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-time/stamp',
    param: {
      clockType: CLOCK_TYPE.IN,
      source: STAMP_SOURCE.WEB,
      comment: '',
    },
  });
});

it('should do with comment', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce('response');

  // Act
  const response = await post({
    clockType: CLOCK_TYPE.IN,
    source: STAMP_SOURCE.WEB,
    comment: 'abc',
  });

  // Assert
  expect(response).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-time/stamp',
    param: {
      clockType: CLOCK_TYPE.IN,
      source: STAMP_SOURCE.WEB,
      comment: 'abc',
    },
  });
});

it.each`
  latitude | longitude
  ${null}  | ${null}
  ${0}     | ${0}
  ${1}     | ${0}
  ${0}     | ${1}
  ${2}     | ${3}
`('should do with location', async ({ latitude, longitude }) => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce('response');

  // Act
  const response = await post({
    clockType: CLOCK_TYPE.IN,
    source: STAMP_SOURCE.WEB,
    location: {
      latitude,
      longitude,
    },
  });

  // Assert
  expect(response).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-time/stamp',
    param: {
      clockType: CLOCK_TYPE.IN,
      source: STAMP_SOURCE.WEB,
      comment: '',
      latitude,
      longitude,
    },
  });
});

it.each`
  forwardCount | backwardCount
  ${null}      | ${null}
  ${0}         | ${null}
  ${null}      | ${0}
  ${0}         | ${0}
  ${1}         | ${0}
  ${0}         | ${1}
  ${2}         | ${3}
`('should do with commute count', async ({ forwardCount, backwardCount }) => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce('response');

  // Act
  const response = await post({
    clockType: CLOCK_TYPE.IN,
    source: STAMP_SOURCE.WEB,
    commuteCount: {
      forwardCount,
      backwardCount,
    },
  });

  // Assert
  expect(response).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-time/stamp',
    param: {
      clockType: CLOCK_TYPE.IN,
      source: STAMP_SOURCE.WEB,
      comment: '',
      commuteForwardCount: forwardCount,
      commuteBackwardCount: backwardCount,
    },
  });
});

it('should do with max param', async () => {
  // Arrange
  const MockApi = Api.invoke as jest.Mock;
  MockApi.mockResolvedValueOnce('response');

  // Act
  const response = await post({
    clockType: CLOCK_TYPE.IN,
    source: STAMP_SOURCE.WEB,
    comment: 'abc',
    location: {
      latitude: 3,
      longitude: 4,
    },
    commuteCount: {
      forwardCount: 1,
      backwardCount: 2,
    },
  });

  // Assert
  expect(response).toBe('response');
  expect(MockApi).toBeCalledTimes(1);
  expect(MockApi).toBeCalledWith({
    path: '/att/daily-time/stamp',
    param: {
      clockType: CLOCK_TYPE.IN,
      source: STAMP_SOURCE.WEB,
      comment: 'abc',
      latitude: 3,
      longitude: 4,
      commuteForwardCount: 1,
      commuteBackwardCount: 2,
    },
  });
});
