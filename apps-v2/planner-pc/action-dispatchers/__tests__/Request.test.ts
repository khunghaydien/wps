import ApiMock from '../../../../__tests__/mocks/ApiMock';
import Request from '../Request';
import { errorResponse, requestAlert } from './mocks/Responses';
import Store from './mocks/Store';

describe('App', () => {
  // Arrange
  afterEach(() => {
    ApiMock.reset();
  });

  describe('fetchAlert()', () => {
    it('should dispatch actions to fetch state while blocking user interaction', async () => {
      // Arrange
      ApiMock.mockReturnValue({
        '/time-track/request-alert/get': requestAlert,
      });

      const store = Store.create();
      const request = Request(store.dispatch);

      // Act
      await request.fetchAlert({
        targetDate: '2020-01-15',
      });

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
    it('throws API errors, then it should catch API errors', async () => {
      // Arrange
      ApiMock.mockReturnValue({
        '/time-track/request-alert/get': errorResponse,
      });

      const store = Store.create();
      const request = Request(store.dispatch);

      // Act
      await request.fetchAlert({
        targetDate: '2019-09-16',
      });

      // Assert
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
